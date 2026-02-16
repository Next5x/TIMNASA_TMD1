const { zokou } = require("../framework/zokou");
const yts = require('yt-search');
const axios = require('axios');
const conf = require("../set");

// 1. COMMAND YA KUTAFUTA (SEARCH)
zokou({
    nomCom: "play3",
    categorie: "Download",
    reaction: "🎵"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage } = commandeOptions;

    if (!arg[0]) return repondre("❌ Tafadhali weka jina la wimbo!\nMfano: .play baby diamond");

    try {
        const search = await yts(arg.join(" "));
        const video = search.videos[0]; // Tunachukua matokeo ya kwanza

        if (!video) return repondre("🚫 Sijapata kitu.");

        let ui = `╔══════════════════╗\n`;
        ui += `     *TIMNASA TMD2 PLAYER* 📶\n`;
        ui += `╚══════════════════╝\n\n`;
        ui += `📝 *Title:* ${video.title}\n`;
        ui += `⏳ *Time:* ${video.timestamp}\n`;
        ui += `👁️ *Views:* ${video.views.toLocaleString()}\n`;
        ui += `👤 *User:* ${nomAuteurMessage}\n\n`;
        ui += `*Reply na:* \n1️⃣ *.song* (Audio)\n2️⃣ *.video* (Video)\n`;
        ui += `───────────────────\n`;
        ui += `🔗 *Link:* ${video.url}`;

        await zk.sendMessage(dest, {
            image: { url: video.thumbnail },
            caption: ui,
            contextInfo: {
                externalAdReply: {
                    title: "TIMNASA MULTIMEDIA",
                    body: "Select your format below",
                    thumbnail: { url: video.thumbnail },
                    sourceUrl: video.url,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: ms });

    } catch (e) {
        repondre("⚠️ Error: " + e.message);
    }
});

// 2. COMMAND YA AUDIO (SONG)
zokou({
    nomCom: "song",
    categorie: "Download",
    reaction: "🎶"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;
    if (!arg[0]) return repondre("Weka link ya YouTube!");

    try {
        const link = arg[0];
        const res = await axios.get(`https://noobs-api.top/dipto/ytDl3?link=${encodeURIComponent(link)}&format=mp3`);
        
        if (res.data && res.data.download_url) {
            await zk.sendMessage(dest, { 
                audio: { url: res.data.download_url }, 
                mimetype: 'audio/mp4', 
                ptt: false 
            }, { quoted: ms });
        } else {
            repondre("❌ Imeshindikana kupata audio.");
        }
    } catch (e) {
        repondre("⚠️ Seva imekataa (Audio Error).");
    }
});

// 3. COMMAND YA VIDEO
zokou({
    nomCom: "video",
    categorie: "Download",
    reaction: "🎥"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;
    if (!arg[0]) return repondre("Weka link ya YouTube!");

    try {
        repondre("⏳ Inapakua video, tafadhali subiri...");
        const link = arg[0];
        const res = await axios.get(`https://noobs-api.top/dipto/ytDl3?link=${encodeURIComponent(link)}&format=mp4`);

        if (res.data && res.data.download_url) {
            await zk.sendMessage(dest, { 
                video: { url: res.data.download_url }, 
                caption: `🎬 *${res.data.title}*\n\nPowered by Timnasa_TMD2`,
                mimetype: 'video/mp4' 
            }, { quoted: ms });
        } else {
            repondre("❌ Imeshindikana kupata video.");
        }
    } catch (e) {
        repondre("⚠️ Seva imekataa (Video Error).");
    }
});
