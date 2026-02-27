const { zokou } = require(__dirname + "/../framework/zokou");
const axios = require("axios");

zokou({ nomCom: "bot", categorie: "AI", reaction: "🤖" }, async (dest, zk, commandeOptions) => {
    const { repondre, arg } = commandeOptions;
    if (!arg[0]) return repondre("Please ask a question.");
    try {
        const res = await axios.get(`https://mkzstyleee.vercel.app/ai/blackbox?text=${encodeURIComponent(arg.join(" "))}&apikey=FREE-OKBCJB3N-Q9TC`);
        repondre(res.data.result || "I couldn't get an answer.");
    } catch (e) { repondre("❌ AI is busy."); }
});
