"use strict";

const { zokou } = require("../framework/zokou");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

zokou({
    nomCom: "urlx",
    categorie: "General",
    reaction: "🔗"
}, async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, msgRepondu, msgAudio, prefixe } = commandeOptions;
    const channelJid = "120363413554978773@newsletter";

    try {
        /** * OPTION 1: CONVERT AUDIO TO URL (Upload to Catbox.moe)
         * Usage: Reply to any audio/voice note with .urlx
         **/
        if (msgRepondu && msgAudio) {
            repondre("⌛ *Processing and uploading to Catbox...*");
            
            // Download the media from WhatsApp
            const mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu);
            
            // Prepare form data for Catbox API
            const bodyForm = new FormData();
            bodyForm.append("reqtype", "fileupload");
            bodyForm.append("fileToUpload", fs.createReadStream(mediaPath));

            const { data } = await axios.post("https://catbox.moe/user/api.php", bodyForm, {
                headers: { ...bodyForm.getHeaders() },
            });

            // Delete temporary file to save space
            if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);

            return await zk.sendMessage(dest, { 
                text: `✅ *Audio Uploaded Successfully!*\n\n🔗 *URL:* ${data}\n\n_You can now use this link to play audio anywhere._` 
            }, { quoted: ms });
        }

        /** * OPTION 2: CONVERT URL TO AUDIO (Play as audio/mpeg)
         * Usage: .urlx https://files.catbox.moe/example.mp3
         **/
        if (arg[0] && arg[0].startsWith("http")) {
            const audioUrl = arg[0];

            return await zk.sendMessage(dest, {
                audio: { url: audioUrl },
                mimetype: 'audio/mpeg',
                ptt: true, // Forces it to appear as a Voice Note
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: channelJid,
                        newsletterName: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝚄𝚁𝙻𝚇",
                        serverMessageId: 1
                    },
                    externalAdReply: {
                        title: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝚄𝚁𝙻𝚇 𝙿𝙻𝙰𝚈𝙴𝚁",
                        body: "Streaming high-quality audio",
                        thumbnailUrl: "https://files.catbox.moe/zm113g.jpg",
                        sourceUrl: "https://wa.me/255743706043",
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: ms });
        }

        // IF NO AUDIO REPLIED AND NO URL PROVIDED
        repondre(`*『 𝚄𝚁𝙻𝚇 𝚂𝚈𝚂𝚃𝙴𝙼 𝙸𝙽𝚂𝚃𝚁𝚄𝙲𝚃𝙸𝙾𝙽𝚂 』*\n\n` +
                 `1. *To Create a URL:* Reply to an audio message with *${prefixe}urlx*\n` +
                 `2. *To Play a URL:* Type *${prefixe}urlx [paste-link-here]*\n\n` +
                 `_Note: Works with Catbox.moe and all direct audio/mpeg links._`);

    } catch (error) {
        console.error("URLX System Error:", error);
        repondre("❌ *Error:* Failed to process the request. Ensure the file/link is valid.");
    }
});
