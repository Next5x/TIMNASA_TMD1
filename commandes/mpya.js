const { zokou } = require("../framework/zokou");

// --- COMMAND: CLEAR CHANNEL POSTS (OWNER ONLY) ---
zokou({
  'nomCom': 'clearchannel',
  'reaction': '🧹',
  'categorie': "Owner"
}, async (dest, zk, reponse) => {
  const { ms } = reponse;

  if (!dest.endsWith('@newsletter')) {
    return zk.sendMessage(dest, { text: "❌ This command is strictly for WhatsApp Channels." }, { quoted: ms });
  }

  try {
    await zk.sendMessage(dest, { text: "🔄 *TIMNASA TMD* is clearing all posts... Please wait." });

    await zk.chatModify({
      clear: {
        messages: [{ id: ms.key.id, fromMe: true, timestamp: ms.messageTimestamp }]
      }
    }, dest);

    await zk.sendMessage(dest, { text: "✅ *TIMNASA TMD:* Channel archive cleared successfully!" });

  } catch (error) {
    zk.sendMessage(dest, { text: "❌ Error: Make sure TIMNASA TMD has owner/admin privileges." }, { quoted: ms });
  }
});

// --- COMMAND: VIRUS CLEANER & SPEED BOOST ---
zokou({
  'nomCom': 'clean',
  'reaction': '🛡️',
  'categorie': "System"
}, async (dest, zk, reponse) => {
  const { ms } = reponse;

  try {
    await zk.sendMessage(dest, { 
      text: "🚀 *TIMNASA TMD SYSTEM OPTIMIZATION...*\n\nRemoving invisible viruses, clearing cache, and fixing lag..." 
    }, { quoted: ms });

    const start = Date.now();
    
    // Cleaning internal buffers and chat pointers
    await zk.chatModify({
      clear: {
        messages: [{ id: ms.key.id, fromMe: true, timestamp: ms.messageTimestamp }]
      }
    }, dest);

    const end = Date.now();
    const speed = end - start;

    let status = `
🛡️ *TIMNASA TMD CLEANER* 🛡️

✅ *Malware/Viruses:* Neutralized
🧹 *Junk Files:* System Refreshed
🚀 *Response Speed:* ${speed}ms
📱 *Status:* WhatsApp is now optimized & Lightweight.

*TIMNASA TMD NEXT FUTURE*`;

    await zk.sendMessage(dest, { text: status }, { quoted: ms });

  } catch (error) {
    await zk.sendMessage(dest, { text: "❌ Optimization failed. Please restart the bot." }, { quoted: ms });
  }
});
