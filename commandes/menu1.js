"use strict";

const { zokou } = require("../framework/zokou");
const conf = require("../set");
const moment = require("moment-timezone");

zokou({
    nomCom: "menu",
    aliases: ["help", "list"],
    categorie: "General",
    reaction: "👑"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, prefixe, nomAuteurMessage } = commandeOptions;
    const { cm } = require(__dirname + "/../framework/zokou"); 
    const channelJid = "120363406146813524@newsletter";
    const audioUrl = "https://files.catbox.moe/lqx6sp.mp3"; 

    try {
        const date = moment().tz("Africa/Nairobi").format("MMMM Do YYYY");
        const time = moment().tz("Africa/Nairobi").format("HH:mm:ss");
        const start = Date.now();
        const ping = Date.now() - start;

        const list_menu = {};
        cm.forEach((command) => {
            if (!list_menu[command.categorie]) {
                list_menu[command.categorie] = [];
            }
            list_menu[command.categorie].push(command.nomCom);
        });

        let menuMsg = `
╭─────────────━┈⊷•
│ 🤖 *𝙱𝙾𝚃:* 𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳
│ 👤 *𝚄𝚂𝙴𝚁:* ${nomAuteurMessage}
│ 📅 *𝙳𝙰𝚃𝙴:* ${date}
│ ⌚ *𝚃𝙸𝙼𝙴:* ${time}
│ 🚀 *𝙿𝙸𝙽𝙶:* ${ping} ms
╰─────────────━┈⊷•

*『 𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂 』*
• \`\`\`${prefixe}welcome on/off\`\`\`
• \`\`\`${prefixe}goodbye on/off\`\`\`

*『 𝙲𝙾𝙽𝚃𝙰𝙲𝚃 』*
• *Owner:* wa.me/255784766591

*『 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂 𝙻𝙸𝚂𝚃 』*
`;

        const categories = Object.keys(list_menu).sort();
        for (const cat of categories) {
            menuMsg += `\n*◈──╼[ ${cat.toUpperCase()} ]╾──◈*\n`;
            for (const cmd of list_menu[cat]) {
                menuMsg += `  ☞ ${prefixe}${cmd}\n`;
            }
        }

        // 1. Send Menu Image with English Caption
        await zk.sendMessage(dest, {
            image: { url: conf.IMAGE_MENU || "https://files.catbox.moe/zm113g.jpg" },
            caption: menuMsg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    newsletterName: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝚂𝚈𝚂𝚃𝙴𝙼",
                    serverMessageId: 1
                }
            }
        }, { quoted: ms });

        // 2. Send Playable Audio (Ensures it plays in WhatsApp)
        await zk.sendMessage(dest, {
            audio: { url: audioUrl },
            mimetype: 'audio/mp4', // Most compatible format for playback
            ptt: true,
            waveform: [10, 30, 50, 80, 50, 30, 50, 80, 50, 30, 10],
            contextInfo: {
                forwardingScore: 0,
                isForwarded: false, 
                externalAdReply: {
                    title: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝚂𝚈𝚂𝚃𝙴𝙼 𝙰𝙲𝚃𝙸𝚅𝙴",
                    body: "Status: System Running",
                    renderLargerThumbnail: false,
                    mediaType: 1,
                    thumbnailUrl: "https://files.catbox.moe/zm113g.jpg",
                    sourceUrl: "https://wa.me/255784766591"
                }
            }
        }, { quoted: ms });

    } catch (error) {
        console.error("Menu Generation Error:", error);
        repondre("✅ Bot is online, but I had trouble displaying the full menu visuals.");
    }
});
