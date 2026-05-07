const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });

const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;

module.exports = { 
    // Core Settings
    session: process.env.SESSION_ID || 'zokk',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "TIMNASA_TMD1",
    NUMERO_OWNER: process.env.NUMERO_OWNER || "255784766591", 
    BOT: process.env.BOT_NAME || 'TIMNASA-TMD',
    MODE: process.env.PUBLIC_MODE || "yes",
    WORK_MODE: process.env.WORK_MODE || "public",
    
    // Status & Media Settings
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_REACT_STATUS: process.env.AUTO_REACT_STATUS || 'yes',
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || 'no',
    AUTO_STATUS_TEXT: process.env.AUTO_STATUS_TEXT || '💲 YOUR STATUS VIEWED BY TIMNASA-TMD',
    AUTO_SAVE_CONTACTS: process.env.AUTO_SAVE_CONTACTS || 'no',
    AUTO_STICKER: process.env.AUTO_STICKER || "no",

    // Automations
    CHAT_BOT: process.env.CHAT_BOT || "on",
    AUDIO_REPLY: process.env.AUDIO_REPLY || "yes",
    AUTO_VOICE: process.env.AUTO_VOICE || "no",
    AUTO_REPLY: process.env.AUTO_REPLY || "no",
    AUTO_READ_MESSAGES: process.env.AUTO_READ_MESSAGES || "no",
    AUTO_REACTION: process.env.AUTO_REACTION || "no",
    AUTO_LIKE: process.env.AUTO_LIKE || "no",
    AUTO_BIO: process.env.AUTO_BIO || 'yes',

    // Security & Anti-Features
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    ANTI_DELETE_MESSAGES: process.env.ANTI_DELETE_MESSAGES || 'no',
    ANTI_CALL: process.env.ANTI_CALL || 'off',
    REJECT_CALLS: process.env.REJECT_CALLS || 'no',
    ANTI_BAD: process.env.ANTI_BAD || "no",
    ANTI_BUG: process.env.ANTI_BUG || "no",
    ANTI_LINK: process.env.ANTI_LINK || "no",
    ANTI_SPAM: process.env.ANTI_SPAM || "no",
    ANTI_TAG: process.env.ANTI_TAG || "no",
    AUTO_BLOCK: process.env.AUTO_BLOCK || 'false',
    WARN_COUNT: process.env.WARN_COUNT || '3',

    // Group Management
    WELCOME_MSG: process.env.WELCOME_MSG || "no",
    GOODBYE_MSG: process.env.GOODBYE_MSG || "no",
    GROUP_ONLY: process.env.GROUP_ONLY || "no",
    PM_ONLY: process.env.PM_ONLY || "no",

    // Presence Settings
    ETAT: process.env.PRESENCE || '2',
    AUTO_TYPING: process.env.AUTO_TYPING || "no",
    AUTO_RECORDING: process.env.AUTO_RECORDING || "no",
    ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "yes",
    DP: process.env.STARTING_BOT_MESSAGE || "yes",

    // Technical & Deployment
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || null,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY || null,
    TIMEZONE: process.env.TIME_ZONE || "Africa/Dar_es_Salaam",
    DATABASE_URL,
    LOG_MESSAGES: process.env.LOG_MESSAGES || "no",
    READ_COMMANDS: process.env.READ_COMMANDS || "yes",
    AUTO_RESTART: process.env.AUTO_RESTART || "yes",

    // Branding & Links
    GITHUB: process.env.GITHUB || 'https://github.com/Next5x/TIMNASA_TMD1',
    URL: process.env.URL || "https://files.catbox.moe/t1rw0x.jpg",
    GURL: process.env.GURL || "https://whatsapp.com/channel/0029VajweHxKQuJP6qnjLM31",
    WEBSITE: process.env.GURL || "https://whatsapp.com/channel/0029VajweHxKQuJP6qnjLM31",
    CAPTION: process.env.CAPTION || "TIMNASA-TMD",
};

let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Update detected in ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
