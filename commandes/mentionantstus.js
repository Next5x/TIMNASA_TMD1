const { zokou } = require("../framework/zokou");
const conf = require("../set");

zokou({
    nomCom: "antistatus",
    reaction: "🛡️",
    categorie: "Group"
}, async (dest, zk, reponse) => {
    const { ms, arg, superUser, verifAdmin } = reponse;

    // Restriction: Admins only
    if (!superUser && !verifAdmin) {
        return zk.sendMessage(dest, { text: "❌ This command is for Group Admins only!" }, { quoted: ms });
    }

    if (!arg[0]) {
        return zk.sendMessage(dest, { 
            text: `*ANTISTATUS PROTECT*\n\nCurrent Status: *${conf.ANTISTATUS || "off"}*\n\n🔹 *.antistatus on* - Enable Kick/Delete\n🔹 *.antistatus off* - Disable Protection` 
        }, { quoted: ms });
    }

    if (arg[0].toLowerCase() === "on") {
        conf.ANTISTATUS = "on";
        await zk.sendMessage(dest, { text: "✅ *Anti-Status Protection is now ON!* The bot will auto-kick users using hidden mentions." }, { quoted: ms });
    } else {
        conf.ANTISTATUS = "off";
        await zk.sendMessage(dest, { text: "❌ *Anti-Status Protection is now OFF.*" }, { quoted: ms });
    }
});
