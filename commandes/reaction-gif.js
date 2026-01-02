const axios = require('axios');
const { zokou } = require("../framework/zokou");
const fs = require("fs-extra");
const child_process = require('child_process');
const { unlink } = require('fs').promises;

// --- MFUMO WA KUTUMA NEWSLETTER NA MZIKI (TIMNASA TMD) ---
const sendTimnasaExtras = async (zk, dest, ms) => {
    try {
        // 1. Kutuma View Channel (Newsletter) - Hakikisha JID ni sahihi
        await zk.sendMessage(dest, {
            newsletterJid: "120363413554978773@newsletter",
            newsletterName: "ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ CHANNEL",
            serverMessageId: 1
        });

        // 2. Kutuma Mziki (Audio)
        await zk.sendMessage(dest, {
            audio: { url: "https://files.catbox.moe/lqx6sp.mp3" },
            mimetype: 'audio/mp3',
            ptt: false 
        }, { quoted: ms });
        
    } catch (e) { 
        console.log("Extras Error: " + e); 
    }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const GIFBufferToVideoBuffer = async (image) => {
    const filename = `${Math.random().toString(36)}`;
    await fs.writeFileSync(`./${filename}.gif`, image);
    
    const cmd = `ffmpeg -i ./${filename}.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ./${filename}.mp4`;
    
    return new Promise((resolve, reject) => {
        child_process.exec(cmd, async (error) => {
            if (error) {
                reject(error);
            } else {
                await sleep(2000); // Muda mfupi wa kusubiri file liwe tayari
                const buffer = fs.readFileSync(`./${filename}.mp4`);
                await Promise.all([unlink(`./${filename}.mp4`), unlink(`./${filename}.gif`)]);
                resolve(buffer);
            }
        });
    });
};

const generateReactionCommand = (reactionName, reactionEmoji) => {
    zokou({
        nomCom: reactionName,
        categorie: "Reaction",
        reaction: reactionEmoji,
    },
    async (origineMessage, zk, commandeOptions) => {
        const { auteurMessage, auteurMsgRepondu, repondre, ms, msgRepondu } = commandeOptions;

        try {
            const response = await axios.get(`https://api.waifu.pics/sfw/${reactionName}`);
            const imageUrl = response.data.url;
            const gifBufferResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const videoBuffer = await GIFBufferToVideoBuffer(gifBufferResponse.data);

            let txt = "";
            let mentions = [auteurMessage];

            if (msgRepondu) { 
                txt = `*ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ ʀᴇᴀᴄᴛɪᴏɴ*\n\n🌟 @${auteurMessage.split("@")[0]} ${reactionName} @${auteurMsgRepondu.split("@")[0]}`;
                mentions.push(auteurMsgRepondu);
            } else {
                txt = `*ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ ʀᴇᴀᴄᴛɪᴏɴ*\n\n🌟 @${auteurMessage.split("@")[0]} ${reactionName} everyone`;
            }

            // Tuma Reaction kwanza na subiri imalize
            await zk.sendMessage(origineMessage, { 
                video: videoBuffer, 
                gifPlayback: true, 
                caption: txt, 
                mentions: mentions 
            }, { quoted: ms });

            // ONGEZA KASUBIRI KIDOGO (DELAY) ILI WHATSAPP ISIBLOCK MESEJI ZINAZOFUATA
            await sleep(1500);

            // Tuma Newsletter na Mziki
            await sendTimnasaExtras(zk, origineMessage, ms);

        } catch (error) {
            console.log(error);
            repondre('Error occurred: ' + error.message);
        }
    });
};

// Orodha ya amri
const reactions = [
    "bully", "cuddle", "cry", "hug", "awoo", "kiss", "lick", "pat", 
    "smug", "bonk", "yeet", "blush", "smile", "wave", "highfive", 
    "handhold", "nom", "bite", "glomp", "slap", "kill", "kick", 
    "happy", "wink", "poke", "dance", "cringe"
];

reactions.forEach(react => generateReactionCommand(react, "✨"));
