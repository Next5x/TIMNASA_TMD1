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

// Path to the JSON file storing stickcmd data
const filePath = path.join(__dirname, '../tmd/stickcmd.json');

// Load data from the JSON file
function loadStickcmdData() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {}; // Return an empty object if the file doesn't exist or there's an error
  }
}

// Save data to the JSON file
function saveStickcmdData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Create the default file if it doesn't exist
if (!fs.existsSync(filePath)) {
  saveStickcmdData({});
}

// Function to add a stickcmd
async function addstickcmd(cmd, id) {
  try {
    const data = loadStickcmdData();

    // Add the command if it doesn't exist
    if (!data[cmd]) {
      data[cmd] = { id };
      saveStickcmdData(data);
      console.log(`Stickcmd ${cmd} has been added.`);
    } else {
      console.log(`Stickcmd ${cmd} already exists.`);
    }
  } catch (error) {
    console.error('Error while adding the stickcmd:', error);
  }
}

// Function to check if a stickcmd exists by id
async function inStickCmd(id) {
  try {
    const data = loadStickcmdData();

    // Check if any command with the given id exists
    for (const cmd in data) {
      if (data[cmd].id === id) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error while checking if stickcmd exists:', error);
    return false;
  }
}

// Function to delete a stickcmd
async function deleteCmd(cmd) {
  try {
    const data = loadStickcmdData();

    // Check if the stickcmd exists
    if (data[cmd]) {
      delete data[cmd]; // Remove the stickcmd
      saveStickcmdData(data);
      console.log(`Stickcmd ${cmd} has been removed.`);
    } else {
      console.log(`Stickcmd ${cmd} does not exist.`);
    }
  } catch (error) {
    console.error('Error while deleting the stickcmd:', error);
  }
}

// Function to get the cmd by id
async function getCmdById(id) {
  try {
    const data = loadStickcmdData();

    // Search for the cmd by id
    for (const cmd in data) {
      if (data[cmd].id === id) {
        return cmd;
      }
    }
    return null; // Return null if not found
  } catch (error) {
    console.error('Error while getting the cmd by id:', error);
    return null;
  }
}

// Function to get all stickcmds
async function getAllStickCmds() {
  try {
    const data = loadStickcmdData();
    return Object.keys(data); // Return all command keys
  } catch (error) {
    console.error('Error while retrieving all stickcmds:', error);
    return [];
  }
}

module.exports = {
  addstickcmd,
  deleteCmd,
  getCmdById,
  inStickCmd,
  getAllStickCmds,
};



///  **FrediEzra Tech info 2025 | all right reserved