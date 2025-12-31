const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

zokou({ nomCom: "menu", categorie: "MENU" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, prefixe, mybotpic } = commandeOptions;
    
    // Muhimu: Tunaita 'cm' moja kwa moja kutoka kwenye framework
    const { cm } = require(__dirname + "/../framework/zokou");
    
    var coms = {};
    var mode = (s.MODE).toLocaleLowerCase() != "yes" ? "Private" : "Public";

    // 1. Kuhesabu Idadi ya Commands
    let totalCommands = cm.length;

    cm.map((com) => {
        if (!coms[com.categorie]) coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    // 2. Muda wa Tanzania
    moment.tz.setDefault('Africa/Dar_es_Salaam');
    const hour = moment().format('HH');
    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    // 3. Salamu na Picha
    let greeting = "";
    let myPictures = [];

    if (hour < 12) {
        greeting = "🌅 GOOD MORNING";
        myPictures = ["https://files.catbox.moe/p8mv62.jpg", "https://files.catbox.moe/p8mv62.jpg"]; // Weka URL 6 hapa
    } else if (hour < 18) {
        greeting = "☀️ GOOD AFTERNOON";
        myPictures = ["https://files.catbox.moe/p8mv62.jpg", "https://files.catbox.moe/p8mv62.jpg"];
    } else {
        greeting = "🌃 GOOD EVENING";
        myPictures = ["https://files.catbox.moe/p8mv62.jpg", "https://files.catbox.moe/p8mv62.jpg"];
    }

    const randomPic = myPictures[Math.floor(Math.random() * myPictures.length)];

    let menuMsg = `
╔═══════『 **𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃2** 』═══════╗
┃
┃  👋 **${greeting}**
┃  👤 **USER**: ${s.OWNER_NAME}
┃  🕒 **TIME**: ${temps}
┃  📅 **DATE**: ${date}
┃  📊 **COMMANDS**: ${totalCommands}
┃  ⚙️ **MODE**: ${mode}
┃  🔋 **RAM**: ${format(os.totalmem() - os.freemem())}/${format(os.totalmem())}
┃
╚═════════════════════════════╝\n\n`;

    for (const cat in coms) {
        menuMsg += `✨ *${cat.toUpperCase()}* ✨\n`;
        for (const cmd of coms[cat]) {
            menuMsg += `  ◦ ${cmd}\n`;
        }
        menuMsg += `\n`;
    }

    try {
        await zk.sendMessage(dest, {
            image: { url: randomPic },
            caption: menuMsg,
            contextInfo: {
                externalAdReply: {
                    title: "TIMNASA TMD2 MENU",
                    body: "Powered by Timnasa",
                    thumbnailUrl: randomPic,
                    sourceUrl: "https://whatsapp.com/channel/120363413554978773@newsletter",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: ms });
    } catch (e) {
        repondre("Error: " + e.message);
    }
});
