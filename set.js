const fs = require('fs-extra');
const path = require("path");
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;

module.exports = {
    // Session na Prefix
    session: process.env.SESSION_ID || 'zokk',
    PREFIXE: process.env.PREFIX || "+",
    
    // Habari za Mmiliki (Owner)
    OWNER_NAME: process.env.OWNER_NAME || "chugastan",
    NUMERO_OWNER: process.env.NUMERO_OWNER || "255622286792",
    NOM_OWNER: process.env.OWNER_NAME || "chugastan", // Imetumika kwenye index.js
    
    // Mipangilio ya Bot
    BOT_NAME: process.env.BOT_NAME || 'MATELEE TMD',
    URL: process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/ejm45q.jpg',
    MODE: process.env.PUBLIC_MODE || "no",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    DP: process.env.STARTING_BOT_MESSAGE || "yes",
    
    // Hali ya Bot (Status/Presence)
    ETAT: process.env.PRESENCE || '1', // 1: Online, 2: Typing, 3: Recording
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "non",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    AUTOREACT_STATUS: process.env.AUTOREACT_STATUS || 'yes', // Mpya tuliyoongeza
    
    // Ulinzi na Chatbot
    WARN_COUNT: process.env.WARN_COUNT || '3',
    CHATBOT: process.env.PM_CHATBOT || 'no',
    ADM: process.env.ANTI_DELETE_MESSAGE || 'yes',
    
    // Heroku Settings
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || '',
    HEROKU_APY_KEY: process.env.HEROKU_APY_KEY || '',
    
    // Database Configuration
    DATABASE_URL: DATABASE_URL,
    DATABASE: "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9"
};

// Sehemu ya ku-watch mabadiliko ya file (Hot Reload)
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Mabadiliko yamehifadhiwa kwenye: ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
