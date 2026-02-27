const { zokou } = require(__dirname + "/../framework/zokou");
const axios = require("axios");

zokou({ nomCom: "history", categorie: "General", reaction: "📜" }, async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    try {
        const date = new Date();
        const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${date.getMonth()+1}/${date.getDate()}`);
        let msg = `*HISTORICAL EVENTS TODAY* 🏛️\n\n`;
        res.data.events.slice(0, 5).forEach(e => msg += `📌 *${e.year}:* ${e.text}\n\n`);
        repondre(msg);
    } catch (e) { repondre("❌ Error fetching history."); }
});
