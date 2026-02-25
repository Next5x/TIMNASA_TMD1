"use strict";

// ================== RENDER DEPLOYMENT SERVER ==================
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => { res.send('TIMNASA-MD Is Online 24/7 on Render'); });
app.listen(port, () => { console.log(`Server started on port ${port}`); });
// ==============================================================

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const logger_1 = __importDefault(require("@whiskeysockets/baileys/lib/Utils/logger"));
const logger = logger_1.default.child({});
logger.level = 'silent';
const pino = require("pino");
const boom_1 = require("@hapi/boom");
const conf = require("./set");
const axios = require("axios");
let fs = require("fs-extra");
let path = require("path");
const FileType = require('file-type');
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const { verifierEtatJid , recupererActionJid } = require("./bdd/antilien");
const { atbverifierEtatJid , atbrecupererActionJid } = require("./bdd/antibot");
let evt = require(__dirname + "/framework/zokou");
const {isUserBanned} = require("./bdd/banUser");
const {isGroupBanned} = require("./bdd/banGroup");
const {isGroupOnlyAdmin} = require("./bdd/onlyAdmin");
let { reagir } = require(__dirname + "/framework/app");

var session = conf.session.replace(/TIMNASA-MD;;;=>/g,"");
const prefixe = conf.PREFIXE;

// --- AUTHENTICATION ---
async function authentification() {
    try {
        if (!fs.existsSync(__dirname + "/auth/creds.json")) {
            console.log("Connecting...");
            await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
        } else if (fs.existsSync(__dirname + "/auth/creds.json") && session != "zokk") {
            await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
        }
    } catch (e) {
        console.log("Session Invalid " + e);
        return;
    }
}
authentification();

const store = (0, baileys_1.makeInMemoryStore)({
    logger: pino().child({ level: "silent", stream: "store" }),
});

setTimeout(() => {
    async function main() {
        const { version } = await (0, baileys_1.fetchLatestBaileysVersion)();
        const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(__dirname + "/auth");
        
        const sockOptions = {
            version,
            logger: pino({ level: "silent" }),
            browser: ['Timnasa MD', "Chrome", "1.0.0"],
            printQRInTerminal: true,
            auth: {
                creds: state.creds,
                keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
            },
            generateHighQualityLinkPreview: true,
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
                    return msg.message || undefined;
                }
                return { conversation: 'Error!' };
            }
        };

        const zk = (0, baileys_1.default)(sockOptions);
        store.bind(zk.ev);

        // ================== AUTO REACT STATUS ==================
        if (conf.AUTOREACT_STATUS === "yes") {
            zk.ev.on("messages.upsert", async (m) => {
                const { messages } = m;
                for (const message of messages) {
                    if (message.key && message.key.remoteJid === "status@broadcast") {
                        try {
                            const reactionEmojis = ["❤️", "🔥", "👍", "😂", "✨", "🙌"];
                            const randomEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
                            await zk.readMessages([message.key]);
                            await zk.sendMessage(message.key.remoteJid, { react: { text: randomEmoji, key: message.key } });
                        } catch (e) { console.error("Status reaction failed"); }
                    }
                }
            });
        }

        // ================== MESSAGE HANDLING ==================
        zk.ev.on("messages.upsert", async (m) => {
            const { messages } = m;
            const ms = messages[0];
            if (!ms.message) return;

            const decodeJid = (jid) => {
                if (!jid) return jid;
                if (/:\d+@/gi.test(jid)) {
                    let decode = (0, baileys_1.jidDecode)(jid) || {};
                    return decode.user && decode.server && decode.user + '@' + decode.server || jid;
                } else return jid;
            };

            const mtype = (0, baileys_1.getContentType)(ms.message);
            const texte = mtype == "conversation" ? ms.message.conversation : mtype == "imageMessage" ? ms.message.imageMessage?.caption : mtype == "videoMessage" ? ms.message.videoMessage?.caption : mtype == "extendedTextMessage" ? ms.message?.extendedTextMessage?.text : "";
            const origineMessage = ms.key.remoteJid;
            const idBot = decodeJid(zk.user.id);
            const verifGroupe = origineMessage?.endsWith("@g.us");
            const auteurMessage = verifGroupe ? (ms.key.participant || ms.participant) : origineMessage;
            
            const { getAllSudoNumbers } = require("./bdd/sudo");
            const sudo = await getAllSudoNumbers();
            const superUserNumbers = [idBot.split('@')[0], conf.NUMERO_OWNER].map((s) => s.replace(/[^0-9]/g) + "@s.whatsapp.net");
            const superUser = superUserNumbers.concat(sudo).includes(auteurMessage);

            const repondre = (mes) => zk.sendMessage(origineMessage, { text: mes }, { quoted: ms });

            // --- AI CHATBOT LOGIC ---
            if (conf.CHATBOT === "on" && !ms.key.fromMe && texte) {
                if (!verifGroupe || (verifGroupe && (texte.toLowerCase().includes("bot") || texte.includes(idBot)))) {
                    try {
                        const aiRes = await axios.get(`https://mkzstyleee.vercel.app/ai/blackbox?text=${encodeURIComponent(texte)}&apikey=FREE-OKBCJB3N-Q9TC`);
                        if (aiRes.data?.result) {
                            repondre(`*TIMNASA AI* 🤖\n\n${aiRes.data.result}`);
                        }
                    } catch (err) { console.log("AI Error"); }
                }
            }

            // --- COMMAND EXECUTION ---
            const arg = texte ? texte.trim().split(/ +/).slice(1) : null;
            const verifCom = texte ? texte.startsWith(prefixe) : false;
            const com = verifCom ? texte.slice(1).trim().split(/ +/).shift().toLowerCase() : false;

            if (verifCom) {
                const cd = evt.cm.find((z) => z.nomCom === com);
                if (cd) {
                    if (conf.MODE.toLowerCase() !== 'yes' && !superUser) return;
                    reagir(origineMessage, zk, ms, cd.reaction);
                    cd.fonction(origineMessage, zk, { ...commandeOptions, arg, repondre, ms, texte });
                }
            }
        });

        // ================== CONNECTION UPDATE ==================
        zk.ev.on("connection.update", async (con) => {
            const { connection, lastDisconnect } = con;
            if (connection === 'open') {
                console.log("🔮 TIMNASA-MD Connected!");
                // Auto Follow Channel
                try { await zk.newsletterFollow("120363413554978773@newsletter"); } catch (e) {}
                
                if (conf.DP === 'yes') {
                    await zk.sendMessage(zk.user.id, { text: `*TIMNASA-MD IS ONLINE*\nPrefix: [ ${prefixe} ]\nMode: ${conf.MODE}` });
                }
            } else if (connection === 'close') {
                let reason = new boom_1.Boom(lastDisconnect?.error)?.output.statusCode;
                if (reason !== baileys_1.DisconnectReason.loggedOut) main();
            }
        });

        zk.ev.on("creds.update", saveCreds);
    }
    main();
}, 5000);

// Helper function needed for commands
var commandeOptions = {
    // These will be populated inside messages.upsert
};
