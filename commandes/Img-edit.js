"use strict";

const { zokou } = require("../framework/zokou");
const canvacord = require("canvacord");

/**
 * Generic function to create Image-Edit commands
 * This version downloads the image directly for faster processing.
 */
function createCanvacordCommand(commandName, canvacordFunction) {
  zokou({
    nomCom: commandName,
    categorie: "Image-Edit",
    reaction: "🎨"
  }, async (dest, zk, commandeOptions) => {
    const { ms, msgRepondu, auteurMsgRepondu, repondre } = commandeOptions;
    const channelJid = "120363413554978773@newsletter";

    try {
      let imageBuffer;

      if (msgRepondu && msgRepondu.imageMessage) {
        // Download the mentioned image
        imageBuffer = await zk.downloadMediaMessage(msgRepondu);
      } else if (msgRepondu) {
        // If it's a mention but no image, try to get the user's Profile Picture
        try {
          const ppUrl = await zk.profilePictureUrl(auteurMsgRepondu, 'image');
          const response = await require('axios').get(ppUrl, { responseType: 'arraybuffer' });
          imageBuffer = Buffer.from(response.data, 'binary');
        } catch {
          return repondre("❌ I couldn't retrieve the user's profile picture.");
        }
      } else {
        // Default image if nothing is mentioned
        const defaultImg = "https://i.pinimg.com/564x/84/09/12/840912dd744e6662ab211b8070b5d84c.jpg";
        const response = await require('axios').get(defaultImg, { responseType: 'arraybuffer' });
        imageBuffer = Buffer.from(response.data, 'binary');
      }

      // Process the image using Canvacord
      const result = await canvacordFunction(imageBuffer);

      await zk.sendMessage(dest, { 
        image: result,
        caption: `*🎨 ${commandName.toUpperCase()} Effect Applied*\n*System:* 𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳`,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: channelJid,
                newsletterName: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰 𝚃𝙼𝙳 𝙴𝙳𝙸𝚃𝚂",
                serverMessageId: 1
            }
        }
      }, { quoted: ms });

    } catch (error) {
      console.error(`Error in ${commandName}:`, error);
      repondre("🥵 An error occurred while processing the image.");
    }
  });
}

// Registering all commands
createCanvacordCommand("shit", canvacord.Canvacord.shit);
createCanvacordCommand("wasted", canvacord.Canvacord.wasted);
createCanvacordCommand("wanted", canvacord.Canvacord.wanted);
createCanvacordCommand("trigger", canvacord.Canvacord.trigger);
createCanvacordCommand("trash", canvacord.Canvacord.trash);
createCanvacordCommand("rip", canvacord.Canvacord.rip);
createCanvacordCommand("sepia", canvacord.Canvacord.sepia);
createCanvacordCommand("rainbow", canvacord.Canvacord.rainbow);
createCanvacordCommand("invert", canvacord.Canvacord.invert);
createCanvacordCommand("jail", canvacord.Canvacord.jail);
createCanvacordCommand("affect", canvacord.Canvacord.affect);
createCanvacordCommand("beautiful", canvacord.Canvacord.beautiful);
createCanvacordCommand("blur", canvacord.Canvacord.blur);
createCanvacordCommand("circle", canvacord.Canvacord.circle);
createCanvacordCommand("facepalm", canvacord.Canvacord.facepalm);
createCanvacordCommand("greyscale", canvacord.Canvacord.greyscale);
createCanvacordCommand("joke", canvacord.Canvacord.jokeOverHead);
