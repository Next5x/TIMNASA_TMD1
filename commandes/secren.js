const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou({
  nomCom: "ss",
  aliases: ["screenshot", "webshot"],
  reaction: "📸",
  categorie: "Tools"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    // 1. Hakikisha mtumiaji ameweka URL
    if (!arg[0]) {
      return repondre(`*WEB SCREENSHOT*\n\nTafadhali weka link ya tovuti.\n\nMfano: .ss https://google.com`);
    }

    let url = arg[0];
    
    // Ongeza https:// kama mtumiaji amesahau
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    await repondre("⏳ Ninatayarisha picha ya tovuti, tafadhali subiri...");
    await zk.sendPresenceUpdate('composing', dest);

    // 2. Tunatumia API inayopiga picha ya website
    // Unaweza kubadilisha 'full=true' kama unataka ukurasa mzima
    const ssUrl = `https://api.screenshotmachine.com/?key=785984&url=${encodeURIComponent(url)}&dimension=1024x768`;
    
    // 3. Tuma picha moja kwa moja
    await zk.sendMessage(dest, {
      image: { url: ssUrl },
      caption: `✅ *Screenshot ya Tovuti*\n\n🌐 *Link:* ${url}\n🔗 *GitHub:* https://github.com/timnasax`,
      contextInfo: {
        externalAdReply: {
          title: "TIMNASA WEB CAPTURE",
          body: "Website to Image Converter",
          sourceUrl: "https://github.com/timnasax",
          mediaType: 1
        }
      }
    }, { quoted: ms });

  } catch (e) {
    console.error(e);
    return repondre(`❌ Imeshindikana kupiga picha ya tovuti hiyo. Hakikisha link ni sahihi.`);
  }
});
