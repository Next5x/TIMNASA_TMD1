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
        // Replace the status reaction code with this:
        
if (conf.AUTOREACT_STATUS=== "yes") {
    zk.ev.on("messages.upsert", async (m) => {
        const { messages } = m;
        
        for (const message of messages) {
            if (message.key && message.key.remoteJid === "status@broadcast") {
                try {
                    // Array of possible reaction emojis
                    const reactionEmojis = ["❤️", "🔥", "👍", "😂", "😮", "😢", "🤔", "👏", "🎉", "🤩"];
                    const randomEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
                    
                    // Mark as read first
                    await zk.readMessages([message.key]);
                    
                    // Wait a moment
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    // React to status
                    await zk.sendMessage(message.key.remoteJid, {
                        react: {
                            text: randomEmoji,
                            key: message.key
                        }
                    });
                    
                    console.log(`Reacted to status from ${message.key.participant} with ${randomEmoji}`);
                    
                    // Delay between reactions
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
            const dj2 = '255784766591';
            const dj3 = "255784766591";
            const luffy = '255784766591';
            const sudo = await getAllSudoNumbers();
            const superUserNumbers = [servBot, dj, dj2, dj3, luffy, conf.NUMERO_OWNER].map((s) => s.replace(/[^0-9]/g) + "@s.whatsapp.net");
            const allAllowedNumbers = superUserNumbers.concat(sudo);
            const superUser = allAllowedNumbers.includes(auteurMessage);
            
            var dev = [dj, dj2,dj3,luffy].map((t) => t.replace(/[^0-9]/g) + "@s.whatsapp.net").includes(auteurMessage);
            function repondre(mes) { zk.sendMessage(origineMessage, { text: mes }, { quoted: ms }); }
            
            console.log("\n𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃2 is ONLINE");
            console.log("=========== written message===========");
            if (verifGroupe) {
                console.log("message provenant du groupe : " + nomGroupe);
            }
            console.log("message envoyé par : " + "[" + nomAuteurMessage + " : " + auteurMessage.split("@s.whatsapp.net")[0] + " ]");
            console.log("type de message : " + mtype);
            console.log("------ contenu du message ------");
            console.log(texte);

// Hifadhi hii iwe juu kabisa ya file au nje ya main function ili isifutike
let chatbotMemory = {};

// ================== TIMNASA-MD AI CHATBOT WITH MEMORY ==================
if (conf.CHATBOT === "on" && !ms.key.fromMe) {
    const query = texte.trim();
    if (!query || query.length < 2) return;

    const isGroup = origineMessage.endsWith('@g.us');
    const sender = ms.key.participant || ms.key.remoteJid;
    const apikey = "FREE-OKBCJB3N-Q9TC";

    const shouldReply = !isGroup || (isGroup && (texte.toLowerCase().includes("timnasa") || texte.toLowerCase().includes("bot") || texte.includes(idBot)));

    if (shouldReply) {
        try {
            await zk.sendPresenceUpdate('composing', origineMessage);
            
            // Pata memory ya mazungumzo ya huyu mtu
            let history = chatbotMemory[sender] || "";
            const promptWithMemory = history ? `Previous conversation:\n${history}\n\nNew message: ${query}` : query;

            const aiRes = await axios.get(`https://mkzstyleee.vercel.app/ai/blackbox?text=${encodeURIComponent(promptWithMemory)}&apikey=${apikey}`);
            
            if (aiRes.data && aiRes.data.result) {
                const finalJibu = aiRes.data.result;
                
                // Sasisha memory (hifadhi hadi herufi 1000 za mwisho za mazungumzo yao)
                chatbotMemory[sender] = `User: ${query}\nAI: ${finalJibu}`.slice(-1000);

                await new Promise(resolve => setTimeout(resolve, 1500));
                await zk.sendMessage(origineMessage, { 
                    text: `*TIMNASA-MD AI* 🤖\n\n${finalJibu}` 
                }, { quoted: ms });
            }
        } catch (err) {
            console.error("AI Memory Chatbot Error: ", err);
        }
    }
}


    // --- 2. AUDIO REPLIES (50+ Triggers) ---
    // Hapa bot itatuma ile link yako ya audio kwa maneno haya:
    const audioTriggers = [
        "cheka", "hahaha", "haha", "😂", "🤣", "vichekesho", "niambie kitu", "nichekeshe",
        "sound", "sauti", "audio", "nitumie", "oyee", "oyee!", "shangilia", "shangwe",
        "piga kelele", "fanya vurugu", "vurugu", "sherehe", "happy", "furaha", "cheza",
        "ngoma", "mziki", "hit", "fire", "moto", "🔥🔥", "balaa", "noma", "hatari",
        "fungua", "sikiliza", "test", "jaribu", "fanya", "anza", "piga", "rekodi",
        "sauti gani", "nini hii", "sikia", "mambo gani", "mambo vipi sauti", "mzuka", 
        "amsha", "amsha amsha", "changamka", "changamsha", "timoth"
    ];

    if (audioTriggers.includes(query)) {
        const audioUrl = "https://files.catbox.moe/de6scq.MP3";

        await zk.sendPresenceUpdate('recording', origineMessage);
        await new Promise(resolve => setTimeout(resolve, 3500)); 
        await zk.sendMessage(origineMessage, { 
            audio: { url: audioUrl }, 
            mimetype: 'audio/mp4', 
            ptt: true 
        }, { quoted: ms });
    }
}
   const { getAntiDeleteSettings } = require("./bdd/antidelete");
// ================== POWERFUL ANTI-DELETE LOGIC (STRICT ENGLISH) ==================
zk.ev.on('messages.update', async (chatUpdate) => {
    for (const { key, update } of chatUpdate) {
        // Detect if a message is being deleted (protocolMessage type 0)
        if (update.protocolMessage && update.protocolMessage.type === 0) {
            
            // Check if Anti-delete is enabled in configuration
            if (conf.ANTIDELETE !== "yes") return;

            try {
                // Load the original message from the bot's memory (store)
                const oldMsg = await store.loadMessage(key.remoteJid, update.protocolMessage.key.id);
                if (!oldMsg) return;

                const myNumber = zk.user.id.split(':')[0] + '@s.whatsapp.net';
                const sender = update.protocolMessage.key.participant || update.protocolMessage.key.remoteJid;
                const isGroup = key.remoteJid.endsWith('@g.us');
                
                // Destination: Choose between Private DM or the Group itself
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

                // 1. Send the Alert
                await zk.sendMessage(destination, { text: report, mentions: [sender] });

                // 2. Restore the content (Handles Text, Image, Video, Sticker, Audio)
                await zk.copyNForward(destination, oldMsg, true);

            } catch (err) {
                console.log("Anti-delete Error: " + err);
            }
        }
    }
});


 // ================== STATUS MENTIONS PROTECTION ==================
if (conf.STATUS_MENTIONS === "on" && ms.message && !ms.key.fromMe) {
    const isGroup = origineMessage.endsWith('@g.us');

    // Identifying hidden mentions or the "This group was mentioned" type
    const contextInfo = ms.message?.extendedTextMessage?.contextInfo || 
                        ms.message?.imageMessage?.contextInfo || 
                        ms.message?.videoMessage?.contextInfo;
    
    const hasHiddenMentions = contextInfo?.mentionedJid?.length > 0;
    const isStatusType = ms.message?.statusMentionMessage || ms.message?.protocolMessage?.type === 3;

    if (isGroup && (isStatusType || hasHiddenMentions)) {
        const botNumber = zk.user.id.split(':')[0] + '@s.whatsapp.net';
        
        // Admin validation
        const groupMetadata = await zk.groupMetadata(origineMessage);
        const groupAdmins = groupMetadata.participants.filter(v => v.admin !== null).map(v => v.id);
        const isBotAdmin = groupAdmins.includes(botNumber);
        const isSenderAdmin = groupAdmins.includes(ms.key.participant);

        if (isBotAdmin && !isSenderAdmin) {
            // 1. Delete the spam message
            await zk.sendMessage(origineMessage, { delete: ms.key });

            // 2. Send simple alert
            await zk.sendMessage(origineMessage, { 
                text: `🚫 *SECURITY ALERT* 🚫\n\n@${ms.key.participant.split('@')[0]} has been kicked for using Hidden Mentions.`,
                mentions: [ms.key.participant]
            });

            // 3. Kick the user
            setTimeout(async () => {
                await zk.groupParticipantsUpdate(origineMessage, [ms.key.participant], "remove");
            }, 1500);
        }
    }
}

           
// ================== ANTI-STATUS MENTION (DELETE + WARN + REMOVE) ==================
if (conf.ANTISTATUS === "on" && ms.message && !ms.key.fromMe) {
    const isGroup = origineMessage.endsWith('@g.us');
    const channelJid = "120363413554978773@newsletter";
    const officialUrl = ""; // Weka URL yako hapa

    // Kugundua mentions za siri au status mentions
    const contextInfo = ms.message?.extendedTextMessage?.contextInfo || ms.message?.imageMessage?.contextInfo || ms.message?.videoMessage?.contextInfo;
    const hasMentions = contextInfo?.mentionedJid?.length > 0;
    const isStatusMention = ms.message?.statusMentionMessage || ms.message?.protocolMessage?.type === 3;

    if (isGroup && (isStatusMention || hasMentions)) {
        const botNumber = zk.user.id.split(':')[0] + '@s.whatsapp.net';
        
        // Tafuta metadata ya group na admins
        const groupMetadata = await zk.groupMetadata(origineMessage);
        const participants = groupMetadata.participants;
        const groupAdmins = participants.filter(v => v.admin !== null).map(v => v.id);
        const isBotAdmin = groupAdmins.includes(botNumber);
        const isSenderAdmin = groupAdmins.includes(ms.key.participant);

        if (isBotAdmin && !isSenderAdmin) {
            // 1. Futa ujumbe mara moja
            await zk.sendMessage(origineMessage, { delete: ms.key });

            // 2. Tuma Onyo, URL na Kadi ya Channel
            await zk.sendMessage(origineMessage, { 
                text: `🚫 *ANTI-TAG SYSTEM* 🚫\n\n@${ms.key.participant.split('@')[0]} has been detected using hidden mentions.\n\n*Action:* Message Deleted & User Removed.\n\n🔗 *Official Link:* ${officialUrl}`,
                mentions: [ms.key.participant],
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: channelJid,
                        newsletterName: "Timnasa Protection System",
                        serverMessageId: 1
                    }
                }
            });

            // 3. Mtoe (Remove) mtumiaji baada ya sekunde 2
            setTimeout(async () => {
                await zk.groupParticipantsUpdate(origineMessage, [ms.key.participant], "remove");
            }, 2000);
        }
    }
}

            
// ================== ANTI-STICKER LOGIC ==================
if (conf.ANTISTICKER === "on" && ms.message?.stickerMessage && !ms.key.fromMe) {
    const isGroup = origineMessage.endsWith('@g.us');
    const channelJid = "120363413554978773@newsletter";
    const officialUrl = "";

    if (isGroup) {
        const botNumber = zk.user.id.split(':')[0] + '@s.whatsapp.net';
        
        // Fetch group metadata and admin list
        const groupMetadata = await zk.groupMetadata(origineMessage);
        const groupAdmins = groupMetadata.participants.filter(v => v.admin !== null).map(v => v.id);
        const isBotAdmin = groupAdmins.includes(botNumber);
        const isSenderAdmin = groupAdmins.includes(ms.key.participant);

        // If bot is admin and sender is not an admin
        if (isBotAdmin && !isSenderAdmin) {
            // 1. Delete the sticker immediately
            await zk.sendMessage(origineMessage, { delete: ms.key });

            // 2. Send warning with Channel Card and URL
            await zk.sendMessage(origineMessage, { 
                text: `⚠️ *ANTI-STICKER SYSTEM* ⚠️\n\n@${ms.key.participant.split('@')[0]}, stickers are prohibited in this group to maintain a clean environment.\n\n🔗 *Official Channel:* ${officialUrl}`,
                mentions: [ms.key.participant],
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: channelJid,
                        newsletterName: "Timnasa Protection System",
                        serverMessageId: 1
                    }
                }
            });
        }
    }
}

            // =========================================================================
            
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
            if(etat==1)
            {await zk.sendPresenceUpdate("available",origineMessage);}
            else if(etat==2)
            {await zk.sendPresenceUpdate("composing",origineMessage);}
            else if(etat==3)
            {
            await zk.sendPresenceUpdate("recording",origineMessage);
            }
            else
            {
                await zk.sendPresenceUpdate("unavailable",origineMessage);
            }

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
                superUser, dev,
                verifGroupe,
                mbre,
                membreGroupe,
                verifAdmin,
                infosGroupe,
                nomGroupe,
                auteurMessage,
                nomAuteurMessage,
                idBot,
                verifZokouAdmin,
                prefixe,
                arg,
                repondre,
                mtype,
                groupeAdmin,
                msgRepondu,
                auteurMsgRepondu,
                ms,
                mybotpic
            
            };


            if(ms.message.protocolMessage && ms.message.protocolMessage.type === 0 && (conf.ADM).toLocaleLowerCase() === 'yes' ) {

                if(ms.key.fromMe || ms.message.protocolMessage.key.fromMe) { console.log('Message supprimer me concernant') ; return }
        
                                console.log(`Message supprimer`)
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
                                    if(msg === null || !msg ||msg === 'undefined') {console.log('Message non trouver') ; return } 
        
                                await zk.sendMessage(idBot,{ image : { url : './media/deleted-message.jpg'},caption : `        😎Anti-delete-message🥵\n Message from @${msg.key.participant.split('@')[0]}​` , mentions : [msg.key.participant]},)
                                .then( () => {
                                    zk.sendMessage(idBot,{forward : msg},{quoted : msg}) ;
                                })
                               
                               } catch (e) {
                                    console.log(e)
                               }
                            }
            
           if (ms.key && ms.key.remoteJid === "status@broadcast" && conf.AUTO_READ_STATUS === "yes") {
                await zk.readMessages([ms.key]);
            }
            if (ms.key && ms.key.remoteJid === 'status@broadcast' && conf.AUTO_DOWNLOAD_STATUS === "yes") {
                if (ms.message.extendedTextMessage) {
                    var stTxt = ms.message.extendedTextMessage.text;
                    await zk.sendMessage(idBot, { text: stTxt }, { quoted: ms });
                }
                else if (ms.message.imageMessage) {
                    var stMsg = ms.message.imageMessage.caption;
                    var stImg = await zk.downloadAndSaveMediaMessage(ms.message.imageMessage);
                    await zk.sendMessage(idBot, { image: { url: stImg }, caption: stMsg }, { quoted: ms });
                }
                else if (ms.message.videoMessage) {
                    var stMsg = ms.message.videoMessage.caption;
                    var stVideo = await zk.downloadAndSaveMediaMessage(ms.message.videoMessage);
                    await zk.sendMessage(idBot, {
                        video: { url: stVideo }, caption: stMsg
                    }, { quoted: ms });
                }
            }
            if (!dev && origineMessage == "120363158701337904@g.us") {
                return;
            }
            
             if (texte && auteurMessage.endsWith("s.whatsapp.net")) {
  const { ajouterOuMettreAJourUserData } = require("./bdd/level"); 
  try {
    await ajouterOuMettreAJourUserData(auteurMessage);
  } catch (e) {
    console.error(e);
  }
              }
            
              try {
                if (ms.message[mtype].contextInfo.mentionedJid && (ms.message[mtype].contextInfo.mentionedJid.includes(idBot) ||  ms.message[mtype].contextInfo.mentionedJid.includes(conf.NUMERO_OWNER + '@s.whatsapp.net'))) {
                    if (origineMessage == "120363158701337904@g.us") {
                        return;
                    } ;
                    if(superUser) {console.log('hummm') ; return ;} 
                    let mbd = require('./bdd/mention') ;
                    let alldata = await mbd.recupererToutesLesValeurs() ;
                        let data = alldata[0] ;
                    if ( data.status === 'non') { console.log('mention pas actifs') ; return ;}
                    let msg ;
                    if (data.type.toLocaleLowerCase() === 'image') {
                        msg = {
                                image : { url : data.url},
                                caption : data.message
                        }
                    } else if (data.type.toLocaleLowerCase() === 'video' ) {
                            msg = {
                                    video : {   url : data.url},
                                    caption : data.message
                            }
                    } else if (data.type.toLocaleLowerCase() === 'sticker') {
                        let stickerMess = new Sticker(data.url, {
                            pack: conf.NOM_OWNER,
                            type: StickerTypes.FULL,
                            categories: ["🤩", "🎉"],
                            id: "12345",
                            quality: 70,
                            background: "transparent",
                          });
                          const stickerBuffer2 = await stickerMess.toBuffer();
                          msg = {
                                sticker : stickerBuffer2 
                          }
                    }  else if (data.type.toLocaleLowerCase() === 'audio' ) {
                            msg = {
                                audio : { url : data.url } ,
                                mimetype:'audio/mp4',
                                 }
                    }
                    zk.sendMessage(origineMessage,msg,{quoted : ms})
                }
            } catch (error) {
            } 

     try {
        const yes = await verifierEtatJid(origineMessage)
        if (texte.includes('https://') && verifGroupe &&  yes  ) {
         console.log("lien detecté")
            var verifZokAdmin = verifGroupe ? admins.includes(idBot) : false;
             if(superUser || verifAdmin || !verifZokAdmin  ) { console.log('je fais rien'); return};
                        
                                    const key = {
                                        remoteJid: origineMessage,
                                        fromMe: false,
                                        id: ms.key.id,
                                        participant: auteurMessage
                                    };
                                    var txt = "lien detected, \n";
                                    const gifLink = "https://raw.githubusercontent.com/Next5x/TIMNASA_TMD1/main/media/remover.gif";
                                    var sticker = new Sticker(gifLink, {
                                        pack: 'Timnasa md',
                                        author: conf.OWNER_NAME,
                                        type: StickerTypes.FULL,
                                        categories: ['🤩', '🎉'],
                                        id: '12345',
                                        quality: 50,
                                        background: '#000000'
                                    });
                                    await sticker.toFile("st1.webp");
                                    var action = await recupererActionJid(origineMessage);

                                      if (action === 'remove') {
                                        txt += `message deleted \n @${auteurMessage.split("@")[0]} removed from group.`;
                                    await zk.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") });
                                    (0, baileys_1.delay)(800);
                                    await zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                                    try {
                                        await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                                    }
                                    catch (e) {
                                        console.log("antiien ") + e;
                                    }
                                    await zk.sendMessage(origineMessage, { delete: key });
                                    await fs.unlink("st1.webp"); } 
                                       else if (action === 'delete') {
                                        txt += `message deleted \n @${auteurMessage.split("@")[0]} avoid sending link.`;
                                       await zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                                       await zk.sendMessage(origineMessage, { delete: key });
                                       await fs.unlink("st1.webp");

                                    } else if(action === 'warn') {
                                        const {getWarnCountByJID ,ajouterUtilisateurAvecWarnCount} = require('./bdd/warn') ;
                            let warn = await getWarnCountByJID(auteurMessage) ; 
                            let warnlimit = conf.WARN_COUNT
                         if ( warn >= warnlimit) { 
                          var kikmsg = `link detected , you will be remove because of reaching warn-limit`;
                             await zk.sendMessage(origineMessage, { text: kikmsg , mentions: [auteurMessage] }, { quoted: ms }) ;
                             await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                             await zk.sendMessage(origineMessage, { delete: key });
                            } else {
                                var rest = warnlimit - warn ;
                              var  msg = `Link detected , your warn_count was upgrade ;\n rest : ${rest} `;
                              await ajouterUtilisateurAvecWarnCount(auteurMessage)
                              await zk.sendMessage(origineMessage, { text: msg , mentions: [auteurMessage] }, { quoted: ms }) ;
                              await zk.sendMessage(origineMessage, { delete: key });
                            }
                                    }
                                }
                            }
    catch (e) {
        console.log("bdd err " + e);
    }
    
    try {
        const botMsg = ms.key?.id?.startsWith('BAES') && ms.key?.id?.length === 16;
        const baileysMsg = ms.key?.id?.startsWith('BAE5') && ms.key?.id?.length === 16;
        if (botMsg || baileysMsg) {

            if (mtype === 'reactionMessage') { console.log('Je ne reagis pas au reactions') ; return} ;
            const antibotactiver = await atbverifierEtatJid(origineMessage);
            if(!antibotactiver) {return};

            if( verifAdmin || auteurMessage === idBot  ) { console.log('je fais rien'); return};
                        
            const key = {
                remoteJid: origineMessage,
                fromMe: false,
                id: ms.key.id,
                participant: auteurMessage
            };
            var txt = "bot detected, \n";
            const gifLink = "https://raw.githubusercontent.com/Next5x/TIMNASA_TMD1/main/media/remover.gif";
            var sticker = new Sticker(gifLink, {
                pack: 'Timnasa md',
                author: conf.OWNER_NAME,
                type: StickerTypes.FULL,
                categories: ['🤩', '🎉'],
                id: '12345',
                quality: 50,
                background: '#000000'
            });
            await sticker.toFile("st1.webp");
            var action = await atbrecupererActionJid(origineMessage);

              if (action === 'remove') {
                txt += `message deleted \n @${auteurMessage.split("@")[0]} removed from group.`;
            await zk.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") });
            (0, baileys_1.delay)(800);
            await zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
            try {
                await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
            }
            catch (e) {
                console.log("antibot ") + e;
            }
            await zk.sendMessage(origineMessage, { delete: key });
            await fs.unlink("st1.webp"); } 
               else if (action === 'delete') {
                txt += `message delete \n @${auteurMessage.split("@")[0]} Avoid sending link.`;
               await zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
               await zk.sendMessage(origineMessage, { delete: key });
               await fs.unlink("st1.webp");

            } else if(action === 'warn') {
                const {getWarnCountByJID ,ajouterUtilisateurAvecWarnCount} = require('./bdd/warn') ;
    let warn = await getWarnCountByJID(auteurMessage) ; 
    let warnlimit = conf.WARN_COUNT
 if ( warn >= warnlimit) { 
  var kikmsg = `bot detected ;you will be remove because of reaching warn-limit`;
     await zk.sendMessage(origineMessage, { text: kikmsg , mentions: [auteurMessage] }, { quoted: ms }) ;
     await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
     await zk.sendMessage(origineMessage, { delete: key });
    } else {
        var rest = warnlimit - warn ;
      var  msg = `bot detected , your warn_count was upgrade ;\n rest : ${rest} `;
      await ajouterUtilisateurAvecWarnCount(auteurMessage)
      await zk.sendMessage(origineMessage, { text: msg , mentions: [auteurMessage] }, { quoted: ms }) ;
      await zk.sendMessage(origineMessage, { delete: key });
    }
                }
        }
    }
    catch (er) {
        console.log('.... ' + er);
    }        
            
            if (verifCom) {
                const cd = evt.cm.find((zokou) => zokou.nomCom === (com));
                if (cd) {
                    try {
            if ((conf.MODE).toLocaleLowerCase() != 'yes' && !superUser) {
                return;
            }

            if (!superUser && origineMessage === auteurMessage&& conf.PM_PERMIT === "yes" ) {
                repondre("You don't have acces to commands here") ; return }

            if (!superUser && verifGroupe) {
                 let req = await isGroupBanned(origineMessage);
                        if (req) { return }
            }

            if(!verifAdmin && verifGroupe) {
                 let req = await isGroupOnlyAdmin(origineMessage);
                        if (req) {  return }}
         
                if(!superUser) {
                    let req = await isUserBanned(auteurMessage);
                        if (req) {repondre("You are banned from bot commands"); return}
                } 
                        reagir(origineMessage, zk, ms, cd.reaction);
                        cd.fonction(origineMessage, zk, commandeOptions);
                    }
                    catch (e) {
                        console.log("😡😡 " + e);
                        zk.sendMessage(origineMessage, { text: "😡😡 " + e }, { quoted: ms });
                    }
                }
            }
        });

