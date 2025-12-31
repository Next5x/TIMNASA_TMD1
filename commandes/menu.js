const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

zokou({ nomCom: "menu", categorie: "General" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre ,prefixe,nomAuteurMessage,mybotpic} = commandeOptions;
    let { cm } = require(__dirname + "/../framework/zokou");
    var coms = {};
    var mode = (s.MODE).toLocaleLowerCase() != "yes" ? "Private" : "Public";

    // Count total commands
    let totalCommands = cm.length;

    cm.map(async (com, index) => {
        if (!coms[com.categorie])
            coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    // Set Tanzania Timezone
    moment.tz.setDefault('Africa/Dar_es_Salaam');
    const hour = moment().format('HH');
    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    // Select Greeting and Image list based on Time of Day
    let greeting = "";
    let myPictures = [];

    if (hour >= 0 && hour < 12) {
        greeting = "🌅 GOOD MORNING";
        myPictures = [
            "https://telegra.ph/file/morning_1.jpg",
            "https://telegra.ph/file/morning_2.jpg",
            "https://telegra.ph/file/morning_3.jpg",
            "https://telegra.ph/file/morning_4.jpg",
            "https://telegra.ph/file/morning_5.jpg",
            "https://telegra.ph/file/morning_6.jpg"
        ];
    } else if (hour >= 12 && hour < 15) {
        greeting = "☀️ GOOD AFTERNOON";
        myPictures = [
            "https://telegra.ph/file/afternoon_1.jpg",
            "https://telegra.ph/file/afternoon_2.jpg",
            "https://telegra.ph/file/afternoon_3.jpg",
            "https://telegra.ph/file/afternoon_4.jpg",
            "https://telegra.ph/file/afternoon_5.jpg",
            "https://telegra.ph/file/afternoon_6.jpg"
        ];
    } else if (hour >= 15 && hour < 19) {
        greeting = "🌆 GOOD EVENING";
        myPictures = [
            "https://telegra.ph/file/evening_1.jpg",
            "https://telegra.ph/file/evening_2.jpg",
            "https://telegra.ph/file/evening_3.jpg",
            "https://telegra.ph/file/evening_4.jpg",
            "https://telegra.ph/file/evening_5.jpg",
            "https://telegra.ph/file/evening_6.jpg"
        ];
    } else {
        greeting = "🌃 GOOD NIGHT";
        myPictures = [
            "https://telegra.ph/file/night_1.jpg",
            "https://telegra.ph/file/night_2.jpg",
            "https://telegra.ph/file/night_3.jpg",
            "https://telegra.ph/file/night_4.jpg",
            "https://telegra.ph/file/night_5.jpg",
            "https://telegra.ph/file/night_6.jpg"
        ];
    }

    // Pick one random image from the selected list
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
╚═════════════════════════════╝

${readmore}`;

    for (const cat in coms) {
        menuMsg += `\n✨ *${cat.toUpperCase()}* ✨\n`;
        for (const cmd of coms[cat]) {
            menuMsg += `  ◦ ${cmd}\n`;
        }
    }

    menuMsg += `\n\n*POWERED BY TIMNASA TMD2*`;

    const sendMenu = async () => {
        let messageOptions = {
            caption: menuMsg,
            footer: "Click here to join the channel",
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363413554978773@newsletter",
                    newsletterName: "TIMNASA TMD2 UPDATES",
                    serverMessageId: 1
                }
            }
        };

        if (randomPic.match(/\.(mp4|gif)$/i)) {
            messageOptions.video = { url: randomPic };
            messageOptions.gifPlayback = true;
        } else {
            messageOptions.image = { url: randomPic };
        }

        await zk.sendMessage(dest, messageOptions, { quoted: ms });
    };

    try {
        await sendMenu();
        await zk.sendMessage(dest, { 
            audio: { url: "https://files.catbox.moe/lqx6sp.mp3" }, 
            mimetype: 'audio/mp4', 
            ptt: false 
        }, { quoted: ms });

    } catch (e) {
        console.log("Menu Error: " + e);
        repondre("An error occurred: " + e);
    }
});
