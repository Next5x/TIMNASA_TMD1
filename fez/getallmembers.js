const { timoth } = require("../timnasa/timoth");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { timoth } = require("../timnasa/timoth");
const moment = require("moment-timezone");
const { getBuffer } = require("../timnasa/dl/Function");
const { default: axios } = require('axios');

const runtime = function (seconds) { 
 seconds = Number(seconds); 
 var d = Math.floor(seconds / (3600 * 24)); 
 var h = Math.floor((seconds % (3600 * 24)) / 3600); 
 var m = Math.floor((seconds % 3600) / 60); 
 var s = Math.floor(seconds % 60); 
 var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " d, ") : ""; 
 var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " h, ") : ""; 
 var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " m, ") : ""; 
 var sDisplay = s > 0 ? s + (s == 1 ? " second" : " s") : ""; 
 return dDisplay + hDisplay + mDisplay + sDisplay; 

timoth({ nomCom: "sendallmembers", categorie: 'Group', reaction: "📣" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

  if (!verifGroupe) return repondre("✋🏿 This command is reserved for groups ❌");

  let mess = Array.isArray(arg) && arg.length ? arg.join(' ') : 'No message provided';
  let membresGroupe = verifGroupe && infosGroupe ? infosGroupe.participants || [] : [];

  let tag = `========================\n  
        🌟 *TIMNASA-TMD GROUP MEMBERS GIDS* 🌟
========================\n
> regards TimnasaTech®\n\n`;

  const emoji = ['🦴', '👀', '😮‍💨', '❌', '✔️', '😇', '⚙️', '🔧', '🎊', '😡', '🙏🏿', '⛔️', '$', '😟', '🥵', '🐅'];
  const randomEmoji = emoji[Math.floor(Math.random() * emoji.length)];

  let mentions = [];
  membresGroupe.forEach((membre, index) => {
    let userJid = `${membre.id}`; // Ensure the full JID format
    tag += `${index + 1}. ${randomEmoji} ${userJid}\n`;
    mentions.push(userJid);
  });

  if (verifAdmin || superUser) {
    console.log("Sending message to:", dest);
    console.log("Message:", tag);
    console.log("Mentions:", mentions);

    zk.sendMessage(dest, { text: tag, mentions }, { quoted: ms })
      .then(() => console.log("Message sent successfully"))
      .catch(err => console.error("Error sending message:", err));
  } else {
    repondre("❌ Command reserved for admins.");
  }
});

// ========================= TAG ADMINS COMMAND ========================= //

timoth({ nomCom: "tagadmin", categorie: 'Group', reaction: "📣" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

  if (!verifGroupe) return repondre("✋🏿 This command is reserved for groups ❌");

  let mess = Array.isArray(arg) && arg.length ? arg.join(' ') : 'No message provided';
  let membresGroupe = verifGroupe && infosGroupe ? infosGroupe.participants || [] : [];
  let adminsGroupe = membresGroupe.filter(membre => membre.isAdmin);

  let tag = `========================\n  
        🌟 *TIMNASA-TMD* 🌟
========================\n
👥 Group : ${nomGroupe} 🚀 
👤 Author : *${nomAuteurMessage}* 👋 
📜 Message : *${mess}* 📝
========================\n\n`;

  const emoji = ['🦴', '👀', '😮‍💨', '❌', '✔️', '😇', '⚙️', '🔧', '🎊', '😡', '🙏🏿', '⛔️', '$', '😟', '🥵', '🐅'];
  const randomEmoji = emoji[Math.floor(Math.random() * emoji.length)];

  let mentions = [];
  adminsGroupe.forEach((admin, index) => {
    let userJid = `${admin.id}@s.whatsapp.net`; // Ensure the full JID format
    tag += `${index + 1}. ${randomEmoji} @${userJid}\n`;
    mentions.push(userJid);
  });

  if (verifAdmin || superUser) {
    console.log("Sending message to:", dest);
    console.log("Message:", tag);
    console.log("Mentions:", mentions);

    zk.sendMessage(dest, { text: tag, mentions }, { quoted: ms })
      .then(() => console.log("Message sent successfully"))
      .catch(err => console.error("Error sending message:", err));
  } else {
    repondre("❌ Command reserved for admins.");
  }
});
