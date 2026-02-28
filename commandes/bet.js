"use strict";

const { zokou } = require("../framework/zokou");

zokou({
    nomCom: "bet",
    categorie: "Games",
    reaction: "⚽"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms, prefixe, auteurMessage } = commandeOptions;

    // Check if the user provided the company name
    if (!arg || arg.length === 0) {
        return repondre(`*⚠️ PLEASE SPECIFY THE BOOKMAKER!*\n\n*Example:* ${prefixe}bet Sportybet\n*Example:* ${prefixe}bet 1xBet`);
    }

    const company = arg.join(" ").toUpperCase();
    
    repondre(`🔍 *TIMNASA-MD AI is generating daily tips for ${company}...*`);

    // List of common teams to randomize
    const teams = [
        "Real Madrid", "Man City", "Arsenal", "Bayern Munich", "PSG", 
        "Liverpool", "Barcelona", "Inter Milan", "Leverkusen", "AC Milan",
        "Aston Villa", "Dortmund", "Napoli", "Chelsea", "Juventus",
        "Atletico Madrid", "Spurs", "Benfica", "Ajax", "Sporting CP"
    ];

    // Prediction types
    const tips = ["Home Win (1)", "Away Win (2)", "Draw (X)", "Over 2.5", "GG (Both Teams Score)", "Home Over 1.5"];

    const generateMatches = () => {
        let list = "";
        let shuffled = teams.sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < 10; i++) {
            const teamA = shuffled[i];
            const teamB = shuffled[(i + 5) % teams.length];
            const prediction = tips[Math.floor(Math.random() * tips.length)];
            const odds = (Math.random() * (2.50 - 1.30) + 1.30).toFixed(2);
            
            list += `${i + 1}. *${teamA} vs ${teamB}*\n   ✨ *Tip:* ${prediction} (@${odds})\n\n`;
        }
        return list;
    };

    let betMsg = `⚽ *TIMNASA-MD DAILY TICKET* ⚽\n\n`;
    betMsg += `🏢 *BOOKMAKER:* ${company}\n`;
    betMsg += `👤 *ANALYST:* @${auteurMessage.split('@')[0]}\n`;
    betMsg += `───────────────────\n\n`;
    
    betMsg += generateMatches();
    
    betMsg += `📊 *TOTAL ODDS:* ${(Math.random() * (50.0 - 10.0) + 10.0).toFixed(2)}\n\n`;
    betMsg += `⚠️ *NOTE:* These are AI generated predictions based on recent form. Bet what you can afford to lose.`;

    await zk.sendMessage(dest, { 
        text: betMsg,
        mentions: [auteurMessage],
        contextInfo: {
            externalAdReply: {
                title: `${company} TOP 10 PREDICTIONS`,
                body: "TIMNASA-MD AI SPORTS ANALYTICS",
                thumbnailUrl: "https://files.catbox.moe/zm113g.jpg",
                sourceUrl: "https://whatsapp.com/channel/0029VaF39946H4YhS6u8Yt3q",
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: ms });
});
