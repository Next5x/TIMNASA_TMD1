const { zokou } = require("../framework/zokou");
const { exec } = require("child_process");

zokou({
    nomCom: "clear",
    aliases: ["clean", "flush"],
    categorie: "General",
    reaction: "🧹"
}, async (dest, zk, commandeOptions) => {
    const { repondre, superUser, ms } = commandeOptions;

    // Only the bot owner should be able to clear the system
    if (!superUser) {
        return repondre("❌ This command is restricted to the Bot Owner.");
    }

    await zk.sendMessage(dest, { text: "🧹 *TIMNASA TMD is cleaning system... Please wait.*" }, { quoted: ms });

    try {
        // 1. Clear Chat History (Optional: Clears the current chat to free memory)
        await zk.chatModify({ delete: true, lastMessages: [{ key: ms.key, messageTimestamp: ms.messageTimestamp }] }, dest);

        // 2. Clear Temporary Files/Cache from the server
        // This command looks for common temp folders like 'temp' or 'session' (be careful with sessions)
        exec("rm -rf ./temp/*", (error, stdout, stderr) => {
            if (error) {
                console.error(`Error during cleaning: ${error}`);
            }
        });

        // 3. Clear Internal Bot Cache
        if (global.store) {
            global.store.chats.clear();
            global.store.messages.clear();
        }

        const successMsg = `*✅ SYSTEM CLEANED SUCCESSFULLY!*\n\n` +
                           `🔹 *Cache:* Cleared\n` +
                           `🔹 *Temp Media:* Deleted\n` +
                           `🔹 *System Status:* Optimized\n\n` +
                           `_Your WhatsApp should now feel lighter._`;

        await zk.sendMessage(dest, { 
            text: successMsg,
            contextInfo: {
                externalAdReply: {
                    title: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰 𝚃𝙼𝙳 𝙲𝙻𝙴𝙰𝙽𝙴𝚁",
                    body: "System Optimization Complete",
                    thumbnailUrl: "https://telegra.ph/file/your-image-id.jpg", 
                    sourceUrl: "https://whatsapp.com/channel/0029VaF39946H4YhS6u8Yt3q",
                    mediaType: 1
                }
            }
        });

    } catch (e) {
        console.log(e);
        repondre("❌ An error occurred while cleaning the system.");
    }
});
