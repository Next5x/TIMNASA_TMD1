
const { zokou } = require(__dirname + "/../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

zokou({
    nomCom: "Menu",
    aliases: ["menu", "panel"], // Inaweza kuitwa pia kwa .menu
    categorie: "General",
    reaction: "⚡"
},
async (dest, zk, commandeOptions) => {
    const { ms, auteurMessage, repondre, prefix } = commandeOptions;

    // 1. Calculate Latency (Speed)
    const start = Date.now();
    const latency = Date.now() - start;

    // 2. Uptime details
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    // 3. Tanzania Time (EAT)
    const currentTime = moment().tz('Africa/Dar_es_Salaam').format('HH:mm:ss');
    const currentDate = moment().tz('Africa/Dar_es_Salaam').format('DD/MM/YYYY');

    // 4. Random selection from Images
    const myPictures = [
        "https://files.catbox.moe/qf6u89.jpg",
        "https://files.catbox.moe/qf6u89.jpg",
        "https://files.catbox.moe/qf6u89.jpg"
    ];
    const randomPic = myPictures[Math.floor(Math.random() * myPictures.length)];

    // 5. Menu Content / Command List
    const menuMsg = `
*ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ ɪs ᴏɴʟɪɴᴇ* ⚡

*Hi @${auteurMessage.split("@")[0]}*
Welcome to **TIMNASA TMD** System.

━━━━━━━━━━━━━━━━━━━━━
🚀 *SPEED:* ${latency} ms
🌟 *OWNER:* ${s.OWNER_NAME || "TIMNASA TMD"}
🕒 *TIME:* ${currentTime}
📅 *DATE:* ${currentDate}
⌛ *UPTIME:* ${hours}h ${minutes}m ${seconds}s
🖥️ *PLATFORM:* ${os.platform()}
━━━━━━━━━━━━━━━━━━━━━

*LIST OF COMMAND CATEGORIES:*
🌀 ${prefix}download - _To download media_
🌀 ${prefix}group - _Group management_
🌀 ${prefix}general - _General commands_
🌀 ${prefix}tools - _Helpful utilities_
🌀 ${prefix}owner - _Admin only_

_Use ${prefix}help <command> for more info_
━━━━━━━━━━━━━━━━━━━━━`;

    try {
        // Send Image with Menu context
        await zk.sendMessage(dest, { 
            image: { url: randomPic },
            caption: menuMsg,
            mentions: [auteurMessage],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "TIMNASA TMD MAIN MENU",
                    body: "Bot Status: Active",
                    thumbnailUrl: randomPic,
                    sourceUrl: "https://whatsapp.com/channel/120363413554978773@newsletter",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: ms });

        // 6. Send Audio (Optional)
        await zk.sendMessage(dest, {
            audio: { url: "https://files.catbox.moe/lqx6sp.mp3" },
            mimetype: 'audio/mp4',
            ptt: false 
        }, { quoted: ms });

    } catch (e) {
        console.log("Menu Error: " + e);
        repondre("An error occurred: " + e.message);
    }
});
