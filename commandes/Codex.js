const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou({
  nomCom: "codex",
  reaction: "💻",
  categorie: "Developer"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    // 1. Angalia kama mtumiaji ametoa maelezo ya code anayotaka
    if (!arg || arg.length === 0) {
      return repondre(`*CODEX AI SYSTEM*\n\nAndika maelezo ya code unayohitaji.\n\nMfano: .codex tengeneza login page kwa HTML na CSS`);
    }

    const prompt = arg.join(" ");
    
    // 2. Tuma hali ya 'composing' kuonyesha bot inafanya kazi
    await zk.sendPresenceUpdate('composing', dest);

    // 3. Tunatumia API ya AI iliyoboreshwa kwa ajili ya coding
    // Hapa tunaiambia AI iwe "Expert Programmer"
    const codingPrompt = `Wewe ni mtaalamu wa programu (Expert Programmer). Andika code safi na maelezo mafupi kwa ajili ya: ${prompt}`;
    
    const url = `https://api-faa.my.id/faa/ai-realtime?text=${encodeURIComponent(codingPrompt)}`;
    const response = await axios.get(url);
    const result = response.data.result;

    if (!result) {
      return repondre("❌ Samahani, nimeshindwa kutengeneza code hiyo kwa sasa.");
    }

    // 4. Unda ujumbe wa matokeo
    const responseMsg = `
💻 *TIMNASA CODEX AI* 💻
__________________________________________

${result}

__________________________________________
🔗 *GitHub:* https://github.com/timnasax
> *Copy code hapo juu kutumia kwenye mradi wako.*
`.trim();

    // 5. Tuma kwa mtindo wa kijanja wenye kioo cha picha
    await zk.sendMessage(dest, {
      text: responseMsg,
      contextInfo: {
        externalAdReply: {
          title: "TIMNASA CODE GENERATOR",
          body: "AI-Powered Coding Assistant",
          thumbnailUrl: "https://telegra.ph/file/0c3260c6d96200234a946.jpg",
          sourceUrl: "https://github.com/timnasax",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: ms });

  } catch (e) {
    console.error(e);
    return repondre(`❌ Hitilafu ya Codex: ${e.message}`);
  }
});
