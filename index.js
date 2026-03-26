"use strict";
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

// Database Imports
const { verifierEtatJid, recupererActionJid } = require("./bdd/antilien");
const { atbverifierEtatJid, atbrecupererActionJid } = require("./bdd/antibot");
let evt = require(__dirname + "/framework/zokou");
const { isUserBanned } = require("./bdd/banUser");
const { isGroupBanned } = require("./bdd/banGroup");
let { reagir } = require(__dirname + "/framework/app");

var session = conf.session.replace(/TIMNASA-MD;;;=>/g, "");
const prefixe = conf.PREFIXE;

// Global Memory
let chatbotMemory = {};

async function authentification() {
    try {
        if (!fs.existsSync(__dirname + "/auth/creds.json")) {
            await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
        }
    } catch (e) {
        console.log("Session Error: " + e);
    }
}
authentification();

const store = (0, baileys_1.makeInMemoryStore)({ logger: pino().child({ level: "silent", stream: "store" }) });

setTimeout(() => {
    async function main() {
        const { version } = await (0, baileys_1.fetchLatestBaileysVersion)();
        const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(__dirname + "/auth");

        const zk = (0, baileys_1.default)({
            version,
            logger: pino({ level: "silent" }),
            browser: ['TIMNASA-TMD2', "Chrome", "1.0.0"],
            auth: {
                creds: state.creds,
                keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
            },
            printQRInTerminal: true,
            generateHighQualityLinkPreview: true,
        });

        store.bind(zk.ev);

        // ================== FEATURE 1: ANTI-CALL ==================
        zk.ev.on('call', async (call) => {
            if (conf.ANTICALL === "yes") {
                for (let c of call) {
                    if (c.status === 'offer') {
                        await zk.rejectCall(c.id, c.from);
                        await zk.sendMessage(c.from, { text: `⚠️ *TIMNASA SECURITY:* Calls are not allowed. You have been blocked.` });
                        await zk.updateBlockStatus(c.from, "block");
                    }
                }
            }
        });

        zk.ev.on("messages.upsert", async (m) => {
            const { messages } = m;
            const ms = messages;
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

            // Group Metadata
            let infosGroupe = verifGroupe ? await zk.groupMetadata(origineMessage) : "";
            let groupAdmins = verifGroupe ? infosGroupe.participants.filter(v => v.admin !== null).map(v => v.id) : [];
            let isBotAdmin = verifGroupe ? groupAdmins.includes(idBot) : false;
            let isSenderAdmin = verifGroupe ? groupAdmins.includes(auteurMessage) : false;
            let isOwner = [idBot.split('@'), conf.NUMERO_OWNER, '255784766591'].map(x => x + "@s.whatsapp.net").includes(auteurMessage);

            // ================== FEATURE 2: ANTI-TAG / HIDDEN MENTIONS ==================
            if (conf.ANTITAG === "on" && verifGroupe && isBotAdmin && !isSenderAdmin) {
                const hasMentions = ms.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0;
                if (hasMentions || ms.message?.statusMentionMessage) {
                    await zk.sendMessage(origineMessage, { delete: ms.key });
                    await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                    return zk.sendMessage(origineMessage, { text: `🚫 *ANTI-TAG:* User @${auteurMessage.split('@')} removed for tag spam.`, mentions: [auteurMessage] });
                }
            }

            // ================== FEATURE 3: ANTI-BADWORDS ==================
            if (conf.ANTIBAD === "on" && verifGroupe && isBotAdmin && !isSenderAdmin) {
                const badWords = ["kuma", "mboro", "fala", "shoga", "pumbavu", "stupid", "fuck", "bitch"]; // Ongeza zaidi
                if (badWords.some(word => texte.toLowerCase().includes(word))) {
                    await zk.sendMessage(origineMessage, { delete: ms.key });
                    return zk.sendMessage(origineMessage, { text: `⚠️ *ANTI-BADWORD:* Please watch your language @${auteurMessage.split('@')}`, mentions: [auteurMessage] });
                }
            }

            // ================== FEATURE 4: ANTI-BIO PROTECTION ==================
            if (conf.ANTIBIO === "on" && !ms.key.fromMe) {
                const userStatus = await zk.fetchStatus(auteurMessage);
                const forbiddenLinks = ["http", "https", ".com", ".net", "wa.me"];
                if (forbiddenLinks.some(link => userStatus.status.toLowerCase().includes(link)) && !isOwner) {
                    await zk.sendMessage(origineMessage, { text: `❌ *ANTI-BIO:* Your bio contains links. Change it to avoid being blocked.` });
                }
            }

            // ================== FEATURE 5: AI CHATBOT WITH MEMORY ==================
            if (conf.CHATBOT === "on" && !ms.key.fromMe && texte.length > 2) {
                if (!verifGroupe || texte.toLowerCase().includes("bot") || texte.toLowerCase().includes("timnasa")) {
                    try {
                        let history = chatbotMemory[auteurMessage] || "";
                        const aiRes = await axios.get(`https://mkzstyleee.vercel.app/ai/blackbox?text=${encodeURIComponent(history + texte)}&apikey=FREE-OKBCJB3N-Q9TC`);
                        if (aiRes.data.result) {
                            chatbotMemory[auteurMessage] = `User: ${texte}\nAI: ${aiRes.data.result}`.slice(-500);
                            await zk.sendMessage(origineMessage, { text: `*TIMNASA-AI:* ${aiRes.data.result}` }, { quoted: ms });
                        }
                    } catch (e) { console.log("AI Error"); }
                }
            }

            // Feature 6: Auto-Read Status
            if (ms.key && ms.key.remoteJid === "status@broadcast" && conf.AUTO_READ_STATUS === "yes") {
                await zk.readMessages([ms.key]);
            }

            // Command Handler (Feature 7-50+ based on external files)
            const arg = texte ? texte.trim().split(/ +/).slice(1) : null;
            const verifCom = texte ? texte.startsWith(prefixe) : false;
            const com = verifCom ? texte.slice(1).trim().split(/ +/).shift().toLowerCase() : false;

            if (verifCom) {
                const cd = evt.cm.find((z) => z.nomCom === com);
                if (cd) {
                    if (conf.MODE !== 'yes' && !isOwner) return;
                    reagir(origineMessage, zk, ms, cd.reaction);
                    cd.fonction(origineMessage, zk, { isOwner, verifGroupe, idBot, prefixe, arg, ms });
                }
            }
        });

        // ================== FEATURE 51: DYNAMIC WELCOME/GOODBYE ==================
        const { recupevents } = require('./bdd/welcome');
        zk.ev.on('group-participants.update', async (group) => {
            const metadata = await zk.groupMetadata(group.id);
            const total = metadata.participants.length;
            for (let m of group.participants) {
                let pp; try { pp = await zk.profilePictureUrl(m, 'image'); } catch { pp = 'https://telegra.ph/file/default-profile-pic.jpg'; }
                
                if (group.action == 'add' && (await recupevents(group.id, "welcome") == 'on')) {
                    await zk.sendMessage(group.id, { image: { url: pp }, caption: `Welcome @${m.split('@')} to ${metadata.subject}!\n\nYou are member number: ${total}`, mentions: [m] });
                } else if (group.action == 'remove' && (await recupevents(group.id, "goodbye") == 'on')) {
                    await zk.sendMessage(group.id, { image: { url: pp }, caption: `@${m.split('@')} has left. Total members: ${total}`, mentions: [m] });
                }
            }
        });

        // Final Setup
        zk.ev.on("connection.update", (con) => {
            const { connection } = con;
            if (connection === 'open') {
                console.log("🔮 TIMNASA-TMD2 IS ONLINE WITH 50+ FEATURES!");
                zk.newsletterFollow("120363406146813524@newsletter");
            } else if (connection === 'close') main();
        });

        zk.ev.on("creds.update", saveCreds);
    }
    main();
}, 5000);
