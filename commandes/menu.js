const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

zokou({ nomCom: "menu", categorie: "Menu" }, async (dest, zk, commandeOptions) => {
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

    // Muonekano mpya wa Menu (Clean & Modern)
    let menuMsg = `
╔════『 **𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃2** ════╗
┃
┃  👤 **USER**: ${s.OWNER_NAME}
┃  🕒 **TIME**: ${temps}
┃  📅 **DATE**: ${date}
┃  ⚙️ **MODE**: ${mode}
┃  🔋 **RAM**: ${format(os.totalmem() - os.freemem())}/${format(os.totalmem())}
┃
╚══════════════════════════╝

${readmore}`;

    for (const cat in coms) {
        menuMsg += `\n✨ *${cat.toUpperCase()}* ✨\n`;
        for (const cmd of coms[cat]) {
            menuMsg += `  ◦ ${cmd}\n`;
        }
    }

    menuMsg += `\n\n*POWERED BY TIMNASA TMD2*`;

    var lien = mybotpic();

    // Kutuma ujumbe wenye picha/video na View Channel tag
    const sendMenu = async () => {
        let messageOptions = {
            caption: menuMsg,
            footer: "Bonyeza hapa kujiunga na channel",
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
        
        // Kutuma Muziki mwishoni
        await zk.sendMessage(dest, { 
            audio: { url: "https://files.catbox.moe/lqx6sp.mp3" }, 
            mimetype: 'audio/mp4', 
            ptt: false // Ikitumwa kama audio file ya kawaida
        }, { quoted: ms });

    } catch (e) {
        console.log("Menu Error: " + e);
        repondre("Hitilafu imetokea: " + e);
    }
});
