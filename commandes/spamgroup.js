const { zokou } = require("../framework/zokou");

zokou({
    nomCom: "shoot",
    reaction: "📣",
    categorie: "Owner"
}, async (dest, zk, reponse) => {
    const { ms, arg, verifAdmin, superUser } = reponse;
    const channelJid = "120363413554978773@newsletter";

    // Restriction: Only for Admins or Bot Owner
    if (!superUser && !verifAdmin) {
        return zk.sendMessage(dest, { text: "❌ This for owner only to prevent abuse." }, { quoted: ms });
    }

    if (!arg[0]) {
        return zk.sendMessage(dest, { text: "Usage: .shoot [number] [message]\nExample: .shoot 5 Hello everyone!" }, { quoted: ms });
    }

    const count = parseInt(arg[0]);
    const textToSend = arg.slice(1).join(" ");

    if (isNaN(count) || count > 20) {
        return zk.sendMessage(dest, { text: "❌ Please provide a number between 1 and 20 to avoid being banned." }, { quoted: ms });
    }

    if (!textToSend) {
        return zk.sendMessage(dest, { text: "❌ Please provide a message to send." }, { quoted: ms });
    }

    await zk.sendMessage(dest, { text: `🚀 Starting shoot of ${count} messages...` });

    for (let i = 0; i < count; i++) {
        await zk.sendMessage(dest, { 
            text: textToSend,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    newsletterName: "Timnasa Official Updates"
                }
            }
        });
        // Short delay to prevent WhatsApp from flagging the account immediately
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await zk.sendMessage(dest, { text: "✅ shoot completed." });
});
