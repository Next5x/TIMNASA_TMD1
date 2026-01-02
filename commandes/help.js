"use strict";

const { zokou } = require("../framework/zokou");
const conf = require("../set");
const os = require("os");
const moment = require("moment-timezone");

zokou({
    nomCom: "help",
    aliases: ["help", "list"],
    categorie: "General",
    reaction: "👑"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, prefixe, nomAuteurMessage } = commandeOptions;
    const { cm } = require(__dirname + "/../framework/zokou"); 
    const channelId = "120363413554978773@newsletter";

    try {
        // Date and Time Setup
        const date = moment().tz("Africa/Nairobi").format("DD/MM/YYYY");
        const time = moment().tz("Africa/Nairobi").format("HH:mm:ss");
        
        // Speed (Ping) Calculation
        const start = Date.now();
        const ping = Date.now() - start;

        // Command Organizer
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
│ ⏳ *𝚄𝙿𝚃𝙸𝙼𝙴:* ${process.uptime().toFixed(0)}s
╰─────────────━┈⊷•

*『 ⚙️ 𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂 𝚀𝚄𝙸𝙲𝙺 𝙻𝙸𝙽𝙺𝚂 』*
_Tap the text below to copy:_
• \`\`\`${prefixe}welcome on/off\`\`\`
• \`\`\`${prefixe}goodbye on/off\`\`\`
• \`\`\`${prefixe}antipromote on/off\`\`\`
• \`\`\`${prefixe}antidemote on/off\`\`\`

*『 📞 𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝚂𝚄𝙿𝙿𝙾𝚁𝚃 』*
• *Owner:* wa.me/255743706043
• *Support:* wa.me/255743706043

*『 𝙰𝚅𝙰𝙸𝙻𝙰𝙱𝙻𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂 』*
`;

        // Generate dynamic categories
        const categories = Object.keys(list_menu).sort();
        for (const cat of categories) {
            menuMsg += `\n*◈──╼[ ${cat.toUpperCase()} ]╾──◈*\n`;
            for (const cmd of list_menu[cat]) {
                menuMsg += `  ☞ ${prefixe}${cmd}\n`;
            }
        }

        menuMsg += `\n\n_Powered by 𝚃𝙸𝙼𝙽𝙰𝚂𝙰 𝚃𝙼𝙳 𝚂𝚈𝚂𝚃𝙴𝙼_`;

        // Fetch Menu Image
        let menuImg;
        try {
            menuImg = await zk.profilePictureUrl(zk.user.id, 'image');
        } catch {
            menuImg = conf.IMAGE_MENU || "https://files.catbox.moe/zm113g.jpg";
        }

        // Send Professional Menu
        await zk.sendMessage(dest, {
            image: { url: menuImg },
            caption: menuMsg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelId,
                    newsletterName: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝙾𝙵𝙵𝙸𝙲𝙸𝙰𝙻",
                    serverMessageId: 1
                },
                externalAdReply: {
                    title: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝙰𝙳𝚅𝙰𝙽𝙲𝙴𝙳 𝙼𝙴𝙽𝚄",
                    body: "Tap to message the Owner",
                    thumbnailUrl: menuImg,
                    sourceUrl: "https://wa.me/255743706043", 
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: ms });

    } catch (error) {
        console.error("Menu Error:", error);
        repondre("❌ Error loading menu: " + error.message);
    }
});
