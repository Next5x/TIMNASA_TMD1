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

// Path to the JSON file storing banned users
const filePath = path.join(__dirname, '../tmd/banUser.json');

// Load data from JSON file
function loadBanUserData() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {}; // Default if file doesn't exist
  }
}

// Save data to JSON file
function saveBanUserData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Create default file if it doesn't exist
if (!fs.existsSync(filePath)) {
  saveBanUserData({});
}

// Function to add a user to the ban list
async function addUserToBanList(jid) {
  try {
    const data = loadBanUserData();
    data[jid] = true; // Add the user to the ban list
    saveBanUserData(data);
    console.log(`JID ${jid} added to the banned user list.`);
  } catch (error) {
    console.error("Error while adding the banned user:", error);
  }
}

// Function to check if a user is banned
async function isUserBanned(jid) {
  try {
    const data = loadBanUserData();
    return data.hasOwnProperty(jid); // Check if the user is banned
  } catch (error) {
    console.error("Error while checking if the user is banned:", error);
    return false;
  }
}

// Function to remove a user from the ban list
async function removeUserFromBanList(jid) {
  try {
    const data = loadBanUserData();
    if (data.hasOwnProperty(jid)) {
      delete data[jid]; // Remove the user from the ban list
      saveBanUserData(data);
      console.log(`JID ${jid} removed from the banned user list.`);
    } else {
      console.log(`JID ${jid} is not in the banned user list.`);
    }
  } catch (error) {
    console.error("Error while removing the banned user:", error);
  }
}

module.exports = {
  addUserToBanList,
  isUserBanned,
  removeUserFromBanList,
};



//    **FrediEzra Tech info 2025 | All right reserved