const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

// ==========================================
// MENU COMMAND
// ==========================================
zokou({ nomCom: "menu", categorie: "General" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre ,prefixe,nomAuteurMessage,mybotpic} = commandeOptions;
    let { cm } = require(__dirname + "/../framework/zokou");
    var coms = {};
    var mode = (s.MODE).toLocaleLowerCase() != "yes" ? "Private" : "Public";

    cm.map(async (com, index) => {
        if (!coms[com.categorie])
            coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault('EAT');
    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    let menuMsg = `
╔═══════『 **𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃2** 』═══════╗
┃
┃  👤 **USER**: ${s.OWNER_NAME}
┃  🕒 **TIME**: ${temps}
┃  📅 **DATE**: ${date}
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

    var lien = mybotpic();

    const sendMenu = async () => {
        let messageOptions = {
            caption: menuMsg,
            footer: "Click here to join channel",
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

        if (lien.match(/\.(mp4|gif)$/i)) {
            messageOptions.video = { url: lien };
            messageOptions.gifPlayback = true;
        } else {
            messageOptions.image = { url: lien };
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

// ==========================================
// BASE64 COMMANDS (ADDED)
// ==========================================

// 1. Encode Command (Text to Base64)
zokou({ nomCom: "encode", categorie: "Conversion" }, async (dest, zk, commandeOptions) => {
    let { repondre, arg } = commandeOptions;
    if (!arg[0]) return repondre("Please provide the text you want to encode to Base64.");
    
    let text = arg.join(" ");
    let encoded = Buffer.from(text).toString('base64');
    repondre(`*ENCODED RESULT:*\n\n${encoded}`);
});

// 2. Decode Command (Base64 to Text)
zokou({ nomCom: "decode", categorie: "Conversion" }, async (dest, zk, commandeOptions) => {
    let { repondre, arg } = commandeOptions;
    if (!arg[0]) return repondre("Please provide the Base64 string you want to decode.");
    
    try {
        let decoded = Buffer.from(arg.join(" "), 'base64').toString('utf-8');
        repondre(`*DECODED RESULT:*\n\n${decoded}`);
    } catch (e) {
        repondre("⚠️ Error! Please make sure you provided a valid Base64 string.");
    }
});
