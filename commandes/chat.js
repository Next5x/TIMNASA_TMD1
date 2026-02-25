const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou({
  nomCom: "bot",
  reaction: "🎙️",
  categorie: "AI"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms, mtype, msgRepondu } = commandeOptions;

  try {
    let query = "";

    // 1. Angalia kama ni Audio (Kutoka kwa sauti)
    if (mtype === "audioMessage" || (msgRepondu && msgRepondu.audioMessage)) {
      query = "Nieleze kuhusu teknolojia ya AI kwa kifupi"; // Hapa unaweza kuweka Transcriber kama unayo
    } 
    
    // 2. Kama ni maandishi
    if (!query && arg && arg.length > 0) {
      query = arg.join(" ");
    }

    if (!query) {
      return repondre("*Syntax Error*\n\nAndika kitu au tuma sauti kisha tag kwa .ai");
    }

    // 3. Pata jibu kutoka kwa AI API
    const txt = encodeURIComponent(query);
    const aiUrl = `https://api-faa.my.id/faa/ai-realtime?text=${txt}`;
    
    await zk.sendPresenceUpdate('composing', dest);
    const res = await axios.get(aiUrl);
    
    if (!res.data || !res.data.result) {
      return repondre("❌ Nimeshindwa kupata jibu kwa sasa.");
    }

    const aiResponse = res.data.result;

    // 4. Badilisha Jibu kuwa Sauti (Text-to-Speech)
    // Tunatumia Google TTS API rahisi
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(aiResponse.target ? aiResponse.target : aiResponse)}&tl=sw&client=tw-ob`;

    // 5. Tuma Jibu la Sauti na Maandishi kwa Pamoja
    await zk.sendMessage(dest, {
        audio: { url: ttsUrl },
        mimetype: 'audio/mp4',
        ptt: true, // Inatokea kama Voice Note ya kawaida
        contextInfo: {
            externalAdReply: {
                title: "TIMNASA AI ASSISTANT",
                body: "Powered by Timnasax GitHub",
                thumbnailUrl: "https://telegra.ph/file/0c3260c6d96200234a946.jpg", // Badilisha na picha yako
                sourceUrl: "https://github.com/timnasax",
                renderLargerThumbnail: true,
                mediaType: 1
            }
        }
    }, { quoted: ms });

    // Pia tuma maandishi kama backup
    return repondre(`*JIBU LA AI:* \n\n${aiResponse}`);

  } catch (e) {
    console.error(e);
    return repondre(`❌ Hitilafu: ${e.message}`);
  }
});
