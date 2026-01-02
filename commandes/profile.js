"use strict";

const { zokou } = require("../framework/zokou");
const conf = require("../set");

zokou({
    nomCom: "profile",
    categorie: "General",
    reaction: "👤"
}, async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, auteurMessage, nomAuteurMessage, msgRepondu, auteurMsgRepondu } = commandeOptions;
    const channelJid = "120363413554978773@newsletter";

    try {
        // Determine the target user (either the sender or the person replied to)
        let jid = msgRepondu ? auteurMsgRepondu : auteurMessage;
        let name = msgRepondu ? "@" + jid.split("@")[0] : nomAuteurMessage;

        // Fetch Profile Picture
        let ppUrl;
        try {
            ppUrl = await zk.profilePictureUrl(jid, 'image');
        } catch {
            ppUrl = conf.IMAGE_MENU || "https://files.catbox.moe/zm113g.jpg"; // Fallback image
        }

        // Fetch Bio/Status
        let status;
        try {
            const statusObj = await zk.fetchStatus(jid);
            status = statusObj.status || "No Status Available";
        } catch {
            status = "Privacy Protected 🔒";
        }

        // Professional Profile Caption
        let profileInfo = `*👤 𝚄𝚂𝙴𝚁 𝙿𝚁𝙾𝙵𝙸𝙻𝙴*\n\n`;
        profileInfo += `*🏷️ Name:* ${name}\n`;
        profileInfo += `*🆔 JID:* ${jid.split('@')[0]}\n`;
        profileInfo += `*📜 Bio:* ${status}\n`;
        profileInfo += `*🔗 Link:* wa.me/${jid.split('@')[0]}\n\n`;
        profileInfo += `*𝙱𝚢 𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝚂𝚈𝚂𝚃𝙴𝙼*`;

        await zk.sendMessage(dest, {
            image: { url: ppUrl },
            caption: profileInfo,
            mentions: [jid],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    newsletterName: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰 𝚃𝙼𝙳 𝙸𝙽𝙵𝙾",
                    serverMessageId: 1
                },
                externalAdReply: {
                    title: `𝙿𝚁𝙾𝙵𝙸𝙻𝙴: ${name}`,
                    body: "User Identity Details",
                    thumbnailUrl: ppUrl,
                    sourceUrl: "https://whatsapp.com/channel/0029VaF39946H4YhS6u8Yt3q",
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: ms });

    } catch (error) {
        console.error("Profile Command Error:", error);
        repondre("🥵 I failed to retrieve the profile details. The user might have strict privacy settings.");
    }
});
