"use strict";

const { zokou } = require('../framework/zokou');
const googleTTS = require('google-tts-api');
const { franc } = require('franc');
const axios = require('axios');

// Mpangilio wa lugha kwa ajili ya Google TTS
const langMap = {
    'afr': 'af', 'ara': 'ar', 'ben': 'bn', 'bos': 'bs', 'bul': 'bg', 
    'cmn': 'zh-CN', 'eng': 'en', 'fra': 'fr', 'deu': 'de', 'hin': 'hi', 
    'ind': 'id', 'ita': 'it', 'jpn': 'ja', 'kor': 'ko', 'por': 'pt', 
    'rus': 'ru', 'spa': 'es', 'swa': 'sw', 'tur': 'tr', 'vie': 'vi', 'zul': 'zu'
};

zokou({
  nomCom: "voicegpt",
  categorie: "AI",
  reaction: "🎙️"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;
  const channelJid = "120363413554978773@newsletter";

  if (!arg[0]) return repondre("Please provide a question for Voice GPT!");

  const q = arg.join(' ');

  try {
    // 1. Pata jibu kutoka kwa AI
    const apiUrl = `https://api.siputzx.my.id/api/ai/gpt3?prompt=You%20are%20a%20helpful%20AI%20assistant&content=${encodeURIComponent(q)}`;
    const response = await axios.get(apiUrl);
    
    // Angalia kama data ipo (API za siputzx mara nyingi hutumia response.data.data)
    const datas = response.data.data || response.data.result || response.data;

    if (!datas) return repondre("I couldn't get a response from AI.");

    // 2. Tambua lugha ya jibu
    let detectedLang = franc(datas);
    let voiceLanguage = langMap[detectedLang] || 'en';

    // 3. Badilisha maandishi kuwa URLs za Audio
    const audioUrls = googleTTS.getAllAudioUrls(datas, {
      lang: voiceLanguage,
      slow: false,
      host: 'https://translate.google.com'
    });

    // 4. Tuma audio kwa mtumiaji
    for (const audio of audioUrls) {
      await zk.sendMessage(dest, { 
        audio: { url: audio.url }, 
        mimetype: 'audio/mpeg', 
        ptt: true,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: channelJid,
            newsletterName: "𝚃𝙸𝙼𝙽𝙰𝚂𝙰 𝚃𝙼𝙳 𝙰𝙸 𝚅𝙾𝙸𝙲𝙴",
            serverMessageId: 1
          }
        }
      }, { quoted: ms });
    }

  } catch (error) {
    console.error("Error in VoiceGPT:", error);
    repondre("🥵 An error occurred while processing Voice GPT.");
  }
});
