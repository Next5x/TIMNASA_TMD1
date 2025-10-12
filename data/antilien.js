/*  +++Official frediezra tech info base vision 3.0.0 npm +++ */
// Facebook @frediezra
// Instagram @FrediEzra
// Threads @FrediEzra
// X (tweeter) @FrediEzra
// LinkedIn @FrediEzra
// YouTube @freeonlinetvT1
// github @Fred1e, @mr-X-force, @devfreetec
// WhatsApp @255752593977
// telegram t.me/FrediEzraTechInfo 
// WhatsApp channel 
// Website fredietech-website.vercel.com
// Enjoy Movies update fredi-movies-library.vercel.app
// WE AVAILABLE ALL TIME TO RECEIVE YOU REQUEST FOR ANY DEV OR UPCOMING DEV IN WHATSAPP BOTS
// **bot start npm read fredi.server.com root @Lucky-md-xforce : "^3.0.0" ***//
// prepare everything pass lucky
// frediete loaded updates 
// bot name is LUCKY MD XFORCE 


const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../tmd/antilien.json');

// Load data from JSON file
function loadAntilienData() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {}; // If file doesn't exist, start with an empty object
  }
}

// Save data to JSON file
function saveAntilienData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

const antilienData = loadAntilienData();

async function ajouterOuMettreAJourJid(jid, etat) {
  antilienData[jid] = { etat, action: antilienData[jid]?.action || 'supp' };
  saveAntilienData(antilienData);
  console.log(`JID ${jid} added or updated in the 'antilien' table.`);
}

async function mettreAJourAction(jid, action) {
  if (antilienData[jid]) {
    antilienData[jid].action = action;
  } else {
    antilienData[jid] = { etat: 'non', action };
  }
  saveAntilienData(antilienData);
  console.log(`Action updated for JID ${jid} in the 'antilien' table.`);
}

async function verifierEtatJid(jid) {
  return antilienData[jid]?.etat === 'oui';
}

async function recupererActionJid(jid) {
  return antilienData[jid]?.action || 'supp';
}

module.exports = {
  ajouterOuMettreAJourJid,
  mettreAJourAction,
  verifierEtatJid,
  recupererActionJid,
};


//  **FrediEzra Tech info 2025 | all right reserved 