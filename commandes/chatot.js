const { zokou } = require("../framework/zokou");
const {  verifierEtatJid , recupererActionJid } = require("../bdd/antilien"); // Tunatumia mfumo wa bdd uliopo kama mfano au unaweza kutengeneza bdd mpya ya chatbot

zokou({
    nomCom: "chatbot",
    reaction: "🤖",
    categorie: "Settings"
}, async (dest, zk, reponse) => {
    const { ms, arg, superUser, verifAdmin } = reponse;

    if (!superUser && !verifAdmin) {
        return zk.sendMessage(dest, { text: "Command hii ni kwa ajili ya Admin tu!" }, { quoted: ms });
    }

    if (!arg[0]) {
        return zk.sendMessage(dest, { text: "Tafadhali tumia:\n*.chatbot on* - Kuwasha\n*.chatbot off* - Kuzima" }, { quoted: ms });
    }

    if (arg[0] === "on") {
        // Hapa unaweza kutengeneza bdd yako ya chatbot. Kwa sasa tutatumia logic ya config na database.
        // Mfano: await kuwashaChatbot(dest); 
        await zk.sendMessage(dest, { text: "✅ Chatbot imewashwa kwenye chat hii!" }, { quoted: ms });
    } else if (arg[0] === "off") {
        await zk.sendMessage(dest, { text: "❌ Chatbot imezimwa kwenye chat hii!" }, { quoted: ms });
    }
});
