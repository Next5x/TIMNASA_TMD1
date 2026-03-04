"use strict";

const { zokou } = require("../framework/zokou");

zokou({
    nomCom: "bugmenu",
    aliases: ["bug", "crashlist", "buglist"],
    categorie: "Bug-VIP",
    reaction: "☣️"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, prefixe, superUser, auteurMessage } = commandeOptions;
    
    // Ulinzi: Ni Owner pekee anayeweza kuona hii menu
    if (!superUser) return repondre("❌ Restricted to Bot Owner only.");

    const channelJid = "120363406146813524@newsletter";
    const userName = auteurMessage.split('@')[0];

    try {
        let bugMsg = `
┏━━━━━━━━━━━━━━━┓
┃  ☣️ *𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝙴𝙻𝙸𝚃𝙴* ☣️
┗━━━━━━━━━━━━━━━┛
   *𝚃𝙴𝚁𝙼𝙸𝙽𝙰𝙻 𝚂𝚈𝚂𝚃𝙴𝙼 𝚅𝟸*

👤 *USER:* @${userName}
⚙️ *MODE:* 𝙳𝙴𝙰𝚃𝙷-𝚂𝚀𝚄𝙰𝙳
📡 *SERVER:* 𝙾𝙽𝙻𝙸𝙽𝙴

*『 💣 𝚂𝙸𝙽𝙶𝙻𝙴 𝙰𝚃𝚃𝙰𝙲𝙺𝚂 』*
_Target: ${prefixe}command [number]_

• ☣️ \`${prefixe}crash\`
• 👾 \`${prefixe}bin\`
• ⚠️ \`${prefixe}ui-bug\`
• 🥶 \`${prefixe}total-freeze\`
• 💣 \`${prefixe}heavy-wa\`
• ⏳ \`${prefixe}lag\`
• 💀 \`${prefixe}dark-web\`
• 🌋 \`${prefixe}ram-kill\`
• ♨️ \`${prefixe}cpu-heat\`
• 👻 \`${prefixe}ghost-bug\`
• 📡 \`${prefixe}payload-x\`
• ☣️ \`${prefixe}kernel-error\`
• 🌀 \`${prefixe}infinite-lag\`
• 📂 \`${prefixe}internal-bug\`
• ⚰️ \`${prefixe}death-point\`

*『 ⚡ 𝚄𝙻𝚃𝙸𝙼𝙰𝚃𝙴 𝙲𝙾𝙼𝙱𝙾 』*
• 💀 \`${prefixe}mega-bug\`
_(Sends all 15 viruses at once)_

───────────────────
> *Warning:* These commands are for system resilience testing only. Use responsibly.
───────────────────
*Powered by 𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳*`;

        await zk.sendMessage(dest, {
            text: bugMsg,
            mentions: [auteurMessage],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    newsletterName: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰 𝚃𝙼𝙳 𝙳𝙴𝙰𝚃𝙷-𝚂𝚀𝚄𝙰𝙳",
                    serverMessageId: 1
                },
                externalAdReply: {
                    title: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝙱𝚄𝙶 𝙸𝙽𝚃𝙴𝚁𝙵𝙰𝙲𝙴",
                    body: "System Vulnerability Terminal",
                    thumbnailUrl: "https://files.catbox.moe/zm113g.jpg", 
                    sourceUrl: "https://whatsapp.com/channel/0029VaF39946H4YhS6u8Yt3q",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: ms });

    } catch (error) {
        console.error("Bug Menu Error:", error);
        repondre(`❌ Error loading menu. Use ${prefixe}mega-bug directly.`);
    }
});
