const { zokou } = require("../framework/zokou");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

/**
 * VV Command - Sends recovered media to the current chat with Channel JID info.
 */
zokou({ nomCom: "vv", aliases: ["send", "keep"], categorie: "General" }, async (dest, zk, commandeOptions) => {
  const { repondre, msgRepondu, ms } = commandeOptions;

  if (!msgRepondu) {
    return repondre('Please reply to a View Once (VV) message or any media to save it.');
  }

  const channelJid = "120363413554978773@newsletter";

  try {
    let msg = {};
    const contextInfo = {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: channelJid,
        newsletterName: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰 𝚃𝙼𝙳 𝙿𝚁𝙾𝚃𝙴𝙲𝚃𝙸𝙾𝙽",
        serverMessageId: 1
      }
    };

    if (msgRepondu.imageMessage) {
      const media = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
      msg = { image: { url: media }, caption: msgRepondu.imageMessage.caption, contextInfo };
    } else if (msgRepondu.videoMessage) {
      const media = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);
      msg = { video: { url: media }, caption: msgRepondu.videoMessage.caption, contextInfo };
    } else if (msgRepondu.audioMessage) {
      const media = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage);
      msg = { audio: { url: media }, mimetype: 'audio/mp4', contextInfo };
    } else if (msgRepondu.stickerMessage) {
      const media = await zk.downloadAndSaveMediaMessage(msgRepondu.stickerMessage);
      const stickerMess = new Sticker(media, {
        pack: '𝚃𝙸𝙼𝙽𝙰𝚂𝙰 𝚃𝙼𝙳',
        author: 'Timoth',
        type: StickerTypes.FULL,
        quality: 70,
      });
      msg = { sticker: await stickerMess.toBuffer() };
    } else {
      msg = { text: msgRepondu.conversation || "No text content found.", contextInfo };
    }

    await zk.sendMessage(dest, msg, { quoted: ms });

  } catch (error) {
    console.error("Error in VV command:", error);
    repondre('An error occurred while processing the media.');
  }
});

/**
 * VV2 Command - Sends recovered media privately to your DM.
 */
zokou({ nomCom: "vv2", categorie: "General" }, async (dest, zk, commandeOptions) => {
  const { repondre, msgRepondu, ms } = commandeOptions;

  if (!msgRepondu) {
    return repondre('Reply to the message you want to receive in your DM.');
  }

  // Define Owner DM (Your number)
  const myDm = zk.user.id.split(':')[0] + '@s.whatsapp.net';

  try {
    let msg = {};
    const infoText = `*🔓 TIMNASA VV-RECOVERY (DM)*\n\n_Media recovered privately._`;

    if (msgRepondu.imageMessage) {
      const media = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
      msg = { image: { url: media }, caption: msgRepondu.imageMessage.caption || infoText };
    } else if (msgRepondu.videoMessage) {
      const media = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);
      msg = { video: { url: media }, caption: msgRepondu.videoMessage.caption || infoText };
    } else if (msgRepondu.audioMessage) {
      const media = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage);
      msg = { audio: { url: media }, mimetype: 'audio/mp4' };
    } else if (msgRepondu.stickerMessage) {
      const media = await zk.downloadAndSaveMediaMessage(msgRepondu.stickerMessage);
      const stickerMess = new Sticker(media, {
        pack: '𝚃𝙸𝙼𝙽𝙰𝚂𝙰 𝚃𝙼𝙳',
        author: 'Timoth',
        type: StickerTypes.FULL
      });
      msg = { sticker: await stickerMess.toBuffer() };
    } else {
      msg = { text: msgRepondu.conversation || "No text content found." };
    }

    // Send the recovered message to your Private DM
    await zk.sendMessage(myDm, msg);
    
    // Notify in the current chat that it was sent
    await zk.sendMessage(dest, { text: "✅ Media has been sent to your DM." }, { quoted: ms });

  } catch (error) {
    console.error("Error in VV2 command:", error);
    repondre('Error: Failed to send the media to your DM.');
  }
});
