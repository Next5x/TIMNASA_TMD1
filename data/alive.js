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
const filePath = path.join(__dirname, '../tmd/alive.json');

// Load data from JSON file
function loadAliveData() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { id: 1, message: '', lien: '' }; // Default if file doesn't exist
  }
}

// Save data to JSON file
function saveAliveData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Create default data if not exists
if (!fs.existsSync(filePath)) {
  saveAliveData({ id: 1, message: '', lien: '' });
}

// Function to add or update data in 'alive'
async function addOrUpdateDataInAlive(message, lien) {
  try {
    const data = loadAliveData();
    data.message = message;
    data.lien = lien;
    saveAliveData(data);
    console.log("Data successfully added or updated in 'alive'.");
  } catch (error) {
    console.error("Error while adding or updating data in 'alive':", error);
  }
}

// Function to get data from 'alive'
async function getDataFromAlive() {
  try {
    const data = loadAliveData();
    if (data.message && data.lien) {
      return { message: data.message, lien: data.lien };
    } else {
      console.log("No data found in 'alive'.");
      return null;
    }
  } catch (error) {
    console.error("Error while retrieving data from 'alive':", error);
    return null;
  }
}

module.exports = {
  addOrUpdateDataInAlive,
  getDataFromAlive,
};

 //  **FrediEzra Tech info 2025 | All rights reserved.