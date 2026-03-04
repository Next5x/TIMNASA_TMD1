"use strict";

const { zokou } = require("../framework/zokou");
const conf = require("../set");

zokou({
    nomCom: "bugmenu",
    aliases: ["bug", "crashlist"],
    categorie: "Bug",
    reaction: "☣️"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, prefixe, superUser } = commandeOptions;
    
    // Security: Only Owner can see the Bug Menu
    if (!superUser) return repondre("❌ Restricted to Bot Owner only.");

    const channelJid = "120363413554978773@newsletter";
    const bugUrl = "https://files.catbox.moe/lqx6sp.mp3"; // Resilience Test URL

    try {
        let bugMsg = `
╭─────────────━┈⊷•
│ ☣️ *𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝙱𝚄𝙶 𝚂𝚈𝚂𝚃𝙴𝙼*
│ 👤 *STATUS:* 𝙳𝙴𝙰𝚃𝙷-𝙼𝙾𝙳𝙴
│ ⚡ *POWER:* 𝙼𝙰𝚇𝙸𝙼𝚄𝙼
╰─────────────━┈⊷•

*『 ⚠️ 𝚂𝚃𝚁𝙴𝚂𝚂 𝚃𝙴𝚂𝚃 𝙻𝙸𝚂𝚃 』*
_Use these to test WhatsApp resilience:_

• \`\`\`${prefixe}crash\`\`\` - Lag Chat UI
• \`\`\`${prefixe}bin\`\`\` - Binary Attack
• \`\`\`${prefixe}ui-bug\`\`\` - Interface Glitch
• \`\`\`${prefixe}total-freeze\`\`\` - VCF Death
• \`\`\`${prefixe}heavy-wa\`\`\` - RAM Bombard

*『 📞 𝚂𝚄𝙿𝙿𝙾𝚁𝚃 』*
• *Owner:* wa.me/255784766591

> *Warning:* These commands send heavy payloads. Use only for testing security protections.
`;

        // Send with Newsletter Metadata
        await zk.sendMessage(dest, {
            text: bugMsg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    newsletterName: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝙴𝚇𝙿𝙻𝙾𝙸𝚃𝚂",
                    serverMessageId: 1
                },
                externalAdReply: {
                    title: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝙱𝚄𝙶 𝙼𝙴𝙽𝚄",
                    body: "System Vulnerability Testing",
                    thumbnailUrl: "https://files.catbox.moe/zm113g.jpg", 
                    sourceUrl: "https://wa.me/255784766591",
                    mediaType: 1
                }
            }
        }, { quoted: ms });

        // Optional: Send the test audio even if there is an error in processing
        await zk.sendMessage(dest, {
            audio: { url: bugUrl },
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: ms });

    } catch (error) {
        console.error("Bug Menu Error:", error);
        // Fallback: Send plain text if the complex message fails
        repondre(`*TIMNASA-TMD BUG LIST*\n\n1. ${prefixe}crash\n2. ${prefixe}bin\n3. ${prefixe}total-freeze\n\nError: Media link failed but system is active.`);
    }
});
