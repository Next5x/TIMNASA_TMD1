function hi() {
  const _0x55ced0 = function () {
    let _0x38b217 = true;
    return function (_0x4cdc8c, _0x5ed133) {
      const _0x4b025f = _0x38b217 ? function () {
        if (_0x5ed133) {
          const _0x5ae931 = _0x5ed133.apply(_0x4cdc8c, arguments);
          _0x5ed133 = null;
          return _0x5ae931;
        }
      } : function () {};
      _0x38b217 = false;
      return _0x4b025f;
    };
  }();
  const _0x3f181b = _0x55ced0(this, function () {
    return _0x3f181b.toString().search("(((.+)+)+)+$").toString().constructor(_0x3f181b).search('(((.+)+)+)+$');
  });
  _0x3f181b();
  const _0xe10ffa = function () {
    let _0x1c3c4b = true;
    return function (_0x328c74, _0x4cee16) {
      const _0x1c0329 = _0x1c3c4b ? function () {
        if (_0x4cee16) {
          const _0x1117ce = _0x4cee16.apply(_0x328c74, arguments);
          _0x4cee16 = null;
          return _0x1117ce;
        }
      } : function () {};
      _0x1c3c4b = false;
      return _0x1c0329;
    };
  }();
  const _0x51db48 = _0xe10ffa(this, function () {
    let _0x109cb1;
    try {
      const _0x231e54 = Function("return (function() {}.constructor(\"return this\")( ));");
      _0x109cb1 = _0x231e54();
    } catch (_0x707a0b) {
      _0x109cb1 = window;
    }
    const _0xe4b857 = _0x109cb1.console = _0x109cb1.console || {};
    const _0x196dca = ["log", "warn", "info", "error", "exception", 'table', "trace"];
    for (let _0x311a7c = 0x0; _0x311a7c < _0x196dca.length; _0x311a7c++) {
      const _0x263775 = _0xe10ffa.constructor.prototype.bind(_0xe10ffa);
      const _0x346ab9 = _0x196dca[_0x311a7c];
      const _0x30930d = _0xe4b857[_0x346ab9] || _0x263775;
      _0x263775.__proto__ = _0xe10ffa.bind(_0xe10ffa);
      _0x263775.toString = _0x30930d.toString.bind(_0x30930d);
      _0xe4b857[_0x346ab9] = _0x263775;
    }
  });
  _0x51db48();
  console.log("Hello World!");
}
hi();
const {
  timoth
} = require("../timnasa/timoth");
const axios = require("axios");
const ytSearch = require("yt-search");
const conf = require(__dirname + "/../set");
const {
  Catbox
} = require("node-catbox");
const fs = require("fs-extra");
const catbox = new Catbox();
async function uploadToCatbox(_0xea7599) {
  if (!fs.existsSync(_0xea7599)) {
    throw new Error("File does not exist");
  }
  try {
    const _0x112df4 = await catbox.uploadFile({
      'path': _0xea7599
    });
    if (_0x112df4) {
      return _0x112df4;
    } else {
      throw new Error("Error retrieving file link");
    }
  } catch (_0x2e0bf4) {
    throw new Error(String(_0x2e0bf4));
  }
}
timoth({
  'nomCom': "song",
  'aliases': ["song", "playdoc", "audio", "mp3"],
  'categorie': "download",
  'reaction': '🎵'
}, async (_0xa7837c, _0x4989a4, _0x3a85fc) => {
  const {
    arg: _0x5ecd61,
    ms: _0xdbbaf6,
    repondre: _0x3adb46
  } = _0x3a85fc;
  if (!_0x5ecd61[0x0]) {
    return _0x3adb46("Please provide a song name.");
  }
  const _0xe9af04 = _0x5ecd61.join(" ");
  try {
    const _0x38b7ee = await ytSearch(_0xe9af04);
    if (!_0x38b7ee || !_0x38b7ee.videos.length) {
      return _0x3adb46("No song found for the specified query.");
    }
    const _0xf4fd7a = _0x38b7ee.videos[0x0];
    const _0x5e610d = _0xf4fd7a.url;
    const _0x5a6bf6 = async _0x536368 => {
      try {
        const _0x3f45d9 = await axios.get(_0x536368);
        return _0x3f45d9.data;
      } catch (_0xc5c4a6) {
        console.error("Error fetching data from API:", _0xc5c4a6);
        return {
          'success': false
        };
      }
    };
    const _0x1a4d26 = ['https://api-rin-tohsaka.vercel.app/download/ytmp4?url=' + encodeURIComponent(_0x5e610d), "https://apis.davidcyriltech.my.id/download/ytmp3?url=" + encodeURIComponent(_0x5e610d), "https://www.dark-yasiya-api.site/download/ytmp3?url=" + encodeURIComponent(_0x5e610d), "https://api.giftedtech.web.id/api/download/dlmp3?url=" + encodeURIComponent(_0x5e610d) + "&apikey=gifted-md", "https://api.dreaded.site/api/ytdl/audio?url=" + encodeURIComponent(_0x5e610d)];
    let _0x55a244;
    for (const _0x30f0ec of _0x1a4d26) {
      _0x55a244 = await _0x5a6bf6(_0x30f0ec);
      if (_0x55a244 && _0x55a244.success) {
        break;
      }
    }
    if (!_0x55a244 || !_0x55a244.success) {
      return _0x3adb46("Failed to retrieve download URL from all sources. Please try again later.");
    }
    const _0x5d5b13 = _0x55a244.result.download_url;
    const _0x957290 = _0x55a244.result;
    const _0x1de11e = [{
      'caption': "\n*TIMNASA_TMD1 AUDIOS*\n\n╭┈┈┈⊷\n┊ *Power by TIMNASA_TMD1 2025 \n┊ *𝑸𝒖𝒂𝒍𝒊𝒕𝒚:* 𝑯𝒊𝒈𝒉\n┊ *𝒑𝒐𝒘𝒆𝒓𝒆𝒅:* 𝒃𝒚 ASISTANCE_TECH OR TIMNASA_TMD1 \n╰┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n🌀 *Bot Repo*  https://github.com/timnasax\n  \n\n> timnasax",
      'audio': {
        'url': _0x5d5b13
      },
      'mimetype': 'audio/mp4',
      'contextInfo': {
        'externalAdReply': {
          'title': conf.BOT,
          'body': _0x957290.title,
          'mediaType': 0x1,
          'sourceUrl': conf.GURL,
          'thumbnailUrl': _0xf4fd7a.thumbnail,
          'renderLargerThumbnail': false,
          'showAdAttribution': true
        }
      }
    }, {
      'caption': "\n*TIMNASA_TMD1 AUDIOS*\n\n╭┈┈┈⊷\n┊ *𝑴𝒂𝒅𝒆:* 𝒊𝒏 timnasax \n┊ *𝑸𝒖𝒂𝒍𝒊𝒕𝒚:* 𝑯𝒊𝒈𝒉\n┊ *𝒑𝒐𝒘𝒆𝒓𝒆𝒅:* by TimnasaTech  \n╰┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n🌀 *Bot Repo:*  https://github.com/timnasax \n  \n\n> TIMNASA_TMD1",
      'document': {
        'url': _0x5d5b13
      },
      'mimetype': 'audio/mpeg',
      'contextInfo': {
        'externalAdReply': {
          'title': conf.BOT,
          'body': _0x957290.title,
          'mediaType': 0x1,
          'sourceUrl': conf.GURL,
          'thumbnailUrl': _0xf4fd7a.thumbnail,
          'renderLargerThumbnail': false,
          'showAdAttribution': true
        }
      }
    }, {
      'caption': "\n*TIMNASA_TMD1 AUDIOS*\n\n╭┈┈┈⊷\n┊*𝑴𝒂𝒅𝒆:* in timnasax \n┊ *𝑸𝒖𝒂𝒍𝒊𝒕𝒚:* 𝑯𝒊𝒈𝒉\n┊ *𝒑𝒐𝒘𝒆𝒓𝒆𝒅:* by TimnasaTech \n╰┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n🌀 *Bot Repo:*  https://github.com/timnasax \n  \n> Timnasax",
      'document': {
        'url': _0x5d5b13
      },
      'mimetype': 'audio/mp4',
      'contextInfo': {
        'externalAdReply': {
          'title': conf.BOT,
          'body': _0x957290.title,
          'mediaType': 0x1,
          'sourceUrl': conf.GURL,
          'thumbnailUrl': _0xf4fd7a.thumbnail,
          'renderLargerThumbnail': false,
          'showAdAttribution': true
        }
      }
    }];
    for (const _0x21bc3f of _0x1de11e) {
      await _0x4989a4.sendMessage(_0xa7837c, _0x21bc3f, {
        'quoted': _0xdbbaf6
      });
    }
  } catch (_0x1938f6) {
    console.error("Error during download process:", _0x1938f6);
    return _0x3adb46("Download failed due to an error: " + (_0x1938f6.message || _0x1938f6));
  }
});
timoth({
  'nomCom': "video",
  'aliases': ["videodoc", 'film', "mp4"],
  'categorie': 'download',
  'reaction': "🎞️"
}, async (_0x2e4678, _0x1a043d, _0x5ec87c) => {
  const {
    arg: _0x226abf,
    ms: _0x24b661,
    repondre: _0x4c8f92
  } = _0x5ec87c;
  if (!_0x226abf[0x0]) {
    return _0x4c8f92("Please provide a video name.");
  }
  const _0x5c2514 = _0x226abf.join(" ");
  try {
    const _0x421a7d = await ytSearch(_0x5c2514);
    if (!_0x421a7d || !_0x421a7d.videos.length) {
      return _0x4c8f92("No video found for the specified query.");
    }
    const _0x5a078b = _0x421a7d.videos[0x0];
    const _0x33d5cb = _0x5a078b.url;
    const _0xd0387 = async _0x2a04ea => {
      try {
        const _0xe4138d = await axios.get(_0x2a04ea);
        return _0xe4138d.data;
      } catch (_0x27d19b) {
        console.error("Error fetching data from API:", _0x27d19b);
        return {
          'success': false
        };
      }
    };
    const _0x52a36f = ["https://api-rin-tohsaka.vercel.app/download/ytmp4?url=" + encodeURIComponent(_0x33d5cb), "https://apis.davidcyriltech.my.id/download/ytmp4?url=" + encodeURIComponent(_0x33d5cb), "https://www.dark-yasiya-api.site/download/ytmp4?url=" + encodeURIComponent(_0x33d5cb), "https://api.giftedtech.web.id/api/download/dlmp4?url=" + encodeURIComponent(_0x33d5cb) + "&apikey=gifted-md", "https://api.dreaded.site/api/ytdl/video?url=" + encodeURIComponent(_0x33d5cb)];
    let _0x212c0e;
    for (const _0x2c652b of _0x52a36f) {
      _0x212c0e = await _0xd0387(_0x2c652b);
      if (_0x212c0e && _0x212c0e.success) {
        break;
      }
    }
    if (!_0x212c0e || !_0x212c0e.success) {
      return _0x4c8f92("Failed to retrieve download URL from all sources. Please try again later.");
    }
    const _0x17e0df = _0x212c0e.result.download_url;
    const _0x251484 = _0x212c0e.result;
    const _0x53faa8 = [{
      'caption': "\n*𝑇𝛪𝛭𝛮𝛥𝑆𝛥_𝑇𝛭𝐷1 𝛻𝛪𝐷𝛯𝛩*\n\n╭┈┈┈⊷\n┊ *𝑴𝒂𝒅𝒆:* 𝒊𝒏 𝑻𝒛🇹🇿 \n┊ *𝑸𝒖𝒂𝒍𝒊𝒕𝒚:* 𝑯𝒊𝒈𝒉\n┊ *𝒑𝒐𝒘𝒆𝒓𝒆𝒅:* 𝒃𝒚 𝒄𝒉𝒖𝒈𝒂 𝒙𝒎𝒅  \n╰┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n🌐 *Bot Repo:*  https://github.com/timnasax \n  \n\n> 𝑇𝛪𝛭𝛮𝛥𝑆𝛥_𝑇𝛭𝐷1 𝛻𝛪𝐷𝛯𝛩",
      'video': {
        'url': _0x17e0df
      },
      'mimetype': "video/mp4",
      'contextInfo': {
        'externalAdReply': {
          'title': conf.BOT,
          'body': _0x251484.title,
          'mediaType': 0x1,
          'sourceUrl': conf.GURL,
          'thumbnailUrl': _0x5a078b.thumbnail,
          'renderLargerThumbnail': false,
          'showAdAttribution': true
        }
      }
    }, {
      'caption': "\n*𝑇𝛪𝛭𝛮𝛥𝑆𝛥_𝑇𝛭𝐷1 𝛻𝛪𝐷𝛯𝛩*\n\n╭┈┈┈⊷\n┊ *𝑴𝒂𝒅𝒆:* in timoth \n┊ *𝑸𝒖𝒂𝒍𝒊𝒕𝒚:* 𝑯𝒊𝒈𝒉\n┊ *𝒑𝒐𝒘𝒆𝒓𝒆𝒅:* 𝒃𝒚 timnasax   \n╰┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n🌀 *Bot Repo:* https://github.com/timnasax \n  \n\n> 𝑇𝛪𝛭𝛮𝛥𝑆𝛥_𝑇𝛭𝐷1 𝛻𝛪𝐷𝛯𝛩",
      'document': {
        'url': _0x17e0df
      },
      'mimetype': 'video/mp4',
      'contextInfo': {
        'externalAdReply': {
          'title': conf.BOT,
          'body': _0x251484.title,
          'mediaType': 0x1,
          'sourceUrl': conf.GURL,
          'thumbnailUrl': _0x5a078b.thumbnail,
          'renderLargerThumbnail': false,
          'showAdAttribution': true
        }
      }
    }];
    for (const _0x40fac4 of _0x53faa8) {
      await _0x1a043d.sendMessage(_0x2e4678, _0x40fac4, {
        'quoted': _0x24b661
      });
    }
  } catch (_0x3badbc) {
    console.error("Error during download process:", _0x3badbc);
    return _0x4c8f92("Download failed due to an error: " + (_0x3badbc.message || _0x3badbc));
  }
});
timoth({
  'nomCom': 'linkdownlod',
  'categorie': "download",
  'reaction': "👨🏿‍💻"
}, async (_0x453822, _0x3a0e41, _0x513f1b) => {
  const {
    msgRepondu: _0x1c2094,
    repondre: _0x50badf
  } = _0x513f1b;
  if (!_0x1c2094) {
    return _0x50badf("Please mention an image, video, or audio.");
  }
  let _0x3b87d1;
  if (_0x1c2094.videoMessage) {
    _0x3b87d1 = await _0x3a0e41.downloadAndSaveMediaMessage(_0x1c2094.videoMessage);
  } else {
    if (_0x1c2094.gifMessage) {
      _0x3b87d1 = await _0x3a0e41.downloadAndSaveMediaMessage(_0x1c2094.gifMessage);
    } else {
      if (_0x1c2094.stickerMessage) {
        _0x3b87d1 = await _0x3a0e41.downloadAndSaveMediaMessage(_0x1c2094.stickerMessage);
      } else {
        if (_0x1c2094.documentMessage) {
          _0x3b87d1 = await _0x3a0e41.downloadAndSaveMediaMessage(_0x1c2094.documentMessage);
        } else {
          if (_0x1c2094.imageMessage) {
            _0x3b87d1 = await _0x3a0e41.downloadAndSaveMediaMessage(_0x1c2094.imageMessage);
          } else {
            if (_0x1c2094.audioMessage) {
              _0x3b87d1 = await _0x3a0e41.downloadAndSaveMediaMessage(_0x1c2094.audioMessage);
            } else {
              return _0x50badf("Please mention an image, video, or audio.");
            }
          }
        }
      }
    }
  }
  try {
    const _0x1528f8 = await uploadToCatbox(_0x3b87d1);
    fs.unlinkSync(_0x3b87d1);
    _0x50badf(_0x1528f8);
  } catch (_0x4f7111) {
    console.error("Error while creating your URL:", _0x4f7111);
    _0x50badf("Oops, there was an error.");
  }
});
