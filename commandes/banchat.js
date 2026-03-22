"use strict";

const { zokou } = require("../framework/zokou");

// Using a Global Array (Note: This clears if the bot restarts. Use a Database for permanent storage)
global.mutedUsers = global.mutedUsers || [];

zokou({
    nomCom: "ban-chat",
    category: "Group",
    reaction: "🚫"
}, async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, isGroupAdmins, superUser, isBotGroupAdmins } = commandeOptions;

    if (!isGroupAdmins && !superUser) return repondre("❌ This command is for Admins or Owner only.");
    if (!isBotGroupAdmins) return repondre("❌ The Bot must be an Admin to delete messages.");

    // Get the user JID (either by tagging them or providing the phone number)
    let user = ms.message.extendedTextMessage?.contextInfo?.mentionedJid?. || (arg ? arg.replace(/[^0-9]/g, '') + "@s.whatsapp.net" : null);

    if (!user) return repondre("Please tag the user you want to ban from chatting.");

    if (!global.mutedUsers.includes(user)) {
        global.mutedUsers.push(user);
        repondre(`✅ User @${user.split('@')} is now banned from chatting. Every message they send will be deleted immediately.`, { mentions: [user] });
    } else {
        repondre("This user is already on the banned list.");
    }
});

// Command to Unban
zokou({
    nomCom: "unban-chat",
    category: "Group",
    reaction: "✅"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, isGroupAdmins, superUser } = commandeOptions;
    if (!isGroupAdmins && !superUser) return repondre("❌ Admins only.");

    let user = arg ? arg.replace(/[^0-9]/g, '') + "@s.whatsapp.net" : null;
    if (global.mutedUsers.includes(user)) {
        global.mutedUsers = global.mutedUsers.filter(u => u !== user);
        repondre("✅ User is now allowed to chat again.");
    } else {
        repondre("This user is not in the banned list.");
    }
});
