"use strict";

const { zokou } = require("../framework/zokou");

zokou({
    nomCom: "urlx",
    categorie: "General",
    reaction: "🎵"
}, async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;
    const channelJid = "120363413554978773@newsletter";

    // 1. Check if a URL was provided
    if (!arg[0]) {
        return repondre("❌ Please provide a direct audio URL.\nExample: .urlx https://example.com/audio.mp3");
    }

    const audioUrl = arg[0];

    try {
        // 2. Send the Audio from URL as a Voice Note (PTT)
        await zk.sendMessage(dest, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            ptt: true, // Sends as a blue-mic Voice Note
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    newsletterName: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝙰𝚄𝙳𝙸𝙾 𝚇",
                    serverMessageId: 1
                },
                externalAdReply: {
                    title: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝚄𝚁𝙻𝚇 𝙿𝙻𝙰𝚈𝙴𝚁",
                    body: "Streaming Audio from URL",
                    thumbnailUrl: "https://files.catbox.moe/zm113g.jpg",
                    sourceUrl: "https://wa.me/255743706043",
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: ms });

    } catch (error) {
        console.error("URLX Error:", error);
        // 3. Error handling to keep the bot running
        repondre("❌ Failed to play audio. Make sure the link is a direct 'audio/mpeg' URL and try again.");
    }
});
