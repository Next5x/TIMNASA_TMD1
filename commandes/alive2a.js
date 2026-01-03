"use strict";
const { zokou } = require(__dirname + "/../framework/zokou");
const s = require(__dirname + "/../set");
const os = require("os");
const moment = require("moment-timezone");

zokou({
    nomCom: "menu2",
    categorie: "Menu",
    reaction: "⏳"
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, prefixe, nomAuteurCom, auteurMessage } = commandeOptions;

    // 1. Decorative Loading Animation
    let { key } = await zk.sendMessage(dest, { text: "📥 𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 𝐒𝐘𝐒𝐓𝐄𝐌 𝐋𝐨𝐚𝐝𝐢𝐧𝐠..." }, { quoted: ms });
    
    try {
        const loadingSteps = ["40%", "100%"];
        for (let step of loadingSteps) {
            await new Promise(resolve => setTimeout(resolve, 300));
            await zk.sendMessage(dest, { text: `📥 𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 𝐋𝐨𝐚𝐝𝐢𝐧𝐠... ${step}`, edit: key }).catch(() => {});
        }

        // 2. System Information (RAM, Platform, Uptime)
        const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const freeRam = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const platform = os.platform();
        const uptime = process.uptime().toFixed(0);

        // 3. Date and Time (East Africa Time)
        const date = moment().tz("Africa/Nairobi").format("DD/MM/YYYY");
        const day = moment().tz("Africa/Nairobi").format("dddd");
        const time = moment().tz("Africa/Nairobi").format("HH:mm:ss");

        // 4. Robust Command Fetching
        // This targets the core registry 'zokou.cm' to ensure commands are found
        const allCommands = zokou.cm || []; 
        const organizedCmds = {};
        
        allCommands.forEach(cmd => {
            const cat = cmd.categorie || "General";
            if (!organizedCmds[cat]) organizedCmds[cat] = [];
            organizedCmds[cat].push(cmd.nomCom);
        });

        const userTag = auteurMessage ? auteurMessage.split("@")[0] : "User";
        
        let menuBody = `┏━━━━━━━━━━━━━━━━━┓
   🌀 *𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 𝚳𝚵𝚴𝐔* 🌀
┗━━━━━━━━━━━━━━━━━┛

👋 𝐇𝐞𝐥𝐥𝐨 @${userTag}

🖥️ 𝐏𝐥𝐚𝐭𝐟𝐨𝐫𝐦: ${platform}
🚀 𝐒𝐩𝐞𝐞𝐝: ${uptime}s uptime
📟 𝐑𝐀𝐌: ${freeRam}GB / ${totalRam}GB
📊 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬: ${allCommands.length}
⌨️ 𝐏𝐫𝐞𝐟𝐢𝐱: ${prefixe}

📅 𝐃𝐚𝐲: ${day}
📆 𝐃𝐚𝐭𝐞: ${date}
⌚ 𝐓𝐢𝐦𝐞: ${time}
🛰️ 𝐉𝐈𝐃: 120363413554978773@newsletter

--- 📥 𝐀𝐋𝐋 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 📥 ---
`;

        // Sort categories and list commands
        const categories = Object.keys(organizedCmds).sort();
        for (const category of categories) {
            // Stylized Blue Bold Category Fonts
            const styledCategory = category.toUpperCase().replace(/[A-Z]/g, char => {
                const fonts = {'A':'𝐀','B':'𝐁','C':'𝐂','D':'𝐃','E':'𝐄','F':'𝐅','G':'𝐆','H':'𝐇','I':'𝐈','J':'𝐉','K':'𝐊','L':'𝐋','M':'𝐌','N':'𝐍','O':'𝐎','P':'𝐏','Q':'𝐐','R':'𝐑','S':'𝐒','T':'𝐓','U':'𝐔','V':'𝐕','W':'𝐖','X':'𝐗','Y':'𝐘','Z':'𝐙'};
                return fonts[char] || char;
            });

            menuBody += `\n🔹 *╭─── 「 ${styledCategory} 」*`;
            organizedCmds[category].sort().forEach(cmd => {
                menuBody += `\n🔹 *│* ⚡ ${prefixe}${cmd}`;
            });
            menuBody += `\n🔹 *╰───────────────*\n`;
        }

        menuBody += `\n> 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃`;

        // 5. Send Menu with Image Thumbnail & Newsletter Context
        await zk.sendMessage(dest, { 
            text: menuBody,
            mentions: [auteurMessage],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 𝐒𝐘𝐒𝐓𝐄𝐌 𝐕𝟑",
                    body: `Server: ${platform} | Active`,
                    thumbnailUrl: "https://files.catbox.moe/tq4mph.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029Vat3f9S8qIzp9wS0S03u",
                    mediaType: 1,
                    renderLargerThumbnail: true
                },
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363413554978773@newsletter",
                    newsletterName: "𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 Updates"
                }
            }
        }, { quoted: ms });

        // Play Intro Audio (Silent fail if link is down)
        zk.sendMessage(dest, { 
            audio: { url: "https://files.catbox.moe/lqx6sp.mp3" }, 
            mimetype: 'audio/mp4', 
            ptt: true 
        }, { quoted: ms }).catch(() => {});

    } catch (e) {
        console.error("Critical Menu Error:", e);
        repondre("An error occurred while generating the menu: " + e.message);
    }
});
