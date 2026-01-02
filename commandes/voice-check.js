"use strict";

const { zokou } = require("../framework/zokou");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

zokou({ nomCom: "robot", categorie: "Voice-Changer", reaction: "🤖" }, async (dest, zk, commandeOptions) => {
    const { ms, msgRepondu, repondre } = commandeOptions;
    if (!msgRepondu || !msgRepondu.audioMessage) return repondre("Tafadhali tag voice note au audio unayotaka niibadili.");

    repondre("Processing... 🔄");
    const audioPath = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage);
    const outputPath = path.join(__dirname, `robot_${Date.now()}.mp3`);

    exec(`ffmpeg -i ${audioPath} -filter_complex "lv2=p=http://gareus.org/oss/lv2/zeroconf#pure_robot" ${outputPath}`, (err) => {
        fs.unlinkSync(audioPath);
        if (err) return repondre("Hitilafu imetokea. Hakikisha ffmpeg imewekwa.");
        zk.sendMessage(dest, { audio: { url: outputPath }, mimetype: 'audio/mpeg', ptt: true }, { quoted: ms });
    });
});

zokou({ nomCom: "chipmunk", categorie: "Voice-Changer", reaction: "🐿️" }, async (dest, zk, commandeOptions) => {
    const { ms, msgRepondu, repondre } = commandeOptions;
    if (!msgRepondu || !msgRepondu.audioMessage) return repondre("Tafadhali tag voice note au audio.");

    repondre("Processing... 🐿️");
    const audioPath = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage);
    const outputPath = path.join(__dirname, `chip_${Date.now()}.mp3`);

    exec(`ffmpeg -i ${audioPath} -filter:a "atempo=0.7,asetrate=65100" ${outputPath}`, (err) => {
        fs.unlinkSync(audioPath);
        if (err) return repondre("Hitilafu imetokea.");
        zk.sendMessage(dest, { audio: { url: outputPath }, mimetype: 'audio/mpeg', ptt: true }, { quoted: ms });
    });
});

zokou({ nomCom: "fast", categorie: "Voice-Changer", reaction: "⚡" }, async (dest, zk, commandeOptions) => {
    const { ms, msgRepondu, repondre } = commandeOptions;
    if (!msgRepondu || !msgRepondu.audioMessage) return repondre("Tag audio ya kuiongezea kasi.");

    repondre("Inasindika kasi... ⚡");
    const audioPath = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage);
    const outputPath = path.join(__dirname, `fast_${Date.now()}.mp3`);

    exec(`ffmpeg -i ${audioPath} -filter:a "atempo=1.5" ${outputPath}`, (err) => {
        fs.unlinkSync(audioPath);
        if (err) return repondre("Hitilafu.");
        zk.sendMessage(dest, { audio: { url: outputPath }, mimetype: 'audio/mpeg', ptt: true }, { quoted: ms });
    });
});
