"use strict";

const { zokou } = require("../framework/zokou");
const fancy = require("../commandes/style");

zokou({ nomCom: "fancy", categorie: "Fun", reaction: "✍️" }, async (dest, zk, commandeOptions) => {
    const { arg, repondre, prefixe, ms } = commandeOptions;
    const channelJid = "120363413554978773@newsletter";

    try {
        if (!arg || arg.length === 0) {
            let listText = `*『 𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝙵𝙰𝙽𝙲𝚈 𝚂𝚃𝚈𝙻𝙴𝚂 』*\n\n*Usage:* ${prefixe}fancy [number] [text]\n*Note:* Tap the styled text below to copy it.\n\n`;
            
            // Generate a list where each style is wrapped in backticks for easy copying
            for (let i = 0; i < fancy.length; i++) {
                listText += `*${i + 1}* - \`\`\`${fancy.apply(fancy[i], "Timnasa TMD")}\`\`\`\n`;
            }

            return await zk.sendMessage(dest, { 
                text: listText,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: channelJid,
                        newsletterName: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰 𝚃𝙼𝙳 𝙵𝙾𝙽𝚃𝚂",
                    }
                }
            }, { quoted: ms });
        }

        const id = parseInt(arg[0]);
        const text = arg.slice(1).join(" ");

        if (isNaN(id) || !text) {
            return await repondre(`❌ *Invalid Format!*\n\n*Use:* ${prefixe}fancy 5 Hello World`);
        }

        const selectedStyle = fancy[id - 1];
        if (selectedStyle) {
            const result = fancy.apply(selectedStyle, text);
            // Send the result in monospace format so users can tap to copy
            return await repondre(`\`\`\`${result}\`\`\``);
        } else {
            return await repondre("_❌ Style not found! Choose a number between 1 and " + fancy.length + "_");
        }
    } catch (error) {
        repondre("_Error processing fonts!_");
    }
});
