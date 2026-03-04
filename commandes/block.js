"use strict";

const { zokou } = require("../framework/zokou");

/**
 * WHATSAPP BLOCK/UNBLOCK SYSTEM
 * Purpose: Strictly block/unblock a user from interacting with the bot's WhatsApp account.
 */

// 1. BLOCK COMMAND
zokou({
    nomCom: "block",
    categorie: "Owner",
    reaction: "🚫"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms, superUser, prefixe } = commandeOptions;

    // Security: Only the Bot Owner can use this
    if (!superUser) return repondre("❌ Access Denied: This command is restricted to the Bot Owner.");

    let target;
    
    // Check if a user is tagged, replied to, or if a number is provided
    if (ms.message.extendedTextMessage && ms.message.extendedTextMessage.contextInfo.mentionedJid) {
        target = ms.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (ms.message.extendedTextMessage && ms.message.extendedTextMessage.contextInfo.participant) {
        target = ms.message.extendedTextMessage.contextInfo.participant;
    } else if (arg[0]) {
        target = arg[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    } else {
        return repondre(`*⚠️ HOW TO USE:*\n\n1. Tag a user: *${prefixe}block @user*\n2. Reply to their message with *${prefixe}block*\n3. Enter their number: *${prefixe}block 2547xxx*`);
    }

    try {
        await zk.updateBlockStatus(target, "block");
        repondre(`✅ User @${target.split('@')[0]} has been successfully blocked!`, { mentions: [target] });
    } catch (e) {
        repondre("❌ Failed to block the user. Ensure the number is valid and the bot is connected.");
    }
});

// 2. UNBLOCK COMMAND
zokou({
    nomCom: "unblock",
    categorie: "Owner",
    reaction: "🔓"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, superUser, prefixe } = commandeOptions;

    if (!superUser) return repondre("❌ Access Denied: This command is for the Owner only.");
    
    if (!arg[0]) return repondre(`*Example:* ${prefixe}unblock 2547xxxx`);

    let target = arg[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    try {
        await zk.updateBlockStatus(target, "unblock");
        repondre(`✅ User @${target.split('@')[0]} has been unblocked. They can now message the bot again.`, { mentions: [target] });
    } catch (e) {
        repondre("❌ Error: Could not unblock the user.");
    }
});
