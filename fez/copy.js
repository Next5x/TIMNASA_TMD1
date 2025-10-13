const {
 timoth
} = require("../timnasa/timoth");
const axios = require("axios");
const ytSearch = require("yt-search");
timoth({
  'nomCom': "play",
  'aliases': ["song", "playdoc", "audio", "mp3"],
  'categorie': "download",
  'reaction': '🫡'
}, async (_0x4f73c2, _0x49176e, _0x59257b) => {
  const {
    arg: _0x2b3643,
    ms: _0x344fe3,
    userJid: _0x5a7bc5
  } = _0x59257b;
  try {
    await _0x49176e.sendMessage(_0x4f73c2, {
      'text': "Searching for your song..."
    });
    console.log("Searching for song...");
    if (!_0x2b3643) {
      console.log("No argument provided");
      return _0x49176e.sendMessage(_0x4f73c2, {
        'text': "Please provide a song name or keyword."
      });
    }
    console.log("Argument provided:", _0x2b3643);
    const _0x4f9bbd = _0x2b3643.join(" ");
    console.log("Query:", _0x4f9bbd);
    console.log("[PLAY] Searching YT for:", _0x4f9bbd);
    const _0x3141fa = await ytSearch(_0x4f9bbd);
    console.log("Search result:", _0x3141fa);
    if (!_0x3141fa || !_0x3141fa.videos || !_0x3141fa.videos[0]) {
      console.log("No video found");
      return _0x49176e.sendMessage(_0x4f73c2, {
        'text': "No results found for your query."
      });
    }
    const _0x46844d = _0x3141fa.videos[0];
    console.log("Video found:", _0x46844d);
    const _0x1e8378 = _0x46844d.title.replace(/[\\/:*?"<>|]/g, '');
    const _0x43d6c9 = _0x1e8378 + ".mp3";
    const _0x307a2c = "https://noobs-api.top/dipto/ytDl3?link=" + encodeURIComponent(_0x46844d.videoId) + "&format=mp3";
    console.log("API URL:", _0x307a2c);
    try {
      const _0x476227 = await axios.get(_0x307a2c);
      if (_0x476227.status !== 200) {
        console.log("API request failed with status code:", _0x476227.status);
        await _0x49176e.sendMessage(_0x4f73c2, {
          'text': "Failed to retrieve the MP3 download link. Please try again later."
        });
        return;
      }
      const _0x2db734 = _0x476227.data;
      if (!_0x2db734.downloadLink) {
        console.log("No download link found");
        return _0x49176e.sendMessage(_0x4f73c2, {
          'text': "Failed to retrieve the MP3 download link."
        });
      }
      const _0xb2bbb2 = {
        'image': {
          'url': _0x46844d.thumbnail
        },
        'caption': "*TIMNASA_TMD1 YouTube*\n\n╭──────𝚻𝚰𝚳𝚴𝚫𝐒𝚫_𝚻𝚳𝐃1 𝐒𝚯𝚴𝐆─────────◆\n" + ("│⿻ *Title:* " + _0x46844d.title + "\n") + ("│⿻ *Duration:* " + _0x46844d.timestamp + "\n") + ("│⿻ *Views:* " + _0x46844d.views.toLocaleString() + "\n") + ("│⿻ *Uploaded:* " + _0x46844d.ago + "\n") + ("│⿻ *Channel:* " + _0x46844d.author.name + "\n") + "╰────────────────◆\n\n" + ("🔗 " + _0x46844d.url)
      };
      await _0x49176e.sendMessage(_0x4f73c2, _0xb2bbb2);
      console.log("Message sent with image and caption");
      await _0x49176e.sendMessage(_0x4f73c2, {
        'audio': {
          'url': _0x2db734.downloadLink
        },
        'mimetype': "audio/mpeg",
        'fileName': _0x43d6c9,
        'caption': "𝚻𝚰𝚳𝚴𝚫𝐒𝚫_𝚻𝚳𝐃1 𝐒𝚯𝚴𝐆"
      });
      console.log("Audio file sent");
    } catch (_0x5ac6e8) {
      console.error("[PLAY] API Error:", _0x5ac6e8);
      if (_0x5ac6e8.response && _0x5ac6e8.response.status === 500) {
        await _0x49176e.sendMessage(_0x4f73c2, {
          'text': "The API is currently experiencing issues. Please try again later."
        });
      } else {
        await _0x49176e.sendMessage(_0x4f73c2, {
          'text': "An error occurred: " + _0x5ac6e8.message
        });
      }
    }
  } catch (_0x48848e) {
    console.error("[PLAY] Error:", _0x48848e);
    await _0x49176e.sendMessage(_0x4f73c2, {
      'text': "An error occurred: " + _0x48848e.message
    });
  }
});
