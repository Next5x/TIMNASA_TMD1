"use strict";

const { zokou } = require("../framework/zokou");

zokou({
    nomCom: "aviator",
    categorie: "Games",
    reaction: "✈️"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms, prefixe, auteurMessage } = commandeOptions;

    // Check if the user provided the company name
    if (!arg || arg.length === 0) {
        return repondre(`*⚠️ PLEASE PROVIDE A COMPANY NAME!*\n\n*Example:* ${prefixe}aviator Sportybet\n*Example:* ${prefixe}aviator Betika\n*Example:* ${prefixe}aviator Premierbet`);
    }

    const company = arg.join(" ").toUpperCase();
    
    // Initial analysis message
    repondre(`🔍 *TIMNASA-MD AI is analyzing ${company} algorithm...*`);

    // Helper to generate simulated Odds (Randomly between 1.10x and 5.50x)
    const generateOdd = () => (Math.random() * (5.50 - 1.10) + 1.10).toFixed(2);
    
    // Helper to generate dynamic timestamps
    const getTime = (offsetSeconds) => {
        const d = new Date();
        d.setSeconds(d.getSeconds() + offsetSeconds);
        return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    // Generating simulated data for the display
    const lastRoundOdd = (Math.random() * (2.80 - 1.05) + 1.05).toFixed(2);
    const lastRoundTime = getTime(-50); // Previous round approx 50 seconds ago

    let signalMsg = `🚀 *TIMNASA-MD AVIATOR PREDICTOR* 🚀\n\n`;
    signalMsg += `🏢 *COMPANY:* ${company}\n`;
    signalMsg += `👤 *REQUESTED BY:* @${auteurMessage.split('@')[0]}\n`;
    signalMsg += `───────────────────\n\n`;
    
    signalMsg += `🕒 *LAST ROUND:* ${lastRoundTime}\n`;
    signalMsg += `📉 *RESULT:* ${lastRoundOdd}x\n\n`;
    
    signalMsg += `🔮 *NEXT 3 SIGNALS:* \n`;
    signalMsg += `1️⃣ *Time:* ${getTime(30)} ➔ *Target:* ${generateOdd()}x\n`;
    signalMsg += `2️⃣ *Time:* ${getTime(95)} ➔ *Target:* ${generateOdd()}x\n`;
    signalMsg += `3️⃣ *Time:* ${getTime(160)} ➔ *Target:* ${generateOdd()}x\n\n`;
    
    signalMsg += `⚠️ *DISCLAIMER:* This is based on AI simulation. Gambing involves risk. Play responsibly.`;

    // Send the message with a professional look (External Ad Reply)
    await zk.sendMessage(dest, { 
        text: signalMsg,
        mentions: [auteurMessage],
        contextInfo: {
            externalAdReply: {
                title: `${company} AVIATOR AI SIGNAL`,
                body: "TIMNASA-MD INTELLIGENCE",
                thumbnailUrl: "https://files.catbox.moe/zm113g.jpg", // Ensure this link is active
                sourceUrl: "https://whatsapp.com/channel/0029VaF39946H4YhS6u8Yt3q",
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: ms });
});
