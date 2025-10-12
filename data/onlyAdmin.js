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
const filePath = path.join(__dirname, '../tmd/onlyAdmin.json');

// Load data from JSON file
function loadOnlyAdminData() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return new Set(JSON.parse(data));
  } catch (err) {
    return new Set(); // If file doesn't exist, start with an empty set
  }
}

// Save data to JSON file
function saveOnlyAdminData(data) {
  fs.writeFileSync(filePath, JSON.stringify([...data], null, 2));
}

const onlyAdminGroups = loadOnlyAdminData();

async function addGroupToOnlyAdminList(groupeJid) {
  onlyAdminGroups.add(groupeJid);
  saveOnlyAdminData(onlyAdminGroups);
  console.log(`Group JID ${groupeJid} added to the onlyAdmin list.`);
}

async function isGroupOnlyAdmin(groupeJid) {
  return onlyAdminGroups.has(groupeJid);
}

async function removeGroupFromOnlyAdminList(groupeJid) {
  onlyAdminGroups.delete(groupeJid);
  saveOnlyAdminData(onlyAdminGroups);
  console.log(`Group JID ${groupeJid} removed from the onlyAdmin list.`);
}

module.exports = {
  addGroupToOnlyAdminList,
  isGroupOnlyAdmin,
  removeGroupFromOnlyAdminList,
};




//.  **FrediEzra Tech info 2025 | All right reserved