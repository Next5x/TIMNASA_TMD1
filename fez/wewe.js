const axios = require('axios');
const fs = require('fs');
const { timoth } = require("../timnasa/timoth");
const { writeFile } = require('fs/promises')

// Commande waifu
timoth({
  nomCom: "batakos",
  categorie: "ximega",
  reaction: "😏"
},
async (origineMessage, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const url = 'https://api.waifu.pics/sfw/waifu'; // Remplacez avec le lien réel de l'API waifu.pics

  try {
    
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      zk.sendMessage(origineMessage, { image: { url: imageUrl } }, { quoted: ms });
    }
  } catch (error) {
    repondre('Error occurred while retrieving the data. :', error);
  }
});

// Commande neko
timoth({
  nomCom: "teko",
  categorie: "ximega",
  reaction: "😺"
},
async (origineMessage, zk, commandeOptions) => {

  const { repondre, ms } = commandeOptions;

  const url = 'https://api.waifu.pics/sfw/neko'; // Remplacez avec le lien réel de l'API waifu.pics ou une autre API de nekos

  try {
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      zk.sendMessage(origineMessage, { image: { url: imageUrl } }, { quoted: ms });
    }
  } catch (error) {
    repondre('Error occurred while retrieving the data. :', error);
  }
});

// Commande shinobu
timoth({
  nomCom: "nobo",
  categorie: "ximega",
  reaction: "🦋"
},
async (origineMessage, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const url = 'https://api.waifu.pics/sfw/shinobu'; // Remplacez avec le lien réel de l'API waifu.pics ou une autre API avec des images de Shinobu

  try {
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      zk.sendMessage(origineMessage, { image: { url: imageUrl } }, { quoted: ms });
    }
  } catch (error) {
    repondre('Error occurred while retrieving the data. :', error);
  }
});

// Commande megumin
timoth({
  nomCom: "meguminu",
  categorie: "ximega",
  reaction: "💥"
},
async (origineMessage, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const url = 'https://api.waifu.pics/sfw/megumin'; // Remplacez avec le lien réel de l'API waifu.pics ou une autre API avec des images de Megumin

  try {
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      zk.sendMessage(origineMessage,{ image: { url: imageUrl } }, { quoted: ms });
    }
  } catch (error) {
    repondre('Error occurred while retrieving the data. :', error);
  }
});



timoth({
  nomCom: "cosplay",
  categorie: "ximega",
  reaction: "😏"
},
async (origineMessage, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;



  try {
    for (let i = 0; i < 5; i++) {
      let url = 'https://fantox-cosplay-api.onrender.com/'
      
   const response = await   axios.get(url, { responseType: 'arraybuffer' })

  

  const image = response.data;

   await writeFile('./cosplay.jpg', image)
      zk.sendMessage(origineMessage,{image : {url : `./cosplay.jpg`}},{quoted :ms}) }
  
  } catch (e) {
    repondre("je reçois malheureusement une erreur : " + e);
  }
});


timoth({nomCom:"couplep",categorie: "ximega",reaction : "💞"},async(dest,zk,commandeOptions)=>{ const {repondre , ms} = commandeOptions;
    let api = 'https://smiling-hosiery-bear.cyclic.app/weeb/couplepp'
  try {
     repondre('she/he dont love you :)')
 const result = await axios.get(api)
  

    zk.sendMessage(dest, { image: { url: result.data.male }, caption: `For Man` }, { quoted: ms })
        zk.sendMessage(dest, { image: { url: result.data.female }, caption: `_For woman_` }, { quoted: ms })
    
  } catch (e) { repondre(e)}                                                                                        
  
}
      )
