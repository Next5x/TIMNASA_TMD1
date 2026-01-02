const { zokou } = require("../framework/zokou");
const conf = require("../set");

zokou({
    nomCom: "antidelete",
    reaction: "🗑️",
    categorie: "General"
}, async (dest, zk, reponse) => {
    const { ms, arg, superUser } = reponse;

    // Owner only restriction
    if (!superUser) return;

    if (!arg[0]) {
        return zk.sendMessage(dest, { 
            text: `*TIMNASA ANTI-DELETE SETTINGS*\n\n` +
                 `Status: *${conf.ANTIDELETE || "off"}*\n` +
                 `Destination: *${conf.ANTIDELETE_DEST || "chat"}*\n\n` +
                 `Commands:\n` +
                 `🔹 *.antidelete on* - Enable full recovery\n` +
                 `🔹 *.antidelete off* - Disable system\n` +
                 `🔹 *.antidelete dm* - Send deleted items to your DM\n` +
                 `🔹 *.antidelete chat* - Show deleted items in the same chat`
        }, { quoted: ms });
    }

    const cmd = arg[0].toLowerCase();
    if (cmd === "on") { 
        conf.ANTIDELETE = "on"; 
        await reponse.reply("✅ Anti-Delete system is now ENABLED."); 
    }
    else if (cmd === "off") { 
        conf.ANTIDELETE = "off"; 
        await reponse.reply("❌ Anti-Delete system is now DISABLED."); 
    }
    else if (cmd === "dm") { 
        conf.ANTIDELETE_DEST = "dm"; 
        await reponse.reply("📥 All deleted media and chats will now be sent to your *Private DM*."); 
    }
    else if (cmd === "chat") { 
        conf.ANTIDELETE_DEST = "chat"; 
        await reponse.reply("💬 All deleted media and chats will be shown *In-Chat*."); 
    }
});
