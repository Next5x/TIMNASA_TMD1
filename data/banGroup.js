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

// Path to the JSON file storing banned groups
const filePath = path.join(__dirname, '../tmd/banGroup.json');

// Load data from JSON file
function loadBanGroupData() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {}; // Default if file doesn't exist
  }
}

// Save data to JSON file
function saveBanGroupData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Create default file if it doesn't exist
if (!fs.existsSync(filePath)) {
  saveBanGroupData({});
}

// Function to add a group to the ban list
async function addGroupToBanList(groupeJid) {
  try {
    const data = loadBanGroupData();
    data[groupeJid] = true; // Add the group to the ban list
    saveBanGroupData(data);
    console.log(`Group JID ${groupeJid} added to the banned list.`);
  } catch (error) {
    console.error("Error while adding the banned group:", error);
  }
}

// Function to check if a group is banned
async function isGroupBanned(groupeJid) {
  try {
    const data = loadBanGroupData();
    return data.hasOwnProperty(groupeJid); // Check if the group is banned
  } catch (error) {
    console.error("Error while checking if the group is banned:", error);
    return false;
  }
}

// Function to remove a group from the ban list
async function removeGroupFromBanList(groupeJid) {
  try {
    const data = loadBanGroupData();
    if (data.hasOwnProperty(groupeJid)) {
      delete data[groupeJid]; // Remove the group from the ban list
      saveBanGroupData(data);
      console.log(`Group JID ${groupeJid} removed from the banned list.`);
    } else {
      console.log(`Group JID ${groupeJid} is not in the banned list.`);
    }
  } catch (error) {
    console.error("Error while removing the banned group:", error);
  }
}

module.exports = {
  addGroupToBanList,
  isGroupBanned,
  removeGroupFromBanList,
};



// **FrediEzra Tech info 2025 | All right reserved 