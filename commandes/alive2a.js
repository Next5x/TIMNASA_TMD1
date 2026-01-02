"use strict";
const { zokou } = require(__dirname + "/../framework/zokou");
const s = require(__dirname + "/../set");
const os = require("os");
const moment = require("moment-timezone");

zokou({
    nomCom: "alive2",
    categorie: "General",
    reaction: "⏳"
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, prefixe, nomAuteurCom, listesCommandes, auteurMessage } = commandeOptions;

    try {
        // 1. Loading Animation
        const { key } = await zk.sendMessage(dest, { text: "𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 Loading... 0%" }, { quoted: ms });
        
        const loadingSteps = ["0%", "05", "25%", "50%", "85%", "100%"];
        for (let step of loadingSteps) {
            await new Promise(resolve => setTimeout(resolve, 400));
            await zk.sendMessage(dest, { text: `𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 Loading... ${step}`, edit: key });
        }

        // 2. Maandalizi ya Muda na Tarehe
        const date = moment().tz("Africa/Nairobi").format("DD/MM/YYYY");
        const day = moment().tz("Africa/Nairobi").format("dddd");
        const time = moment().tz("Africa/Nairobi").format("HH:mm:ss");

        // 3. Maelezo mengine
        const totalCommands = listesCommandes.length;
        const userTag = auteurMessage.split("@")[0]; // Kwa ajili ya ku-tag

        const menuText = `
┏━━━━━━━⚡━━━━━━┓
   *𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 𝚳𝚵𝚴𝐔*
┗━━━━━━━⚡━━━━━━┛

*👋 Habari @${userTag}*

*📅 Leo ni:* ${day}
*📆 Tarehe:* ${date}
*⌚ Saa:* ${time}
*📊 Commands:* ${totalCommands}
*⌨️ Prefix:* ${prefixe}
*🛰️ JID:* 120363413554978773@newsletter

--- *Orodha ya Huduma* ---

*1. General Commands*
   - ${prefixe}alive : Hali ya Bot
   - ${prefixe}menu  : Orodha hii
   - ${prefixe}owner : Mmiliki

*2. Multimedia*
   - ${prefixe}play  : Muziki
   - ${prefixe}video : Pakua Video

> Powered by 𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃
        `;

        // 4. Tuma Menu na Tag
        await zk.sendMessage(dest, { 
            text: menuText,
            mentions: [auteurMessage], // Hii inafanya tag ifanye kazi
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 SYSTEM",
                    body: `Mtumiaji: ${nomAuteurCom}`,
                    thumbnailUrl: "https://files.catbox.moe/lqx6sp.mp3", 
                    sourceUrl: "https://whatsapp.com/channel/0029Vat3f9S8qIzp9wS0S03u",
                    mediaType: 1,
                    renderLargerThumbnail: true
                },
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363413554978773@newsletter",
                    newsletterName: "𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 Support",
                    serverMessageId: 143
                }
            }
        }, { quoted: ms });

        // Tuma Audio
        await zk.sendMessage(dest, { 
            audio: { url: "https://files.catbox.moe/lqx6sp.mp3" }, 
            mimetype: 'audio/mp4', 
            ptt: true 
        }, { quoted: ms });

    } catch (e) {
        repondre("Hitilafu imetokea: " + e.message);
    }
});
