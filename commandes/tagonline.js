"use strict";

const { zokou } = require("../framework/zokou");

/**
 * TAGONLINE COMMAND
 * Purpose: Scans and tags only active group members.
 * Provides: Count of Online vs Offline users.
 */

zokou({
  nomCom: "tagonline",
  aliases: ["online", "here", "active"],
  categorie: "Group",
  reaction: "🟢"
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, verifGroupe, participants } = commandeOptions;

  // 1. Ensure command is used in a group
  if (!verifGroupe) {
    return repondre("❌ This command can only be used within a group.");
  }

  try {
    const channelJid = "120363413554978773@newsletter";
    const audioUrl = "https://files.catbox.moe/lqx6sp.mp3";
    const ownerNumber = "255784766591";

    /** * NOTE: WhatsApp only sends "presence" updates for users the bot is 
     * currently interacting with or who have recently sent messages.
     **/
    let onlineList = [];
    participants.forEach(p => {
        if (p.presences || p.subscribe) {
            onlineList.push(p.id);
        }
    });

    const totalMembers = participants.length;
    const onlineCount = onlineList.length;
    const offlineCount = totalMembers - onlineCount;

    let msg = `*『 𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝙾𝙽𝙻𝙸𝙽𝙴 𝚂𝙲𝙰𝙽𝙽𝙴𝚁 』*\n\n`;
    
    if (onlineCount > 0) {
        msg += `📢 *Attention to all active members:* \n\n`;
        for (let mem of onlineList) {
            msg += `🔹 @${mem.split('@')[0]}\n`;
        }
    } else {
        msg += `ℹ️ _No members currently detected as active._\n`;
    }

    msg += `\n📊 *GROUP STATISTICS:*`;
    msg += `\n✅ *Online:* ${onlineCount}`;
    msg += `\n❌ *Offline:* ${offlineCount}`;
    msg += `\n👥 *Total:* ${totalMembers}`;
    msg += `\n\n_Powered by 𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳_`;

    // 2. Send the Tagging Message
    await zk.sendMessage(dest, {
        text: msg,
        mentions: onlineList.length > 0 ? onlineList : []
    }, { quoted: ms });

    // 3. Send System Audio with Branding
    await zk.sendMessage(dest, {
        audio: { url: audioUrl },
        mimetype: 'audio/mp4',
        ptt: true,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: channelJid,
                newsletterName: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝚂𝚈𝚂𝚃𝙴𝙼",
                serverMessageId: 1
            },
            externalAdReply: {
                title: "𝙰𝙲𝚃𝙸𝚅𝙴 𝙼𝙴𝙼𝙱𝙴𝚁𝚂 𝚁𝙴𝙿𝙾𝚁𝚃",
                body: `Status: Found ${onlineCount} online`,
                thumbnailUrl: "https://files.catbox.moe/zm113g.jpg",
                sourceUrl: `https://wa.me/${ownerNumber}`,
                mediaType: 1
            }
        }
    });

  } catch (e) {
    console.error("TagOnline Error:", e);
    repondre("❌ An error occurred while scanning for active members.");
  }
});
