const axios = require('axios');
const yts = require('yt-search');

async function playCommand(zok, m, args) {
    const query = args.join(" ");
    if (!query) return m.reply("What song are you looking for? Example: .play sigma boy");

    try {
        // 1. Search YouTube for top 5 results
        const search = await yts(query);
        const results = search.videos.slice(0, 5);

        if (results.length === 0) return m.reply("Sorry, I couldn't find anything.");

        // 2. Build the visual "Card" text
        let responseText = `*TIMNASA_TMD2 YOUTUBE DOWNLOAD* 📶\n`;
        responseText += `🔍 Search Results for: _${query}_\n`;
        responseText += `📂 Found ${results.length} results\n\n`;

        results.forEach((vid, i) => {
            responseText += `*${i + 1}.* ${vid.title.toUpperCase()}\n`;
            responseText += `🎧 *Views:* ${vid.views.toLocaleString()}\n`;
            responseText += `🎻 *Uploaded:* ${vid.ago || 'recently'}\n`;
            responseText += `⏳ *Duration:* ${vid.timestamp}\n`;
            responseText += `🔗 *Link:* ${vid.url}\n\n`;
        });

        responseText += `*Reply with the number (e.g., 1)* to download.\n`;
        responseText += `_All is for you enjoy 🎈_`;

        // 3. Send the image with the caption (This looks like your photo)
        await zok.sendMessage(m.chat, {
            image: { url: results[0].thumbnail },
            caption: responseText
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply("Error occurred while searching.");
    }
}

// Separate Downloader Logic
async function videoDownload(zok, m, args) {
    const url = args[0];
    if (!url) return m.reply("Please provide a link.");

    try {
        m.reply("⏳ Downloading your video, please wait...");
        
        const apiUri = `https://noobs-api.top/dipto/ytDl3?link=${encodeURIComponent(url)}&format=mp4`;
        const { data } = await axios.get(apiUri);

        if (data && data.download_url) {
            await zok.sendMessage(m.chat, {
                video: { url: data.download_url },
                caption: `🎬 *${data.title}*\n\nEnjoy!`,
                mimetype: 'video/mp4'
            }, { quoted: m });
        } else {
            m.reply("Failed to fetch video. The link might be broken.");
        }
    } catch (err) {
        m.reply("API Error: Unable to reach the server.");
    }
}
