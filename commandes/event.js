"use strict";

const { zokou } = require("../framework/zokou");
const s = require("../set");

// --- CONFIGURATION ---
const channelJid = "120363413554978773@newsletter";

/**
 * AUTO STATUS VIEW
 * Automatically views statuses of your contacts
 */
zokou({
    on: "status"
}, async (zk, statusMsg) => {
    if (s.AUTO_READ_STATUS === "yes") {
        await zk.readMessages([statusMsg.key]);
        console.log(`✅ Status viewed from: ${statusMsg.key.remoteJid}`);
    }
});

/**
 * ANTIDELETE
 * Detects when someone deletes a message and sends it back to you
 */
zokou({
    on: "delete"
}, async (zk, deletedMsg) => {
    if (s.ANTIDELETE === "yes") {
        const chat = deletedMsg.key.remoteJid;
        const participant = deletedMsg.key.participant || chat;
        
        let report = `*『 𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝙰𝙽𝚃𝙸-𝙳𝙴𝙻𝙴𝚃𝙴 』*\n\n`;
        report += `*User:* @${participant.split('@')[0]}\n`;
        report += `*Time:* ${new Date().toLocaleString()}\n`;
        report += `*Type:* Deleted Message Detection\n\n`;

        await zk.sendMessage(zk.user.id, { 
            text: report, 
            mentions: [participant],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    newsletterName: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰 𝚃𝙼𝙳 𝚂𝙴𝙲𝚄𝚁𝙸𝚃𝚈"
                }
            }
        });
        
        // Forward the original deleted message to your private chat
        await zk.copyNForward(zk.user.id, deletedMsg, true);
    }
});

/**
 * ANTICALL
 * Automatically rejects incoming calls to keep the bot online
 */
zokou({
    on: "call"
}, async (zk, call) => {
    if (s.ANTICALL === "yes") {
        const callId = call[0].id;
        const caller = call[0].from;

        await zk.rejectCall(callId, caller);
        
        await zk.sendMessage(caller, { 
            text: `*Hello @${caller.split('@')[0]}*\n\nAutomatic Call Reject is ON. Please leave a text message.\n\n_Powered by 𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳_`,
            mentions: [caller]
        });
    }
});

/**
 * GROUP WELCOME
 * Detects new members joining the group
 */
zokou({
    on: "group-join"
}, async (zk, update) => {
    const groupMetadata = await zk.groupMetadata(update.id);
    for (let participant of update.participants) {
        let welcomeMsg = `Welcome @${participant.split('@')[0]} to *${groupMetadata.subject}*!\n\nRead the rules and enjoy your stay.`;
        
        await zk.sendMessage(update.id, {
            text: welcomeMsg,
            mentions: [participant],
            contextInfo: {
                externalAdReply: {
                    title: "𝙽𝙴𝚆 𝙼𝙴𝙼𝙱𝙴𝚁 𝙰𝙻𝙴𝚁𝚃",
                    body: "Welcome to the group",
                    thumbnailUrl: "https://files.catbox.moe/zm113g.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029VaF39946H4YhS6u8Yt3q",
                    mediaType: 1
                }
            }
        });
    }
});
