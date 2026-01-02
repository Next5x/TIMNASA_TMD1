"use strict";
const { zokou } = require('../framework/zokou');

// --- DATABASE: RIDDLES ---
const devinettes = [
  { question: "I can fly without wings, who am I?", reponse: "The weather/Cloud" },
  { question: "I'm always hungry, the more I eat, the fatter I become. Who am I?", reponse: "A fire/Black hole" },
  { question: "I have towns, but no houses. I have mountains, but no trees. I have water, but no fish. Who am I?", reponse: "A map" },
  { question: "I am the beginning of the end, the end of every place. Who am I?", reponse: "The letter 'E'" },
  { question: "The hotter I am, the colder I become. Who am I?", reponse: "Coffee" },
  { question: "I start at night and finish in the morning. Who am I?", reponse: "The letter 'N'" }
];

// --- DATABASE: QUIZ ---
const quizzes = [
  { q: "What is the capital city of France?", a: "Paris", options: ["London", "Paris", "Berlin", "Rome"] },
  { q: "Which planet is known as the Red Planet?", a: "Mars", options: ["Venus", "Mars", "Jupiter", "Saturn"] },
  { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci", options: ["Picasso", "Van Gogh", "Leonardo da Vinci", "Michelangelo"] },
  { q: "What is the largest ocean on Earth?", a: "Pacific Ocean", options: ["Atlantic", "Indian", "Pacific Ocean", "Arctic"] }
];

// --- DATABASE: TRUTH OR DARE ---
const truths = [
  "What is your biggest fear?",
  "What is the most embarrassing thing you've ever done?",
  "Who is your secret crush?",
  "Have you ever lied to your best friend?",
  "What is one thing you would change about yourself?"
];

const dares = [
  "Send a screenshot of your search history to the group.",
  "Record yourself singing a song and post it here.",
  "Send 'I love you' to the 3rd person on your recent chat list.",
  "Do 20 pushups and send a video (or just say you did it!).",
  "Change your WhatsApp profile picture to a funny meme for 1 hour."
];

// --- GLOBAL SETTINGS ---
const channelJid = "120363413554978773@newsletter";
const thumb = "https://files.catbox.moe/zm113g.jpg";

const contextInfo = (name) => ({
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: { 
    newsletterJid: channelJid, 
    newsletterName: `𝚃𝙸𝙼𝙽𝙰𝚂𝙰 𝚃𝙼𝙳 ${name}` 
  }
});

// ================== RIDDLE COMMAND ==================
zokou({ nomCom: "riddle", categorie: "Games", reaction: "🧩" }, async (dest, zk, commandeOptions) => {
  const { ms, auteurMessage } = commandeOptions;
  const devinette = devinettes[Math.floor(Math.random() * devinettes.length)];

  await zk.sendMessage(dest, {
    text: `Hello @${auteurMessage.split('@')[0]}! 🧩\n\n*RIDDLE:* ${devinette.question}\n\n⏱️ _Answer in 30 seconds!_`,
    mentions: [auteurMessage],
    contextInfo: contextInfo("𝚁𝙸𝙳𝙳𝙻𝙴")
  }, { quoted: ms });

  await delay(30000);
  await zk.sendMessage(dest, { text: `🔔 *TIME IS UP!*\n\nThe answer was: *${devinette.reponse}*` }, { quoted: ms });
});

// ================== QUIZ COMMAND ==================
zokou({ nomCom: "quiz", categorie: "Games", reaction: "💡" }, async (dest, zk, commandeOptions) => {
  const { ms, auteurMessage } = commandeOptions;
  const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
  let optionsText = quiz.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n');

  await zk.sendMessage(dest, {
    text: `Hello @${auteurMessage.split('@')[0]}! 💡\n\n*QUESTION:* ${quiz.q}\n\n${optionsText}\n\n⏱️ _Answer in 30 seconds!_`,
    mentions: [auteurMessage],
    contextInfo: contextInfo("𝚀𝚄𝙸𝚉")
  }, { quoted: ms });

  await delay(30000);
  await zk.sendMessage(dest, { text: `🔔 *QUIZ RESULT*\n\nThe correct answer was: *${quiz.a}*` }, { quoted: ms });
});

// ================== TRUTH OR DARE COMMAND ==================
zokou({ nomCom: "tude", aliases: ["truth", "dare"], categorie: "Games", reaction: "🎭" }, async (dest, zk, commandeOptions) => {
  const { ms, auteurMessage, arg } = commandeOptions;
  
  const type = arg[0] ? arg[0].toLowerCase() : (Math.random() > 0.5 ? "truth" : "dare");
  const choice = type === "truth" ? truths[Math.floor(Math.random() * truths.length)] : dares[Math.floor(Math.random() * dares.length)];

  const msg = `🎭 *TRUTH OR DARE* 🎭\n\n*Player:* @${auteurMessage.split('@')[0]}\n*Type:* ${type.toUpperCase()}\n\n*Challenge:* ${choice}`;

  await zk.sendMessage(dest, {
    text: msg,
    mentions: [auteurMessage],
    contextInfo: {
      ...contextInfo("𝚃𝚄𝙳𝙴"),
      externalAdReply: {
        title: `𝚃𝙸𝙼𝙽𝙰𝚂𝙰 𝚃𝙼𝙳 ${type.toUpperCase()}`,
        body: "Are you brave enough?",
        thumbnailUrl: thumb,
        sourceUrl: "https://whatsapp.com/channel/0029VaF39946H4YhS6u8Yt3q",
        mediaType: 1
      }
    }
  }, { quoted: ms });
});

// --- HELPER FUNCTION ---
function delay(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
