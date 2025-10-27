const {
  timoth
} = require(__dirname + '/../timnasa/timoth');
const moment = require("moment-timezone");
const set = require(__dirname + '/../set');
moment.tz.setDefault('' + set.TZ);
timoth({
  nomCom: "aviator",
  aliases: ["testing"],
  categorie: "system",
  reaction: "🍂"
}, async (dest, zk, commandeOptions) => {
  const { ms } = commandeOptions;

  // Array of sound file URLs
  const audioFiles = [
    'https://files.catbox.moe/hpwsi2.mp3',
    'https://files.catbox.moe/xci982.mp3',
    'https://files.catbox.moe/utbujd.mp3',
    'https://files.catbox.moe/w2j17k.m4a',
    'https://files.catbox.moe/851skv.m4a',
    'https://files.catbox.moe/qnhtbu.m4a',
    'https://files.catbox.moe/lb0x7w.mp3',
    'https://files.catbox.moe/efmcxm.mp3',
    'https://files.catbox.moe/wdap4t.mp3',
    'https://files.catbox.moe/26oeeh.mp3',
    'https://files.catbox.moe/a1sh4u.mp3',
    'https://files.catbox.moe/vuuvwn.m4a',
    'https://files.catbox.moe/wx8q6h.mp3',
    'https://files.catbox.moe/uj8fps.m4a',
    'https://files.catbox.moe/dc88bx.m4a',
    'https://files.catbox.moe/tn32z0.m4a'
 },
      'mimetype': "audio/mp4",
      'ptt': true,
      'contextInfo': {
        'isForwarded': true,
        'forwardedNewsletterMessageInfo': {
          'newsletterJid': "120363332512801418@newsletter",
          'newsletterName': "╭➤TIMNASA-TMD",
          'serverMessageId': 0x8f
        },
        'forwardingScore': 0x3e7,
        'externalAdReply': {
          'title': "TIMNASA-TMD",
          'body': "⚪ Pong: " + _0x4950ba + "ms\n📅 *Date:* " + _0x4c687e + "\n⏰ *Time:* " + _0xb5466b,
          'thumbnailUrl': "https://files.catbox.moe/7n8oyx.jpg",
          'mediaType': 0x1,
          'renderSmallThumbnail': true
        }
      }
    }, {
      'quoted': _0x5d2f0c
    });
  } catch (_0x1149fe) {
    console.log("❌ Ping Command Error: " + _0x1149fe);
    repondre("❌ Error: " + _0x1149fe);
  }
});
