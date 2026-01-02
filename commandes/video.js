"use strict";
const { zokou } = require(__dirname + "/../framework/zokou");
const yts = require("yt-search");
const fetch = require("node-fetch");

zokou({
    nomCom: "video",
    categorie: "Download",
    reaction: "🎥"
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurCom } = commandeOptions;
    const text = arg.join(" ");

    if (!text) {
        return repondre("Are you mute? Give me a video name. It's not rocket science.");
    }

    try {
        // Reaction ya kusubiri
        await zk.sendMessage(dest, { react: { text: '⏳', key: ms.key } });

        const searchResult = await yts(text);
        const video = searchResult.videos[0];

        if (!video) {
            return repondre(`Nothing found for "${text}".`);
        }

        // Kupata download link kutoka kwa API
        const response = await fetch(`https://api.ootaizumi.web.id/downloader/youtube?url=${encodeURIComponent(video.url)}&format=720`);
        const data = await response.json();

        if (!data.status || !data.result || !data.result.download) {
            throw new Error('API failed to provide download link.');
        }

        const videoUrl = data.result.download;
        const title = data.result.title || video.title;

        // Reaction ya kufanikiwa
        await zk.sendMessage(dest, { react: { text: '✅', key: ms.key } });

        // Tuma Video ikiwa na Context ya Newsletter JID
        await zk.sendMessage(dest, {
            video: { url: videoUrl },
            mimetype: "video/mp4",
            caption: `*𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 𝐕𝚰𝐃𝚵𝐎 𝐃𝐎𝐖𝚴𝐋𝐎𝚫𝐃*\n\n🎬 *Title:* ${title}\n🔗 *Url:* ${video.url}\n\n> Powered by 𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: title,
                    body: "𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 𝐃𝐎𝐖𝚴𝐋𝐎𝚫𝐃𝚵𝐑",
                    thumbnailUrl: video.thumbnail,
                    sourceUrl: "https://whatsapp.com/channel/0029Vat3f9S8qIzp9wS0S03u",
                    mediaType: 2,
                    renderLargerThumbnail: true,
                },
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363413554978773@newsletter",
                    newsletterName: "𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 Updates",
                    serverMessageId: 143
                }
            }
        }, { quoted: ms });

    } catch (error) {
        console.error(error);
        await zk.sendMessage(dest, { react: { text: '❌', key: ms.key } });
        repondre("Download failed. The server might be busy. Error: " + error.message);
    }
});
