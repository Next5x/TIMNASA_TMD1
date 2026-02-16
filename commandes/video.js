"use strict";
const { zokou } = require("../framework/zokou");
const axios = require("axios");

// Memory ya muda kuhifadhi mazungumzo
let userMemory = {};

zokou({
    nomCom: "ai",
    reaction: "🧠",
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms, auteurMessage } = commandeOptions;

    if (!arg || arg.length === 0) {
        return repondre("Hujambo! Mimi ni TIMNASA-MD AI. Niulize chochote.\nMfano: .ai Niambie kuhusu Tanzania.");
    }

    const swali = arg.join(" ");
    const apikey = "FREE-OKBCJB3N-Q9TC";

    // Pata historia ya nyuma ya huyu mtumiaji au anza upya
    let context = userMemory[auteurMessage] || "";
    // Unganisha historia na swali jipya kwa ajili ya Blackbox
    const fullPrompt = context ? `History: ${context}\nUser: ${swali}` : swali;

    try {
        const response = await axios.get(`https://mkzstyleee.vercel.app/ai/blackbox?text=${encodeURIComponent(fullPrompt)}&apikey=${apikey}`);
        
        if (response.data && response.data.result) {
            const resultText = response.data.result;
            
            // Hifadhi historia fupi (tunaweka swali na jibu ili akumbuke)
            userMemory[auteurMessage] = `User: ${swali}\nAI: ${resultText}`.slice(-500); // Tunatunza herufi 500 tu za mwisho

            await zk.sendMessage(dest, { text: `*TIMNASA-MD AI* 🤖\n\n${resultText}` }, { quoted: ms });
        } else {
            repondre("Samahani, sikufaulu kupata jibu kwa sasa.");
        }
    } catch (e) {
        console.log("AI Error: " + e);
        repondre("Kuna hitilafu kwenye mfumo wa AI.");
    }
});
