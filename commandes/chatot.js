const { zokou } = require("../framework/zokou");
const conf = require("../set");

zokou({
    nomCom: "chatbot",
    reaction: "🤖",
    categorie: "Settings"
}, async (dest, zk, reponse) => {
    const { ms, arg, superUser, verifAdmin } = reponse;
    const channelJid = "120363413554978773@newsletter";

    // Permissions Check
    if (!superUser && !verifAdmin) {
        return zk.sendMessage(dest, { text: "❌ This command is restricted to Admins/Owner only!" }, { quoted: ms });
    }

    if (!arg[0]) {
        const status = conf.CHATBOT === "on" ? "ENABLED ✅" : "DISABLED ❌";
        return zk.sendMessage(dest, { 
            text: `*ZOKOU CHATBOT SETTINGS*\n\n` +
                 `Current Status: *${status}*\n\n` +
                 `*Commands:*\n` +
                 `🔹 *.chatbot on* - Turn on auto-reply\n` +
                 `🔹 *.chatbot off* - Turn off auto-reply\n\n` +
                 `📢 *Official Channel:* \nhttps://whatsapp.com/channel/0029VaF39946H4YhS6u8Yt3q\n` +
                 `*ID:* ${channelJid}`
        }, { quoted: ms });
    }

    if (arg[0].toLowerCase() === "on") {
        conf.CHATBOT = "on";
        await zk.sendMessage(dest, { text: "✅ *Chatbot is now ON!* It will now respond with typing/recording effects." }, { quoted: ms });
        
        // Show Channel Card
        await zk.sendMessage(dest, { 
            text: "Follow our official channel for updates:",
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    newsletterName: "Zokou Official Updates",
                    serverMessageId: 1
                }
            }
        });

    } else if (arg[0].toLowerCase() === "off") {
        conf.CHATBOT = "off";
        await zk.sendMessage(dest, { text: "❌ *Chatbot is now OFF!*" }, { quoted: ms });
    }
});
