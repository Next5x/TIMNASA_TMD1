const { zokou } = require(__dirname + "/../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

zokou({
    nomCom: "alive2",
    aliases: ["menu", "hali", "panel"], // Allows the bot to respond to .menu as well
    categorie: "General",
    reaction: "⚡"
},
async (dest, zk, commandeOptions) => {
    const { ms, auteurMessage, prefix, repondre } = commandeOptions;

    try {
        // 1. System Info
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const time = moment().tz('Africa/Dar_es_Salaam').format('HH:mm:ss');

        // 2. Media Links
        const imageUrl = "https://files.catbox.moe/qf6u89.jpg";
        const audioUrl = "https://files.catbox.moe/lqx6sp.mp3";

        // 3. Menu Text
        const menuText = `*ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ ɪs ᴏɴʟɪɴᴇ* ⚡

*Hi @${auteurMessage.split("@")[0]}*
The system is active and stable.

━━━━━━━━━━━━━━━━━━━━━
🌟 *OWNER:* ${s.OWNER_NAME || "TIMNASA"}
🕒 *TIME:* ${time} EAT
⌛ *UPTIME:* ${hours}h ${minutes}m ${seconds}s
🖥️ *PLATFORM:* ${os.platform()}
🛰️ *RAM:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
━━━━━━━━━━━━━━━━━━━━━

*AVAILABLE COMMANDS:*
🚀 ${prefix}download - Media tools
🚀 ${prefix}group - Management
🚀 ${prefix}general - Info tools
🚀 ${prefix}owner - Bot control

_Type ${prefix}list for all commands._
━━━━━━━━━━━━━━━━━━━━━`;

        // 4. Send Image with Context
        await zk.sendMessage(dest, { 
            image: { url: imageUrl },
            caption: menuText,
            mentions: [auteurMessage],
            contextInfo: {
                externalAdReply: {
                    title: "TIMNASA TMD SYSTEM",
                    body: "Status: Online",
                    thumbnailUrl: imageUrl,
                    sourceUrl: "https://whatsapp.com/channel/120363413554978773@newsletter",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: ms });

        // 5. Send Audio
        await zk.sendMessage(dest, {
            audio: { url: audioUrl },
            mimetype: 'audio/mp4',
            ptt: false 
        }, { quoted: ms });

    } catch (e) {
        console.error("Menu Error: ", e);
        repondre("Command failed: " + e.message);
    }
});
