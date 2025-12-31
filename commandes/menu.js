"use strict";
const { zokou } = require("../framework/zokou");
const moment = require("moment-timezone");
const os = require("os");
const s = require("../set");

const readMore = String.fromCharCode(8206).repeat(4001);

// Function to convert text to fancy uppercase font
const toFancyUppercaseFont = (text) => {
    const fonts = {
        'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌',
        'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙'
    };
    return text.split('').map(char => fonts[char] || char).join('');
};

// Function to convert text to fancy lowercase font
const toFancyLowercaseFont = (text) => {
    const fonts = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ',
        'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
    };
    return text.split('').map(char => fonts[char] || char).join('');
};

zokou({ 
    nomCom: "menu", 
    categorie: "Menu", 
    reaction: "☢️", 
    nomFichier: __filename 
}, async (dest, zk, commandeOptions) => {
    const { repondre, prefixe, nomAuteurMessage } = commandeOptions;
    const { cm } = require("../framework/zokou");
    let coms = {};
    let mode = "public";
    
    if ((s.MODE).toLocaleLowerCase() != "yes") {
        mode = "private";
    }

    cm.map(async (com) => {
        if (!coms[com.categorie]) coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault("Africa/Dar_es_Salaam");
    const hour = moment().hour();
    let greeting = "ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ";
    if (hour >= 12 && hour < 18) greeting = "ɢᴏᴏᴅ ᴀғᴛᴇʀɴᴏᴏɴ!";
    else if (hour >= 18) greeting = "ɢᴏᴏᴅ ᴇᴠᴇɴɪɴɢ!";
    else if (hour >= 22 || hour < 5) greeting = "ɢᴏᴏᴅ ɴɪɢʜᴛ";

    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');
    const img = 'https://files.catbox.moe/tq4mph.jpg';
    const imgs = 'https://files.catbox.moe/qsu6xe.jpg';

    const infoMsg = `
╭┈┈┈┈━⊷
*┋* *ʙᴏᴛ ɴᴀᴍᴇ :*  *𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 𝚳𝚵𝚴𝐔*
*┋* *ᴘʀᴇғɪx :* [ ${s.PREFIXE} ]
*┋* *ᴍᴏᴅᴇ :* ${mode}
*┋* *ᴅᴀᴛᴇ  :* ${date}
*┋* *ᴘʟᴀᴛғᴏʀᴍ :* ${os.platform()}
*┋* *ᴏᴡɴᴇʀ ɪs : timoth*
*┋* *ᴘʟᴜɢɪɴs ᴄᴍᴅ :* ${cm.length}
╰┈┈┈┈━⊷\n`;
    
    let menuMsg = ` *${greeting}*`;
    
    for (const cat in coms) {
        menuMsg += `
*「 ${toFancyUppercaseFont(cat)} 」*
╭─━⊷ `;
        for (const cmd of coms[cat]) {
            menuMsg += `          
*┋* ${toFancyLowercaseFont(cmd)}`;   
        }
        menuMsg += `
╰─━⊷`;
    }
    
    menuMsg += `
> @made by ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ\n`;

    try {
        await zk.sendMessage(dest, { 
            image: { url: img },
            caption: infoMsg + menuMsg,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363313124070136@newsletter",
                    newsletterName: "@ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ",
                    serverMessageId: -1
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: "𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃 𝚳𝚵𝚴𝐔",
                    body: "🗡️ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ Commands List",
                    thumbnailUrl: imgs,
                    sourceUrl: "https://whatsapp.com/channel/0029VaihcQv84Om8LP59fO3f",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
      } catch (error) {
        console.error("Menu error: ", error);
        repondre("🥵🥵 Menu error: " + error);
    }
});
