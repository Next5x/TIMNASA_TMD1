const { timoth } = require("../timnasa/timoth")
//const { getGroupe } = require("../luckydatabase/groupe")
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const {ajouterOuMettreAJourJid,mettreAJourAction,verifierEtatJid} = require("../data/antilien")
const {atbajouterOuMettreAJourJid,atbverifierEtatJid} = require("../data/antibot")
const { search, download } = require("aptoide-scraper");
const fs = require("fs-extra");
const conf = require("../set");
const { default: axios } = require('axios');
const {ajouterUtilisateurAvecWarnCount , getWarnCountByJID , resetWarnCountByJID} = require('../data/warn')
const s = require("../set")
//const { uploadImageToImgur } = require('../fredi/imgur');

timoth({
  nomCom: "mygroups",
  categorie: "User",
  reaction: "💿"
}, async (senn, zk, commandeOptions) => {
  const { repondre } = commandeOptions;

  try {
    const getGroupzs = await zk.groupFetchAllParticipating();
    const groupzs = Object.entries(getGroupzs).map(entry => entry[1]);
    const anaa = groupzs.map(v => v.id);
    let jackhuh = `*GROUPS AM IN*\n\n`;

    repondre(`You are currently in ${anaa.length} groups, Dullah Md will send that list in a moment...`);

    for (const i of anaa) {
      const metadat = await zk.groupMetadata(i);
      jackhuh += `*GROUP NAME:* ${metadat.subject}\n`;
      jackhuh += `*MEMBERS:* ${metadat.participants.length}\n`;
      jackhuh += `*GROUP ID:* ${i}\n\n`;
    }
    
    await repondre(jackhuh);
  } catch (error) {
    console.error("Error fetching groups:", error);
    repondre("An error occurred while fetching groups.");
  }
});

const fetchAPI = async (url, repondre) => {
  try {
    const response = await axios.get(url);
    await repondre(response.data.result);
  } catch (error) {
    console.error("Error fetching data:", error);
    repondre("An error occurred while fetching data.");
  }
};

timoth({
  nomCom: "flirt",
  reaction: '😁',
  categorie: "FUN"
}, async (client, user, options) => {
  const { repondre } = options;
  await fetchAPI("https://shizoapi.onrender.com/api/texts/flirt?apikey=shizo", repondre);
});

timoth({
  nomCom: "pickupline",
  reaction: '😁',
  categorie: "FUN"
}, async (client, user, options) => {
  const { repondre } = options;
  await fetchAPI("https://api.popcat.xyz/pickuplines", repondre);
});

timoth({
  nomCom: "yomama😂",
  reaction: '😁',
  categorie: "FUN"
}, async (client, user, options) => {
  const { repondre } = options;
  await fetchAPI("https://yomamaindra.onrender.com/jokes", repondre);
});

const generateImage = async (messageId, sender, prompt, category) => {
  try {
    const imageUrl = `https://www.noobs-api.000.pe/dipto/${category}?prompt=${encodeURIComponent(prompt)}`;

    await sender.sendMessage(messageId, {
      image: {
        url: imageUrl
      },
      caption: "*ROLE by Dullah Md*"
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return "Oops, an error occurred while processing your request.";
  }
};

const imageCommands = [
  { nomCom: "meta", category: "meta" },
  { nomCom: "genix", category: "genix" },
  { nomCom: "sdxl", category: "sdxl" },
  { nomCom: "monster", category: "monster" },
  { nomCom: "midjourney", category: "mj" },
  { nomCom: "pixart", category: "pixart" }
];

imageCommands.forEach(({ nomCom, category }) => {
  timoth({
    nomCom,
    reaction: '📡',
    categorie: 'META-AI'
  }, async (messageId, sender, { repondre, arg }) => {
    if (!arg || arg.length === 0) {
      return repondre("Please enter the necessary information to generate the image.");
    }

    const query = arg.join(" ");
    await generateImage(messageId, sender, query, category);
  });
});
