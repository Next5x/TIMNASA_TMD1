const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "save",
  reaction: "📥",
  categorie: "User"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms, msgRepondu, superUser } = commandeOptions;

  try {
    // 1. Hakikisha mtumiaji ame-reply ujumbe (picha, video, nk)
    if (!msgRepondu) {
      return repondre("❌ Tafadhali reply (jibu) picha, video au audio unayotaka ku-save kwa kuandika .save");
    }

    // 2. Pata namba ya mmiliki wa bot
    const ownerId = zk.user.id.split(":")[0] + "@s.whatsapp.net";

    await zk.sendPresenceUpdate('composing', dest);

    // 3. Tuma ujumbe ulioreply-wa kwenda kwa mmiliki
    // Tunatumia 'forwardMessage' au 'copyNForward' ili kubaki na ubora uleule
    await zk.sendMessage(ownerId, { 
      forward: ms.message.extendedTextMessage.contextInfo.quotedMessage ? 
               { key: ms.message.extendedTextMessage.contextInfo.stanzaId, message: msgRepondu } : ms,
      contextInfo: {
        externalAdReply: {
          title: "STATUS / MEDIA SAVER",
          body: "Saved from: " + dest,
          sourceUrl: "https://github.com/timnasax",
          thumbnailUrl: "https://telegra.ph/file/0c3260c6d96200234a946.jpg",
          mediaType: 1
        }
      }
    });

    // 4. Mjulishe mtumiaji (kama siyo mmiliki) kuwa faili limetumwa inbox
    return repondre("✅ Media imetumwa kwenye inbox ya mmiliki wa bot.");

  } catch (e) {
    console.log(e);
    return repondre(`❌ Imeshindikana ku-save.\nError: ${e.message}`);
  }
});
