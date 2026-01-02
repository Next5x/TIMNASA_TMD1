"use strict";
const { zokou } = require(__dirname + "/../framework/zokou");
const s = require(__dirname + "/../set");
const os = require("os");
const moment = require("moment-timezone");

zokou({
    nomCom: "alive2",
    categorie: "Menu",
    reaction: "⏳"
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, prefixe, nomAuteurCom, listesCommandes, auteurMessage } = commandeOptions;

    try {
        // 1. Loading Animation (English)
        const { key } = await zk.sendMessage(dest, { text: "📥 𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 𝐋𝐨𝐚𝐝𝐢𝐧𝐠... 0%" }, { quoted: ms });
        
        const loadingSteps = ["35%", "70%", "100%"];
        for (let step of loadingSteps) {
            await new Promise(resolve => setTimeout(resolve, 400));
            await zk.sendMessage(dest, { text: `📥 𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 𝐋𝐨𝐚𝐝𝐢𝐧𝐠... ${step}`, edit: key });
        }

        // 2. Date and Time (EAT)
        const date = moment().tz("Africa/Nairobi").format("DD/MM/YYYY");
        const day = moment().tz("Africa/Nairobi").format("dddd");
        const time = moment().tz("Africa/Nairobi").format("HH:mm:ss");

        // 3. Organize Commands Automatically
        const organizedCmds = {};
        listesCommandes.forEach(cmd => {
            if (!organizedCmds[cmd.categorie]) {
                organizedCmds[cmd.categorie] = [];
            }
            organizedCmds[cmd.categorie].push(cmd.nomCom);
        });

        const userTag = auteurMessage.split("@")[0];
        
        let menuBody = `┏━━━━━━━━━━━━━━━━━┓
   🌀 *𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 𝚳𝚵𝚴𝐔* 🌀
┗━━━━━━━━━━━━━━━━━┛

👋 𝐇𝐞𝐥𝐥𝐨 @${userTag}

📅 𝐃𝐚𝐲: ${day}
📆 𝐃𝐚𝐭𝐞: ${date}
⌚ 𝐓𝐢𝐦𝐞: ${time}
📊 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬: ${listesCommandes.length}
⌨️ 𝐏𝐫𝐞𝐟𝐢𝐱: ${prefixe}
🛰️ 𝐉𝐈𝐃: 120363413554978773@newsletter

--- 📥 𝐀𝐋𝐋 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 📥 ---
`;

        for (const category in organizedCmds) {
            // Transform category into Bold Unicode
            const blueCategory = category.toUpperCase().replace(/[A-Z]/g, char => {
                const fonts = {'A':'𝐀','B':'𝐁','C':'𝐂','D':'𝐃','E':'𝐄','F':'𝐅','G':'𝐆','H':'𝐇','I':'𝐈','J':'𝐉','K':'𝐊','L':'𝐋','M':'𝐌','N':'𝐍','O':'𝐎','P':'𝐏','Q':'𝐐','R':'𝐑','S':'𝐒','T':'𝐓','U':'𝐔','V':'𝐕','W':'𝐖','X':'𝐗','Y':'𝐘','Z':'𝐙'};
                return fonts[char] || char;
            });

            menuBody += `\n🔹 *╭─── 「 ${blueCategory} 」*`;
            for (const cmd of organizedCmds[category]) {
                menuBody += `\n🔹 *│* ⚡ ${prefixe}${cmd}`;
            }
            menuBody += `\n🔹 *╰───────────────*\n`;
        }

        menuBody += `\n> 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃`;

        // 4. Send Menu with Image Thumbnail
        await zk.sendMessage(dest, { 
            text: menuBody,
            mentions: [auteurMessage],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 𝐒𝐘𝐒𝐓𝐄𝐌 𝐕𝟑",
                    body: `User: ${nomAuteurCom}`,
                    thumbnailUrl: "https://files.catbox.moe/tq4mph.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029Vat3f9S8qIzp9wS0S03u",
                    mediaType: 1,
                    renderLargerThumbnail: true
                },
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363413554978773@newsletter",
                    newsletterName: "𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 Updates",
                    serverMessageId: 143
                }
            }
        }, { quoted: ms });

        // Send Audio
        await zk.sendMessage(dest, { 
            audio: { url: "https://files.catbox.moe/lqx6sp.mp3" }, 
            mimetype: 'audio/mp4', 
            ptt: true 
        }, { quoted: ms });

    } catch (e) {
        repondre("Error: " + e.message);
    }
});
