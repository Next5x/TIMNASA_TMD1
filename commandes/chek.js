"use strict";

const { zokou } = require("../framework/zokou");

zokou({
    nomCom: "check",
    categorie: "Utility",
    reaction: "🔍"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms, superUser } = commandeOptions;

    if (!superUser) return repondre("❌ Owner Only Command.");
    if (!arg[0]) return repondre("*Usage:* .check 2557xxx");

    const targetNum = arg[0].replace(/[^0-9]/g, "");
    const targetJid = targetNum + "@s.whatsapp.net";
    const channelJid = "120363406146813524@newsletter";

    repondre(`🔎 *Checking status for ${targetNum}...*`);

    try {
        // 1. Angalia kama namba ipo WhatsApp
        const [result] = await zk.onWhatsApp(targetJid);

        if (!result || !result.exists) {
            return repondre(`❌ *ERROR:* Namba ${targetNum} haijajisajili na WhatsApp.`);
        }

        // 2. Jaribu kupata Profile Picture na Status (Bio)
        let ppUrl;
        try { ppUrl = await zk.profilePictureUrl(targetJid, 'image'); } catch { ppUrl = "https://files.catbox.moe/zm113g.jpg"; }

        let status;
        try { const statusData = await zk.fetchStatus(targetJid); status = statusData.status || "No Status"; } catch { status = "Private/Hidden"; }

        let checkMsg = `
📡 *TIMNASA-MD SCANNER* 📡
───────────────────
✅ *STATUS:* ACTIVE (WhatsApp Found)
📱 *NUMBER:* ${targetNum}
📝 *BIO:* ${status}
🔗 *JID:* ${targetJid}
───────────────────
> *System:* Target is ready for exploit. ☣️
`;

        await zk.sendMessage(dest, {
            image: { url: ppUrl },
            caption: checkMsg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    newsletterName: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰 𝚃𝙼𝙳 𝚂𝙲𝙰𝙽𝙽𝙴𝚁",
                    serverMessageId: 1
                }
            }
        }, { quoted: ms });

    } catch (e) {
        console.error(e);
        repondre("❌ Scanner Error: Could not retrieve target info.");
    }
});
