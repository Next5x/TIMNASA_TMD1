const { zokou } = require("../framework/zokou");
const conf = require("../set");

zokou({
    nomCom: "statusmentions",
    reaction: "🛡️",
    categorie: "Group"
}, async (dest, zk, reponse) => {
    const { ms, arg, superUser, verifAdmin } = reponse;

    // Restriction: Admins only
    if (!superUser && !verifAdmin) {
        return zk.sendMessage(dest, { text: "❌ Access Denied! This is an Admin-only command." }, { quoted: ms });
    }

    if (!arg[0]) {
        return zk.sendMessage(dest, { 
            text: `*STATUS MENTIONS PROTECTION*\n\nCurrent Status: *${conf.STATUS_MENTIONS || "off"}*\n\n🔹 *.statusmentions on* - Enable 3-Warn Protect\n🔹 *.statusmentions off* - Disable Protection` 
        }, { quoted: ms });
    }

    if (arg[0].toLowerCase() === "on") {
        conf.STATUS_MENTIONS = "on";
        await zk.sendMessage(dest, { text: "✅ *Status Mentions protection is now ENABLED.* Users will receive 3 warnings before being kicked." }, { quoted: ms });
    } else {
        conf.STATUS_MENTIONS = "off";
        await zk.sendMessage(dest, { text: "❌ *Status Mentions protection is now DISABLED.*" }, { quoted: ms });
    }
});
