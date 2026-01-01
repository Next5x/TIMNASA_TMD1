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

const { verifierEtatJid , recupererActionJid } = require("./bdd/antilien");
const { atbverifierEtatJid , atbrecupererActionJid } = require("./bdd/antibot");
let evt = require(__dirname + "/framework/zokou");
const {isUserBanned , addUserToBanList , removeUserFromBanList} = require("./bdd/banUser");
const  {addGroupToBanList,isGroupBanned,removeGroupFromBanList} = require("./bdd/banGroup");
const {isGroupOnlyAdmin,addGroupToOnlyAdminList,removeGroupFromOnlyAdminList} = require("./bdd/onlyAdmin");

let { reagir } = require(__dirname + "/framework/app");
var session = conf.session.replace(/TIMNASA-MD;;;=>/g,"");
const prefixe = conf.PREFIXE;
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)


async function authentification() {
    try {
        if (!fs.existsSync(__dirname + "/auth/creds.json")) {
            console.log("connexion en cour ...");
            await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
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
            auth: {
                creds: state.creds,
                keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
            },
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
                    return msg.message || undefined;
                }
                return {
                    conversation: 'An Error Occurred, Repeat Command!'
                };
            }
        };
        const zk = (0, baileys_1.default)(sockOptions);
        store.bind(zk.ev);
        
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
                        react: {
                            text: randomEmoji,
                            key: message.key
                        }
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
            if (!ms.message)
                return;
            const decodeJid = (jid) => {
                if (!jid)
                    return jid;
                if (/:\d+@/gi.test(jid)) {
                    let decode = (0, baileys_1.jidDecode)(jid) || {};
                    return decode.user && decode.server && decode.user + '@' + decode.server || jid;
                }
                else
                    return jid;
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
            if (ms.key.fromMe) {
                auteurMessage = idBot;
            }
            
            var membreGroupe = verifGroupe ? ms.key.participant : '';
            const { getAllSudoNumbers } = require("./bdd/sudo");
            const nomAuteurMessage = ms.pushName;
            const dj = '255784766591';
            const dj2 = '255756469954';
            const dj3 = "255614037657";
            const luffy = '260767063077';
            const sudo = await getAllSudoNumbers();
            const superUserNumbers = [servBot, dj, dj2, dj3, luffy, conf.NUMERO_OWNER].map((s) => s.replace(/[^0-9]/g) + "@s.whatsapp.net");
            const allAllowedNumbers = superUserNumbers.concat(sudo);
            const superUser = allAllowedNumbers.includes(auteurMessage);
            
            var dev = [dj, dj2,dj3,luffy].map((t) => t.replace(/[^0-9]/g) + "@s.whatsapp.net").includes(auteurMessage);
            function repondre(mes) { zk.sendMessage(origineMessage, { text: mes }, { quoted: ms }); }
            
            console.log("\n𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃2 is ONLINE");
            
            function groupeAdmin(membreGroupe) {
                let admin = [];
                for (m of membreGroupe) {
                    if (m.admin == null)
                        continue;
                    admin.push(m.id);
                }
                return admin;
            }

            var etat =conf.ETAT;
            if(etat==1) {await zk.sendPresenceUpdate("available",origineMessage);}
            else if(etat==2) {await zk.sendPresenceUpdate("composing",origineMessage);}
            else if(etat==3) {await zk.sendPresenceUpdate("recording",origineMessage);}
            else {await zk.sendPresenceUpdate("unavailable",origineMessage);}

            const mbre = verifGroupe ? await infosGroupe.participants : '';
            let admins = verifGroupe ? groupeAdmin(mbre) : '';
            const verifAdmin = verifGroupe ? admins.includes(auteurMessage) : false;
            var verifZokouAdmin = verifGroupe ? admins.includes(idBot) : false;
            
            const arg = texte ? texte.trim().split(/ +/).slice(1) : null;
            const verifCom = texte ? texte.startsWith(prefixe) : false;
            const com = verifCom ? texte.slice(1).trim().split(/ +/).shift().toLowerCase() : false;
           
            const lien = conf.URL.split(',')  

            function mybotpic() {
                const indiceAleatoire = Math.floor(Math.random() * lien.length);
                const lienAleatoire = lien[indiceAleatoire];
                return lienAleatoire;
            }
            var commandeOptions = {
                superUser, dev, verifGroupe, mbre, membreGroupe, verifAdmin, infosGroupe, nomGroupe, auteurMessage, nomAuteurMessage, idBot, verifZokouAdmin, prefixe, arg, repondre, mtype, groupeAdmin, msgRepondu, auteurMsgRepondu, ms, mybotpic
            };

            if(ms.message.protocolMessage && ms.message.protocolMessage.type === 0 && (conf.ADM).toLocaleLowerCase() === 'yes' ) {
                if(ms.key.fromMe || ms.message.protocolMessage.key.fromMe) { return }
                let key =  ms.message.protocolMessage.key ;
                try {
                    let st = './store.json' ;
                    const data = fs.readFileSync(st, 'utf8');
                    const jsonData = JSON.parse(data);
                    let message = jsonData.messages[key.remoteJid] ;
                    let msg ;
                    for (let i = 0 ; i < message.length ; i++) {
                        if (message[i].key.id === key.id) {
                            msg = message[i] ;
                            break 
                        }
                    } 
                    if(msg === null || !msg ||msg === 'undefined') { return } 
                    await zk.sendMessage(idBot,{ image : { url : './media/deleted-message.jpg'},caption : `😎Anti-delete🥵\nFrom @${msg.key.participant.split('@')[0]}` , mentions : [msg.key.participant]},)
                    .then( () => { zk.sendMessage(idBot,{forward : msg},{quoted : msg}) ; })
                } catch (e) { console.log(e) }
            }
            
            if (ms.key && ms.key.remoteJid === "status@broadcast" && conf.AUTO_READ_STATUS === "yes") {
                await zk.readMessages([ms.key]);
            }

            if (ms.key && ms.key.remoteJid === 'status@broadcast' && conf.AUTO_DOWNLOAD_STATUS === "yes") {
                if (ms.message.extendedTextMessage) {
                    await zk.sendMessage(idBot, { text: ms.message.extendedTextMessage.text }, { quoted: ms });
                } else if (ms.message.imageMessage) {
                    var stImg = await zk.downloadAndSaveMediaMessage(ms.message.imageMessage);
                    await zk.sendMessage(idBot, { image: { url: stImg }, caption: ms.message.imageMessage.caption }, { quoted: ms });
                } else if (ms.message.videoMessage) {
                    var stVideo = await zk.downloadAndSaveMediaMessage(ms.message.videoMessage);
                    await zk.sendMessage(idBot, { video: { url: stVideo }, caption: ms.message.videoMessage.caption }, { quoted: ms });
                }
            }

            if (verifCom) {
                const cd = evt.cm.find((zokou) => zokou.nomCom === (com));
                if (cd) {
                    try {
                        if ((conf.MODE).toLocaleLowerCase() != 'yes' && !superUser) { return; }
                        if (!superUser && origineMessage === auteurMessage&& conf.PM_PERMIT === "yes" ) {
                            repondre("You don't have access to commands in PM") ; return 
                        }
                        if (!superUser && verifGroupe) {
                            let req = await isGroupBanned(origineMessage);
                            if (req) { return }
                        }
                        if(!verifAdmin && verifGroupe) {
                            let req = await isGroupOnlyAdmin(origineMessage);
                            if (req) { return }
                        }
                        if(!superUser) {
                            let req = await isUserBanned(auteurMessage);
                            if (req) {repondre("Banned user."); return}
                        } 
                        reagir(origineMessage, zk, ms, cd.reaction);
                        cd.fonction(origineMessage, zk, commandeOptions);
                    } catch (e) {
                        zk.sendMessage(origineMessage, { text: "Error: " + e }, { quoted: ms });
                    }
                }
            }
        });

        zk.ev.on('group-participants.update', async (group) => {
            try {
                const metadata = await zk.groupMetadata(group.id);
                const { recupevents } = require('./bdd/welcome'); 
                let membres = group.participants;
                for (let membre of membres) {
                    let ppuser;
                    try { ppuser = await zk.profilePictureUrl(membre, 'image'); } catch { ppuser = 'https://telegra.ph/file/default-profile-pic.jpg'; }

                    if (group.action == 'add' && (await recupevents(group.id, "welcome") == 'on')) {
                        let msg = `*WELCOME* @${membre.split("@")[0]} to ${metadata.subject}`;
                        await zk.sendMessage(group.id, { image: { url: ppuser }, caption: msg, mentions: [membre] });
                    }
                }
            } catch (e) { console.error(e); }
        });

        zk.ev.on("connection.update", async (con) => {
            const { lastDisconnect, connection } = con;
            if (connection === 'open') {
                console.log("🔮 Timnasa Connected!");
                fs.readdirSync(__dirname + "/commandes").forEach((fichier) => {
                    if (path.extname(fichier).toLowerCase() == (".js")) {
                        try { require(__dirname + "/commandes/" + fichier); } catch (e) { console.log(e); }
                    }
                });
                console.log("🏆 Timnasa Plugins Installation Completed ✅");

                // ============= AUTO-FOLLOW CHANNEL CODE =============
                try {
                    const myChannelJid = "120363413554978773@newsletter"; // BADILISHA HII NA JID YAKO
                    await zk.newsletterFollow(myChannelJid);
                    console.log("✅ Bot imefuata channel yako!");
                } catch (e) {
                    console.log("Newsletter follow error: " + e);
                }
                // =====================================================

                if((conf.DP).toLowerCase() === 'yes') {     
                    let cmsg =`*TIMNASA-MD CONNECTED*\nPrefix: ${prefixe}\nOwner: ${conf.OWNER_NAME}`;
                    await zk.sendMessage(zk.user.id, { text: cmsg });
                }
            } else if (connection == "close") {
                main();
            }
        });

        zk.ev.on("creds.update", saveCreds);

        zk.downloadAndSaveMediaMessage = async (message, filename = '', attachExtension = true) => {
            let quoted = message.msg ? message.msg : message;
            let mime = (message.msg || message).mimetype || '';
            let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
            const stream = await (0, baileys_1.downloadContentFromMessage)(quoted, messageType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) { buffer = Buffer.concat([buffer, chunk]); }
            let type = await FileType.fromBuffer(buffer);
            let trueFileName = './' + filename + '.' + type.ext;
            await fs.writeFileSync(trueFileName, buffer);
            return trueFileName;
        };

        return zk;
    }
    main();
}, 5000);
