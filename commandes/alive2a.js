"use strict";
const { zokou } = require(__dirname + "/../framework/zokou");
const s = require(__dirname + "/../set");

zokou({
    nomCom: "alive2",
    categorie: "General",
    reaction: "⚡"
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, prefixe } = commandeOptions;

    try {
        console.log("Alive2 imewashwa..."); // Hii itaonekana kwenye logs zako bot ikipokea command
        
        const text = "LUCKY MD X-FORCE IS ACTIVE\nPrefix: " + prefixe;
        
        // Jaribu kutuma ujumbe wa kawaida kwanza uone kama inafanya kazi
        await zk.sendMessage(dest, { text: text }, { quoted: ms });

        // Kama text inatoka, basi tatizo litakuwa kwenye picha au audio link
        await zk.sendMessage(dest, { 
            audio: { url: "https://files.catbox.moe/lqx6sp.mp3" }, 
            mimetype: 'audio/mp4', 
            ptt: false 
        }, { quoted: ms });

    } catch (e) {
        repondre("Kuna hitilafu: " + e.message);
    }
});
