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

// Path to the JSON file storing hentai data
const filePath = path.join(__dirname, '../tmd/hentai.json');

// Load data from JSON file
function loadHentaiData() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {}; // Default if file doesn't exist
  }
}

// Save data to JSON file
function saveHentaiData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Create default file if it doesn't exist
if (!fs.existsSync(filePath)) {
  saveHentaiData({});
}

// Function to add a group to the hentai list
async function addToHentaiList(groupeJid) {
  try {
    const data = loadHentaiData();
    
    // Add the group if it doesn't already exist
    if (!data[groupeJid]) {
      data[groupeJid] = true;
      saveHentaiData(data);
      console.log(`Group JID ${groupeJid} has been added to the hentai list.`);
    } else {
      console.log(`Group JID ${groupeJid} is already in the hentai list.`);
    }
  } catch (error) {
    console.error("Error while adding the group to the hentai list:", error);
  }
}

// Function to check if a group is in the hentai list
async function checkFromHentaiList(groupeJid) {
  try {
    const data = loadHentaiData();
    return !!data[groupeJid];
  } catch (error) {
    console.error("Error while checking the group's presence in the hentai list:", error);
    return false;
  }
}

// Function to remove a group from the hentai list
async function removeFromHentaiList(groupeJid) {
  try {
    const data = loadHentaiData();
    
    if (data[groupeJid]) {
      delete data[groupeJid];
      saveHentaiData(data);
      console.log(`Group JID ${groupeJid} has been removed from the hentai list.`);
    } else {
      console.log(`Group JID ${groupeJid} is not in the hentai list.`);
    }
  } catch (error) {
    console.error("Error while removing the group from the hentai list:", error);
  }
}

module.exports = {
  addToHentaiList,
  checkFromHentaiList,
  removeFromHentaiList,
};



//  **FrediEzra Tech info 2025 | all right reserved