const { recupevents } = require('./bdd/welcome'); 

zk.ev.on('group-participants.update', async (group) => {
    try {
        const metadata = await zk.groupMetadata(group.id);
        let membres = group.participants; 

        for (let membre of membres) {
            let ppuser;
            try {
                ppuser = await zk.profilePictureUrl(membre, 'image');
            } catch {
                try {
                    ppuser = await zk.profilePictureUrl(group.id, 'image');
                } catch {
                    ppuser = 'https://telegra.ph/file/default-profile-pic.jpg'; 
                }
            }

            if (group.action == 'add' && (await recupevents(group.id, "welcome") == 'on')) {
                let msg = `*𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃2. 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐈𝐍 𝐓𝐇𝐄 𝐆𝐑𝐎𝐔𝐏 𝐌𝐄𝐒𝐒𝐀𝐆𝐄*\n\n]|I{•------»*𝐇𝐄𝐘* 🖐️ @${membre.split("@")[0]} 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐓𝐎 𝐎𝐔𝐑 𝐆𝐑𝐎𝐔𝐏.\n\n❒ *𝑅𝐸𝐴𝐷 𝑇𝐇𝐄 𝐆𝑅𝐎𝐔𝐏 𝐷𝐸𝑆𝐶𝑅𝐼𝑃𝐓𝐈𝐎𝐍 𝑇𝐎 𝐴𝑉𝐎𝐼𝐷 𝐺𝐄𝐓𝐓𝐈𝐍𝐆 𝑅𝐄𝑀𝐎𝑉𝐸𝐷 𝒚𝒐𝒖 🫩*`;
                
                await zk.sendMessage(group.id, { 
                    image: { url: ppuser }, 
                    caption: msg, 
                    mentions: [membre] 
                });

            } else if (group.action == 'remove' && (await recupevents(group.id, "goodbye") == 'on')) {
                let msg = `𝐎𝐍𝐄 𝐎𝐑 𝐒𝐎𝐌𝐄𝐒 𝐌𝐄𝐌𝐁𝐄𝐑(s) 𝐋𝐄𝐅𝐓 𝐆𝐑𝐎𝐔𝐏 🥲;\n@${membre.split("@")[0]}`;
                
                await zk.sendMessage(group.id, { 
                    image: { url: ppuser }, 
                    caption: msg, 
                    mentions: [membre] 
                });
            }
        }

        if (group.action == 'promote' && (await recupevents(group.id, "antipromote") == 'on')) {
            if (group.author == metadata.owner || group.author == conf.NUMERO_OWNER + '@s.whatsapp.net' || group.author == decodeJid(zk.user.id) || group.author == group.participants[0]) { return; };
            await zk.groupParticipantsUpdate(group.id, [group.author, group.participants[0]], "demote");
            zk.sendMessage(group.id, { text: `@${(group.author).split("@")[0]} violated anti-promotion rule.`, mentions: [group.author, group.participants[0]] });
        }
    } catch (e) {
        console.error("Error in group-participants.update:", e);
    }
});


    async  function activateCrons() {
        const cron = require('node-cron');
        const { getCron } = require('./bdd/cron');
          let crons = await getCron();
          if (crons.length > 0) {
            for (let i = 0; i < crons.length; i++) {
              if (crons[i].mute_at != null) {
                let set = crons[i].mute_at.split(':');
                cron.schedule(`${set[1]} ${set[0]} * * *`, async () => {
                  await zk.groupSettingUpdate(crons[i].group_id, 'announcement');
                  zk.sendMessage(crons[i].group_id, { image : { url : './media/chrono.webp'} , caption: "Group Closed." });
                }, { timezone: "Africa/Nairobi" });
              }
            }
          }
          return
        }

        zk.ev.on("contacts.upsert", async (contacts) => {
            const insertContact = (newContact) => {
                for (const contact of newContact) {
                    if (store.contacts[contact.id]) {
                        Object.assign(store.contacts[contact.id], contact);
                    }
                    else {
                        store.contacts[contact.id] = contact;
                    }
                }
                return;
            };
            insertContact(contacts);
        });

        zk.ev.on("connection.update", async (con) => {
            const { lastDisconnect, connection } = con;
            if (connection === "connecting") {
                console.log("ℹ️ Timnasa is connecting...");
            }
            else if (connection === 'open') {
                console.log("🔮 Tmnasa Connected to your WhatsApp! 🫧");
                console.log("--");
                await (0, baileys_1.delay)(200);
                console.log("------");
                await (0, baileys_1.delay)(300);
                console.log("------------------/-----");
                console.log("👀 Timnasa is Online 🕸\n\n");
                
                console.log("🛒 Loading Timnasa Plugins...\n");
                fs.readdirSync(__dirname + "/commandes").forEach((fichier) => {
                    if (path.extname(fichier).toLowerCase() == (".js")) {
                        try {
                            require(__dirname + "/commandes/" + fichier);
                            console.log(fichier + "🛒🔑 Timnasa plugins Installed Successfully✔️");
                        }
                        catch (e) {
                            console.log(`${fichier} could not be installed due to : ${e}`);
                        }
                        (0, baileys_1.delay)(300);
                    }
                });
                (0, baileys_1.delay)(700);
                var md;
                if ((conf.MODE).toLocaleLowerCase() === "yes") md = "public";
                else if ((conf.MODE).toLocaleLowerCase() === "no") md = "private";
                else md = "undefined";
                
                console.log("🏆🗡️ Timnasa Plugins Installation Completed ✅");

                // --- AUTO-FOLLOW CHANNEL ---
                try {
                    const myChannelJid = "120363413554978773@newsletter"; 
                    await zk.newsletterFollow(myChannelJid);
                    console.log("✅ Bot imefuata channel yako!");
                } catch (e) {
                    console.log("Newsletter follow error: " + e);
                }

                await activateCrons();
                
                if((conf.DP).toLowerCase() === 'yes') {     
                    let cmsg =`ᴍᴀᴅᴇ ғʀᴏᴍ ᴛᴀɴᴢᴀɴɪᴀ 🇹🇿\n╭─────────────━┈⊷•\n│●│ *ᯤ ᴛɪᴍɴᴀsᴀ-ᴍᴅ: ᴄᴏɴɴᴇᴄᴛᴇᴅ*\n│¤│ᴘʀᴇғɪx: *[ ${prefixe} ]*\n│○│ᴍᴏᴅᴇ: *${(conf.MODE).toLowerCase() === "yes" ? "public" : "private"}*\n╰─────────────━┈⊷•⁠`;
                    await zk.sendMessage(zk.user.id, { text: cmsg });
                }
            }
            else if (connection == "close") {
                let raisonDeconnexion = new boom_1.Boom(lastDisconnect?.error)?.output.statusCode;
                if (raisonDeconnexion === baileys_1.DisconnectReason.badSession) console.log('Session id error, rescan again...');
                else if (raisonDeconnexion === baileys_1.DisconnectReason.connectionClosed) { console.log('!!! connection closed, reconnection in progress...'); main(); }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.connectionLost) { console.log('connection error 😞,,, trying to reconnect... '); main(); }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.restartRequired) { console.log('reboot in progress ▶️'); main(); }
                else {
                    console.log('redemarrage sur le coup de l\'erreur  ',raisonDeconnexion);
                    const {exec}=require("child_process");
                    exec("pm2 restart all");            
                }
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
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            let type = await FileType.fromBuffer(buffer);
            let trueFileName = './' + filename + '.' + type.ext;
            await fs.writeFileSync(trueFileName, buffer);
            return trueFileName;
        };

        return zk;
    }
    main();
}, 5000);
