const { zokou } = require("../framework/zokou");

// --- NEWSLETTER AND MUSIC DELIVERY SYSTEM (TIMNASA TMD) ---
const sendTimnasaExtras = async (zk, dest, ms) => {
  try {
    await zk.sendMessage(dest, {
      newsletterJid: "120363413554978773@newsletter",
      newsletterName: "ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ CHANNEL",
      serverMessageId: 1
    }, { quoted: ms });

    await zk.sendMessage(dest, {
      audio: { url: "https://files.catbox.moe/lqx6sp.mp3" },
      mimetype: 'audio/mp3',
      ptt: false 
    }, { quoted: ms });
  } catch (e) { console.log("Extras Error: " + e); }
};

// --- ADD MEMBERS COMMAND ---
zokou({ nomCom: "add2", categorie: 'Group', reaction: "➕" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, verifGroupe, verifAdmin, superUser, idBot } = commandeOptions;

  // 1. Ensure the command is used in a group
  if (!verifGroupe) return repondre("✋🏿 This command can only be used in groups.");

  // 2. Ensure the user is an admin or the owner
  if (!verifAdmin && !superUser) return repondre("❌ This command is for Admins only.");

  // 3. Check if the Bot is an admin to enable adding members
  const metadata = await zk.groupMetadata(dest);
  const participants = metadata.participants;
  const botIsAdmin = participants.find(p => p.id === idBot && (p.admin === 'admin' || p.admin === 'superadmin'));

  if (!botIsAdmin) return repondre("❌ I cannot add members because I am not an Admin in this group.");

  // 4. Check if phone numbers were provided
  if (!arg[0]) return repondre("Please provide the phone number of the person you want to add.\nExample: .add 255784XXXXX91");

  // Separate numbers if multiple are provided (separated by commas)
  let users = arg.join(' ').replace(/[^0-9,]/g, '').split(',').map(v => v.trim() + '@s.whatsapp.net');

  try {
    await zk.groupParticipantsUpdate(dest, users, "add");
    repondre(`✅ ${users.length} member(s) have been successfully added by ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ.`);
    
    // Send Newsletter and Music
    await sendTimnasaExtras(zk, dest, ms);
  } catch (e) {
    repondre("❌ Failed to add members. The number(s) might be incorrect, or the users have 'Privacy' settings enabled on their WhatsApp.");
    console.log(e);
  }
});
