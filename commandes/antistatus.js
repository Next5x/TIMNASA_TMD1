const { zokou } = require("../framework/zokou");
const conf = require("../set");

zokou({
    nomCom: "antistatus",
    reaction: "🛡️",
    categorie: "Group"
}, async (dest, zk, reponse) => {
    const { ms, arg, superUser, verifAdmin } = reponse;
    const channelJid = "120363413554978773@newsletter";

    if (!superUser && !verifAdmin) {
        return zk.sendMessage(dest, { text: "❌ Admins only command!" }, { quoted: ms });
    }

    if (!arg[0]) {
        return zk.sendMessage(dest, { 
            text: `*ANTISTATUS PROTECT*\n\nStatus: *${conf.ANTISTATUS || "off"}*\n\n🔹 *.antistatus on* - Enable Protect\n🔹 *.antistatus off* - Disable Protect\n\nChannel: https://whatsapp.com/channel/0029VaF39946H4YhS6u8Yt3q` 
        }, { quoted: ms });
    }

    if (arg[0].toLowerCase() === "on") {
        conf.ANTISTATUS = "on";
        await zk.sendMessage(dest, { text: "✅ Anti-Status Mention Enabled! Bot will now delete and kick violators." }, { quoted: ms });
    } else {
        conf.ANTISTATUS = "off";
        await zk.sendMessage(dest, { text: "❌ Anti-Status Mention Disabled." }, { quoted: ms });
    }
});
