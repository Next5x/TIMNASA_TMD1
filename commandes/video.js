"use strict";
const { zokou } = require(__dirname + "/../framework/zokou");
const yts = require("yt-search");
const fetch = require("node-fetch");

// 1. COMMAND YA PLAY (AUDIO)
zokou({
    nomCom: "music",
    categorie: "download",
    reaction: "🎶"
},
async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;
    const text = arg.join(" ");

    if (!text) return repondre("Please provide a song name or YouTube link.");

    try {
        await zk.sendMessage(dest, { react: { text: '⏳', key: ms.key } });

        const searchResult = await yts(text);
        const video = searchResult.videos[0];
        if (!video) return repondre(`I couldn't find anything for "${text}".`);

        const response = await fetch(`https://api.ootaizumi.web.id/downloader/youtube?url=${encodeURIComponent(video.url)}&format=mp3`);
        const data = await response.json();

        if (!data.status || !data.result || !data.result.download) {
            throw new Error('Failed to fetch audio link.');
        }

        await zk.sendMessage(dest, {
            audio: { url: data.result.download },
            mimetype: "audio/mp4",
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: data.result.title || video.title,
                    body: "𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 𝐀𝐔𝐃𝐈𝐎 𝐏𝐋𝐀𝐘𝐄𝐑",
                    thumbnailUrl: video.thumbnail,
                    sourceUrl: video.url,
                    mediaType: 2,
                    renderLargerThumbnail: true,
                },
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363413554978773@newsletter",
                    newsletterName: "𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 Updates"
                }
            }
        }, { quoted: ms });

        await zk.sendMessage(dest, { react: { text: '✅', key: ms.key } });
    } catch (e) {
        repondre("Error: " + e.message);
    }
});

// 2. COMMAND YA VIDEO
zokou({
    nomCom: "video",
    categorie: "download",
    reaction: "🎥"
},
async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;
    const text = arg.join(" ");

    if (!text) return repondre("Give me a video name or link.");

    try {
        await zk.sendMessage(dest, { react: { text: '⌛', key: ms.key } });

        const searchResult = await yts(text);
        const video = searchResult.videos[0];
        if (!video) return repondre("Video not found.");

        const response = await fetch(`https://api.ootaizumi.web.id/downloader/youtube?url=${encodeURIComponent(video.url)}&format=720`);
        const data = await response.json();

        if (!data.status || !data.result || !data.result.download) {
            throw new Error('Failed to fetch video link.');
        }

        await zk.sendMessage(dest, {
            video: { url: data.result.download },
            mimetype: "video/mp4",
            caption: `*𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 𝐕𝚰𝐃𝚵𝐎*\n\n🎬 *Title:* ${data.result.title}\n🔗 *Url:* ${video.url}\n\n> Powered by 𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: data.result.title,
                    body: "𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 𝐃𝐎𝐖𝚴𝐋𝐎𝚫𝐃𝚵𝐑",
                    thumbnailUrl: video.thumbnail,
                    sourceUrl: video.url,
                    mediaType: 2,
                    renderLargerThumbnail: true,
                },
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363413554978773@newsletter",
                    newsletterName: "𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 Updates"
                }
            }
        }, { quoted: ms });

        await zk.sendMessage(dest, { react: { text: '✅', key: ms.key } });
    } catch (e) {
        repondre("Error: " + e.message);
    }
});
