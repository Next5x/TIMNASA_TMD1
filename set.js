"use strict";
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
    // 1. CONNECTION & SESSION
    session: process.env.SESSION_ID || 'zokk', // Your Session ID
    PREFIXE: process.env.PREFIX || "+",
    OWNER_NAME: process.env.OWNER_NAME || "chugastan",
    NUMERO_OWNER: process.env.NUMERO_OWNER || "255622286792",
    NOM_OWNER: process.env.OWNER_NAME || "chugastan",

    // 2. CHANNEL & SUPPORT SETTINGS
    CHANNEL_ID: process.env.CHANNEL_ID || "120363xxxxxx@newsletter", // Put your Channel JID here
    CHANNEL_NAME: process.env.CHANNEL_NAME || "TIMNASA-MD-SUPPORT",
    SUPPORT_GROUP: process.env.SUPPORT_GROUP || "https://chat.whatsapp.com/xxxx",

    // 3. AUTOMATION FEATURES (AUTO-MODES)
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes", // Auto views statuses
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no', // Saves status to your gallery
    AUTOREACT_STATUS: process.env.AUTOREACT_STATUS || 'yes', // Reacts to status with emojis
    AUTO_READ_MESSAGES: process.env.AUTO_READ_MESSAGES || "no", // Auto blue ticks
    AUTO_TYPING: process.env.AUTO_TYPING || "no", // Shows "typing..." always
    AUTO_RECORDING: process.env.AUTO_RECORDING || "no", // Shows "recording..." always
    AUTO_BLOCK_212: process.env.AUTO_BLOCK_212 || "no", // Blocks +212 (foreign spam) numbers

    // 4. SECURITY & PROTECTION (ANTIS)
    ANTILIEN: process.env.ANTILIEN || "yes", // Anti-link (removes link senders)
    ANTIBOT: process.env.ANTIBOT || "yes", // Anti-bot (kicks other bots)
    ANTICALL: process.env.ANTICALL || "no", // Auto-block callers
    ANTIDELETE: process.env.ANTI_DELETE_MESSAGE || 'yes', // Shows deleted messages
    PM_PERMIT: process.env.PM_PERMIT || 'no', // Blocks people from DMing bot without permission

    // 5. BOT APPEARANCE & PRESENCE
    BOT_NAME: process.env.BOT_NAME || 'MATELEE TMD',
    URL: process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/ejm45q.jpg', // Menu image
    MODE: process.env.PUBLIC_MODE || "yes", // 'yes' for Public, 'no' for Private
    DP: process.env.STARTING_BOT_MESSAGE || "yes", // Uptime message on start
    ETAT: process.env.PRESENCE || '1', // 1: Online, 2: Typing, 3: Recording, 0: Invisible

    // 6. ADMIN & WARNING LIMITS
    WARN_COUNT: process.env.WARN_COUNT || '3', // Warning limit before kick
    ADM: process.env.ANTI_DELETE_MESSAGE || 'yes',

    // 7. DATABASE & CLOUD CONFIGURATION
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || '',
    HEROKU_APY_KEY: process.env.HEROKU_APY_KEY || '',
    DATABASE_URL: DATABASE_URL,
    // PostgreSQL Database Link
    DATABASE: process.env.DATABASE || "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9"
};

// Hot Reloading (Watching for changes)
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Settings updated in: ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
