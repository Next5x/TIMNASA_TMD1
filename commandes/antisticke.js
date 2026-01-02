const { zokou } = require("../framework/zokou");
const conf = require("../set");

zokou({
    nomCom: "antisticker",
    reaction: "🚫",
    categorie: "Group"
}, async (dest, zk, reponse) => {
    const { ms, arg, superUser, verifAdmin } = reponse;

    // Restriction: Admins only
    if (!superUser && !verifAdmin) {
        return zk.sendMessage(dest, { text: "❌ This command is restricted to Group Admins only!" }, { quoted: ms });
    }

    if (!arg[0]) {
        return zk.sendMessage(dest, { 
            text: `*ANTI-STICKER CONTROL*\n\nCurrent Status: *${conf.ANTISTICKER || "off"}*\n\n🔹 *.antisticker on* - Delete all stickers from non-admins\n🔹 *.antisticker off* - Allow stickers` 
        }, { quoted: ms });
    }

    if (arg[0].toLowerCase() === "on") {
        conf.ANTISTICKER = "on";
        await zk.sendMessage(dest, { text: "✅ *Anti-Sticker is now ENABLED.* All stickers sent by non-admins will be deleted." }, { quoted: ms });
    } else if (arg[0].toLowerCase() === "off") {
        conf.ANTISTICKER = "off";
        await zk.sendMessage(dest, { text: "❌ *Anti-Sticker is now DISABLED.*" }, { quoted: ms });
    }
});
