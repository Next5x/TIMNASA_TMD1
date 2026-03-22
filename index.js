"use strict";

const {
    default: makeWASocket,
    makeInMemoryStore,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    jidDecode,
    getContentType,
    delay,
    downloadContentFromMessage
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const conf = require("./set");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const FileType = require('file-type');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { verifierEtatJid, recupererActionJid } = require("./bdd/antilien");
const { atbverifierEtatJid, atbrecupererActionJid } = require("./bdd/antibot");
let evt = require(__dirname + "/framework/zokou");
const { isUserBanned } = require("./bdd/banUser");
const { isGroupBanned } = require("./bdd/banGroup");
const { isGroupOnlyAdmin } = require("./bdd/onlyAdmin");
let { reagir } = require(__dirname + "/framework/app");

const logger = pino({ level: 'silent' });
var session = conf.session.replace(/TIMNASA-MD;;;=>/g, "");
const prefixe = conf.PREFIXE;

// Memory ya Chatbot
let chatbotMemory = {};
// Hifadhi ya namba zilizopigwa ban kuchat (Global ili isifutike haraka)
global.mutedUsers = global.mutedUsers || [];

async function authentification() {
    try {
        if (!fs.existsSync(__dirname + "/auth/creds.json") || session !== "zokk") {
            await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
        }
    } catch (e) {
        console.log("Session Invalid " + e);
    }
}
authentification();

const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });

async function main() {
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + "/auth");

    const zk = makeWASocket({
        version,
        logger: pino({ level: "silent" }),
        browser: ['Timnasa md', "safari", "1.0.0"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        getMessage: async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id);
                return msg?.message || undefined;
            }
        }
    });

    store.bind(zk.ev);

    // ==========================================
    // MAIN MESSAGE HANDLER (UPSERT)
    // ==========================================
    zk.ev.on("messages.upsert", async (m) => {
        const { messages } = m;
        const ms = messages;
        if (!ms.message) return;

        const decodeJid = (jid) => {
            if (!jid) return jid;
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server ? decode.user + '@' + decode.server : jid;
        };

        const origineMessage = ms.key.remoteJid;
        const idBot = decodeJid(zk.user.id);
        const sender = ms.key.participant || ms.key.remoteJid;
        const mtype = getContentType(ms.message);
        const texte = mtype === "conversation" ? ms.message.conversation : mtype === "imageMessage" ? ms.message.imageMessage?.caption : mtype === "videoMessage" ? ms.message.videoMessage?.caption : mtype === "extendedTextMessage" ? ms.message?.extendedTextMessage?.text : "";
        
        const verifGroupe = origineMessage?.endsWith("@g.us");
        const infosGroupe = verifGroupe ? await zk.groupMetadata(origineMessage) : "";
        const groupAdmins = verifGroupe ? infosGroupe.participants.filter(v => v.admin !== null).map(v => v.id) : [];
        const isBotAdmin = verifGroupe ? groupAdmins.includes(idBot) : false;
        const isSenderAdmin = verifGroupe ? groupAdmins.includes(sender) : false;
        const superUser = [conf.NUMERO_OWNER + "@s.whatsapp.net", idBot].includes(sender);

        // --- 1. AUTO BAN CHAT LOGIC ---
        if (global.mutedUsers.includes(sender) && verifGroupe && isBotAdmin && !isSenderAdmin) {
            await zk.sendMessage(origineMessage, { delete: ms.key });
            return; // Usiendelee na kodi nyingine kama mtu kapigwa ban
        }

        // --- 2. CHATBOT LOGIC ---
        if (conf.CHATBOT === "on" && !ms.key.fromMe && texte) {
            const shouldReply = !verifGroupe || (verifGroupe && (texte.toLowerCase().includes("timnasa") || texte.toLowerCase().includes("bot")));
            if (shouldReply) {
                try {
                    let history = chatbotMemory[sender] || "";
                    const aiRes = await axios.get(`https://mkzstyleee.vercel.app/ai/blackbox?text=${encodeURIComponent(history + texte)}&apikey=FREE-OKBCJB3N-Q9TC`);
                    if (aiRes.data?.result) {
                        chatbotMemory[sender] = `User: ${texte}\nAI: ${aiRes.data.result}`.slice(-500);
                        await zk.sendMessage(origineMessage, { text: `*TIMNASA AI* 🤖\n\n${aiRes.data.result}` }, { quoted: ms });
                    }
                } catch (e) { console.log("AI Error"); }
            }
        }

        // --- 3. ANTI-STICKER LOGIC ---
        if (conf.ANTISTICKER === "on" && ms.message?.stickerMessage && verifGroupe && isBotAdmin && !isSenderAdmin) {
            await zk.sendMessage(origineMessage, { delete: ms.key });
            await zk.sendMessage(origineMessage, { text: `⚠️ *ANTI-STICKER:* @${sender.split('@')} Stickers haziruhusiwi!`, mentions: [sender] });
        }

        // --- 4. COMMAND ENGINE ---
        const prefixe = conf.PREFIXE;
        const verifCom = texte ? texte.startsWith(prefixe) : false;
        const com = verifCom ? texte.slice(1).trim().split(/ +/).shift().toLowerCase() : false;
        const arg = texte ? texte.trim().split(/ +/).slice(1) : [];

        if (verifCom) {
            const cd = evt.cm.find((z) => z.nomCom === com);
            if (cd) {
                if (conf.MODE.toLowerCase() !== 'yes' && !superUser) return;
                reagir(origineMessage, zk, ms, cd.reaction);
                const repondre = (txt) => zk.sendMessage(origineMessage, { text: txt }, { quoted: ms });
                cd.fonction(origineMessage, zk, { ...m, arg, repondre, superUser, isBotAdmin, isSenderAdmin, verifGroupe });
            }
        }
    });

    // --- CONNECTION UPDATES ---
    zk.ev.on("connection.update", async (con) => {
        const { connection, lastDisconnect } = con;
        if (connection === "open") {
            console.log("🔮 Timnasa Connected Successfully!");
            // Load Commands
            fs.readdirSync(__dirname + "/commandes").forEach((file) => {
                if (path.extname(file).toLowerCase() === ".js") {
                    require(__dirname + "/commandes/" + file);
                }
            });
        }
        if (connection === "close") {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            if (reason !== 401) main();
        }
    });

    zk.ev.on("creds.update", saveCreds);
}

main();
