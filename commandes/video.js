const { zokou } = require("../framework/zokou");
const yts = require('yt-search');
const axios = require('axios');
const conf = require("../set");

zokou({
    nomCom: "song",
    categorie: "Download",
    reaction: "🎬"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage } = commandeOptions;

    if (!arg || arg.length === 0) {
        return repondre("❌ Tafadhali weka jina la wimbo au video!\n\nMfano: .play sigma boy");
    }

    const searchKeyword = arg.join(" ");

    try {
        // 1. YouTube Search
        const search = await yts(searchKeyword);
        const results = search.videos.slice(0, 5);

        if (results.length === 0) {
            return repondre("🚫 Sijapata matokeo yoyote kwa: " + searchKeyword);
        }

        // 2. Kutengeneza Muonekano wa Kisasa (Modern UI Card)
        let responseText = `╔══════════════════╗\n`;
        responseText += `     *TIMNASA TMD2 PLAYER* 📶\n`;
        responseText += `╚══════════════════╝\n\n`;
        
        responseText += `👤 *User:* ${nomAuteurMessage}\n`;
        responseText += `🔍 *Search:* _${searchKeyword}_\n`;
        responseText += `───────────────────\n\n`;

        results.forEach((vid, i) => {
            responseText += `*${i + 1}️⃣  ${vid.title.toUpperCase()}*\n`;
            responseText += `  ┕ ⏳ *Muda:* ${vid.timestamp}\n`;
            responseText += `  ┕ 👁️ *Views:* ${vid.views.toLocaleString()}\n`;
            responseText += `  ┕ 📅 *Uploaded:* ${vid.ago}\n`;
            responseText += `  ┕ 🔗 *Link:* ${vid.url}\n\n`;
        });

        responseText += `───────────────────\n`;
        responseText += `📌 *QUICK TIP:* Tumia command ya *.video [link]* ili kupata video unayotaka hapo juu.\n\n`;
        responseText += `_All is for you to enjoy_ 🎈`;

        // 3. Kutuma Ujumbe wenye Picha (Ad-Reply Style)
        await zk.sendMessage(dest, {
            image: { url: results[0].thumbnail },
            caption: responseText,
            contextInfo: {
                externalAdReply: {
                    title: "YOUTUBE MULTIMEDIA SEARCH",
                    body: "Timnasa_TMD2 High Speed System",
                    thumbnail: { url: results[0].thumbnail },
                    sourceUrl: conf.GURL || "https://youtube.com", // Inatumia link ya bot yako kutoka config
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: ms });

    } catch (error) {
        console.error(error);
        repondre("⚠️ Hitilafu: Nimeshindwa kuunganishwa na YouTube.");
    }
});

// --- Command ya Video Downloader (Inayopokea link) ---

zokou({
    nomCom: "video",
    categorie: "Download",
    reaction: "📥"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg } = commandeOptions;

    if (!arg[0]) return repondre("Weka link ya video unayotaka!");

    try {
        repondre("⏳ Inapakua video yako, tafadhali subiri...");

        const videoUrl = arg[0];
        const apiUri = `https://noobs-api.top/dipto/ytDl3?link=${encodeURIComponent(videoUrl)}&format=mp4`;
        const { data } = await axios.get(apiUri);

        if (data && data.download_url) {
            await zk.sendMessage(dest, {
                video: { url: data.download_url },
                caption: `🎬 *${data.title}*\n\nEnjoy your video!`,
                mimetype: 'video/mp4'
            }, { quoted: ms });
        } else {
            repondre("❌ Nimeshindwa kupata video. Huenda link haina uwezo wa kudownload.");
        }
    } catch (err) {
        repondre("⚠️ API Error: Seva imekataa muunganisho.");
    }
});
