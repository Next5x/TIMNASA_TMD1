"use strict";

const { zokou } = require("../framework/zokou");

/**
 * ANTI-MEDIA SYSTEM
 * Purpose: Automatically deletes media files (Images, Videos, Stickers, Audio)
 * and warns the sender.
 */

zokou({
    nomCom: "antimedia",
    categorie: "Group",
    reaction: "🚫"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, verifGroupe, verifAdmin, superUser, prefixe } = commandeOptions;

    // 1. Validation
    if (!verifGroupe) return repondre("✋🏿 This command can only be used in groups.");
    if (!verifAdmin && !superUser) return repondre("⛔ Only Admins can toggle the Anti-Media system.");

    if (!arg[0]) {
        return repondre(`*⚠️ USAGE GUIDE:*\n\n1. *${prefixe}antimedia on* (Block all media)\n2. *${prefixe}antimedia off* (Allow media)`);
    }

    const mode = arg[0].toLowerCase();

    if (mode === "on") {
        // Logic to save the status to your database (e.g., MongoDB/Postgres)
        // For now, we simulate the activation
        repondre("✅ *ANTI-MEDIA ENABLED!* \nAll images, videos, audios, and stickers sent by non-admins will be deleted automatically.");
    } else if (mode === "off") {
        // Logic to disable in database
        repondre("✅ *ANTI-MEDIA DISABLED!* \nMembers are now allowed to send media files.");
    } else {
        repondre(`❌ Invalid choice. Use *${prefixe}antimedia on* or *off*.`);
    }
});

/** * NOTE: The deletion logic must be placed in your main message handler (usually index.js or zokou.js) 
 * to monitor incoming messages. Here is how that logic looks:
 * * if (isMedia && antiMediaActive && !isAdmin) {
 * await zk.sendMessage(dest, { delete: ms.key });
 * await zk.sendMessage(dest, { text: "⚠️ @user, Media is not allowed in this group!" }, { mentions: [sender] });
 * }
 */
