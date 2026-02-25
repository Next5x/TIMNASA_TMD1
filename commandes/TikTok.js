const { zokou } = require("../framework/zokou");
const axios = require("axios");

// --- 1. TIKTOK VIDEO DOWNLOADER ---
zokou({
  nomCom: "tiktok",
  reaction: "🎥",
  categorie: "Download"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    if (!arg[0]) return repondre(`❌ Tafadhali weka link ya TikTok!\n\nMfano: .tiktok https://vt.tiktok.com/xxxx/`);

    await zk.sendPresenceUpdate('composing', dest);
    const res = await axios.get(`https://www.tikwm.com/api/?url=${arg[0]}`);
    const data = res.data.data;

    if (!data || !data.play) return repondre("❌ Imeshindikana kupata video hiyo.");

    await zk.sendMessage(dest, {
      video: { url: data.play },
      caption: `✅ *TikTok Video Imepakuliwa*\n\n👤 *User:* ${data.author.nickname}\n📝 *Caption:* ${data.title}\n\n🔗 *GitHub:* https://github.com/timnasax`,
    }, { quoted: ms });

  } catch (e) {
    repondre(`❌ Error: ${e.message}`);
  }
});

// --- 2. TIKTOK SLIDE DOWNLOADER ---
zokou({
  nomCom: "tiktokslide",
  reaction: "🖼️",
  categorie: "Download"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    if (!arg[0]) return repondre(`❌ Weka link ya TikTok slide!`);

    const res = await axios.get(`https://www.tikwm.com/api/?url=${arg[0]}`);
    const data = res.data.data;

    if (!data || !data.images || data.images.length === 0) {
      return repondre("❌ Slide hazikupatikana kwenye link hii (Huenda ni video ya kawaida).");
    }

    // Tuma picha zote (max 10 kuzuia spam)
    for (let img of data.images.slice(0, 10)) {
      await zk.sendMessage(dest, { 
        image: { url: img }, 
        caption: `Slide kutoka kwa ${data.author.nickname}\n\nGitHub: https://github.com/timnasax` 
      }, { quoted: ms });
    }

  } catch (e) {
    repondre(`❌ Error: ${e.message}`);
  }
});

// --- 3. TIKTOK AUDIO DOWNLOADER ---
zokou({
  nomCom: "tiktokaudio",
  reaction: "🎵",
  categorie: "Download"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    if (!arg[0]) return repondre(`❌ Weka link ya TikTok kupata audio!`);

    const res = await axios.get(`https://www.tikwm.com/api/?url=${arg[0]}`);
    const data = res.data.data;

    if (!data || !data.music) return repondre("❌ Muziki haujapatikana.");

    await zk.sendMessage(dest, {
      audio: { url: data.music },
      mimetype: 'audio/mp4',
      ptt: false,
      contextInfo: {
        externalAdReply: {
          title: data.music_info.title,
          body: `Artist: ${data.music_info.author}`,
          sourceUrl: "https://github.com/timnasax",
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: ms });

  } catch (e) {
    repondre(`❌ Error: ${e.message}`);
  }
});
