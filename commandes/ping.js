const { zokou } = require("../framework/zokou");
const os = require("os");

/**
 * Formats uptime seconds into a human-readable string
 */
function runtime(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

zokou({
  nomCom: "ping",
  desc: "Check bot speed and play music with channel view.",
  categorie: "General",
  reaction: "⚡"
}, async (dest, zk, reponse) => {
  const { ms } = reponse;
  const start = new Date().getTime();
  
  // --- CONFIGURATION ---
  const channelJid = "120363413554978773@newsletter"; 
  const audioUrl = "https://files.catbox.moe/e4c48n.mp3"; 
  const imageUrl = "https://files.catbox.moe/zm113g.jpg"; 
  // ---------------------

  try {
    const end = new Date().getTime();
    const ping = end - start;
    const uptime = runtime(process.uptime());
    
    // Memory Calculation (GB)
    const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freeRam = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    const usedRam = (totalRam - freeRam).toFixed(2);

    const statusMsg = `*🚀 TIMNASA PING 🚀*

╭─────────────━┈⊷• 
│⚡ *Latency:* ${ping} ms
│⏱️ *Uptime:* ${uptime}
│📊 *RAM:* ${usedRam}GB / ${totalRam}GB
╰─────────────━┈⊷• 

🎵 *Music is playing below...*
📢 *Click "View Channel" to join us for more!*

> TIMNASA-MD`;

    // 1. Send Image with Status & View Channel Button (Context)
    await zk.sendMessage(dest, {
      image: { url: imageUrl },
      caption: statusMsg,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelJid,
          newsletterName: "Timnasa Music", // You can change this name
          serverMessageId: 143
        }
      }
    }, { quoted: ms });

    // 2. Send Audio File
    await zk.sendMessage(dest, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      ptt: false 
    }, { quoted: ms });

  } catch (error) {
    console.error("Speed Command Error:", error);
    await zk.sendMessage(dest, { text: "An error occurred while executing the command." }, { quoted: ms });
  }
});
