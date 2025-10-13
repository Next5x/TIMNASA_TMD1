const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

// ... Msimbo wako mwingine hapa ...

timoth({
  nomCom: "play2",
  aliases: ["song", "playdoc", "audio", "mp3"],
  categorie: "download",
  reaction: "🎧"
}, async (dest, zk, commandOptions) => {
  const { arg, ms, repondre } = commandOptions;

  if (!arg[0]) {
    return repondre("Tafadhali toa jina la wimbo.");
  }

  const query = arg.join(" ");

  try {
    const searchResults = await ytSearch(query);
    if (!searchResults || !searchResults.videos.length) {
      return repondre('Hakuna wimbo uliopatikana.');
    }

    const firstVideo = searchResults.videos[0];
    const videoUrl = firstVideo.url;

    // Kuanza kupakua wimbo
    repondre("Pakua wimbo unaendelea, tafadhali subiri...");

    const audioStream = ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' });
    const outputFilePath = path.join(__dirname, `${firstVideo.videoId}.mp3`);

    await new Promise((resolve, reject) => {
      ffmpeg(audioStream)
        .audioBitrate(128)
        .save(outputFilePath)
        .on('end', () => resolve())
        .on('error', (err) => reject(new Error("Shida wakati wa kubadilisha faili.")));
    });

    const stats = fs.statSync(outputFilePath);
    if (stats.size > 200 * 1024 * 1024) { // 200 MB limit for WhatsApp
      fs.unlinkSync(outputFilePath); // Futa faili kubwa
      return repondre("Wimbo ni mkubwa sana, tafadhali jaribu wimbo mwingine.");
    }
    
    // Tuma wimbo kwa kutumia sendDocument
    await zk.sendMessage(dest, {
        document: fs.readFileSync(outputFilePath),
        mimetype: 'audio/mpeg',
        fileName: `${firstVideo.title}.mp3`,
        caption: `🎶 *Wimbo umetolewa na:*\n\n*Jina:* ${firstVideo.title}\n*Imechapishwa:* ${firstVideo.ago}\n*Muda:* ${firstVideo.timestamp}\n\n*Tunduma - Tanzania*\n> _Timnasa-TMD_`,
        contextInfo: {
            externalAdReply: {
                title: conf.BOT,
                body: firstVideo.title,
                mediaType: 1,
                sourceUrl: videoUrl,
                thumbnailUrl: firstVideo.thumbnail,
                renderLargerThumbnail: false,
                showAdAttribution: true,
            },
        },
    }, { quoted: ms });

    // Futa faili ya muziki baada ya kutumwa
    fs.unlinkSync(outputFilePath);

  } catch (error) {
    console.error('Kuna hitilafu wakati wa mchakato:', error);
    return repondre(`Upakuaji umeshindwa kwa sababu ya hitilafu: ${error.message || error}`);
  }
});



const { timoth } = require("../timnasa/0");
// const { getGroupe } = require("../bdd/groupe"); 
const conf = require("../set");

timoth({
    nomCom: "opentime",
    reaction: "😌",
    categorie: "group"
}, async (dest, zk, context) => {
    var { repondre, arg, verifGroupe, verifAdmin } = context;
    try {
        if (!verifGroupe) return repondre('This command is meant for groups.');
        if (!verifAdmin) return repondre('This command is meant for admins.');

        let timer;
        const args = arg.split(' '); // Ensure args are split if input is like '10 second'

        if (args[1] === 'second') {
            timer = args[0] * 1000;
        } else if (args[1] === 'minute') {
            timer = args[0] * 60000;
        } else if (args[1] === 'hour') {
            timer = args[0] * 3600000;
        } else if (args[1] === 'day') {
            timer = args[0] * 86400000;
        } else {
            return repondre('Please select a valid time unit: second, minute, hour, or day.\nExample: 10 second');
        }

        repondre(`Open time of ${arg} starting from now...`);

        setTimeout(() => {
            const openMessage = `*⏰ Open Time 🗿*\nGroup was opened by the bot. Now all members can send messages.`;
            zk.groupSettingUpdate(dest, 'not_announcement');
            repondre(openMessage);
        }, timer);

        await zk.sendMessage(dest, { react: { text: '✅', key: zk.key } });

    } catch (e) {
        console.error(e);
        repondre('An error occurred!');
    }
});

timoth({
    nomCom: "closetime",
    reaction: "😌",
    categorie: "group"
}, async (dest, zk, context) => {
    var { repondre, arg, verifGroupe, verifAdmin } = context;
    try {
        if (!verifGroupe) return repondre('This command is meant for groups.');
        if (!verifAdmin) return repondre('This command is meant for admins.');

        let timer;
        const args = arg.split(' '); // Ensure args are split if input is like '10 second'

        if (args[1] === 'second') {
            timer = args[0] * 1000;
        } else if (args[1] === 'minute') {
            timer = args[0] * 60000;
        } else if (args[1] === 'hour') {
            timer = args[0] * 3600000;
        } else if (args[1] === 'day') {
            timer = args[0] * 86400000;
        } else {
            return repondre('Please select a valid time unit: second, minute, hour, or day.\nExample: 10 second');
        }

        repondre(`Close time of ${arg} starting from now...`);

        setTimeout(() => {
            const closeMessage = `*⏰ Close Time 🗿*\nThe group has been successfully closed.`;
            zk.groupSettingUpdate(dest, 'announcement');
            repondre(closeMessage);
        }, timer);

        await zk.sendMessage(dest, { react: { text: '✅', key: zk.key } });

    } catch (e) {
        console.error(e);
        repondre('An error occurred!');
    }
});
