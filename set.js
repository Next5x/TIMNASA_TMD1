const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoia0tCZmFsY2szTGJHamlGMVAxUitjOVlsNEJSdXlYR1dNR2ZjSnJmUWtFWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUGpMVkpiYWd0WUZyeSt6TjQzeG5NUmREZkwzcDdCam9Pc21VMHIrdWxDQT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJRQ0c0NWU1TVVTQUpqTnN3QmFzdUhnR0pJQXVVZjZYVEhqSUhSdHdaTWswPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI3T0VwbXhzejluUmJtV1lqdklhZXFET3d0U3lxMVhrYTdwMm54Zzl1YkZFPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im9KVlZheC9ndzFSSUJEMGFpT2FuWkV4UGEzQ21uVDE5cE1ESVA4aGZXRVk9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJQODJ2R1B2MWNRdFdZTWFDcjVNN3dEOUJHdjF2OUVBZWxndkQ0bTNUbmM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTU9wOXhhU05ZRkNPZnNNandRQ0pEUGxJTGQ2UElsYllVNXlrcHdHeXUxTT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTEUxVTdMV2VhRFBLNzNmdkdRS0M4M2RHMjZ0aHAzeWJmekptRERjb0dIWT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkVxQTJDZGFhMFZDTHhyZy9NU3l6SVJJTUZCKzVBdlZyRExBeHdoREpBbGsyZnpLZjRxejBUdS9NKzRUempRQlRqRStwNDRkcW9Wa0JKQXZnc3JPN2d3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NjgsImFkdlNlY3JldEtleSI6IjNJYmJRb1VqTUhXSUhUNWNzZHlvYkx6VGpBbWQrWlRzcTdjL0xEUmN2YjQ9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6IlQ2MWpoUmZ5UU5tZ3hNSTROUmFWLXciLCJwaG9uZUlkIjoiZjU4MjE1NzItODAwYi00ZDk2LTllNTItOGJhMGVhNjk1OTIxIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlNIWWo4MVhCdDZ4YUJhTkhjQWdBajRIRzJYcz0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ2WVU3OG9KRTA0aE05SzF5bTNiSWhkTG5jaUk9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiTEpUSlJKN1giLCJtZSI6eyJpZCI6IjI3Njk0Njk4MDk1OjE2QHMud2hhdHNhcHAubmV0IiwibmFtZSI6IlFpbmlzbyBKb3JkaWlpIEZveCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDT2pxaThzQkVKaXpxYjRHR0FJZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5Ijoick8rcmV4Ynl2bGdiY25hOVBLVlBxYTdyNlEwaXFyYnFYRUVsVTVNamNBTT0iLCJhY2NvdW50U2lnbmF0dXJlIjoic3M4dkRybGxQZUlVaHdRMDhDZlhITkp3YkcvUzFkTlR3R2VBTGd3bDZlLzkxR2tYTXlaOWg5cDVHcnM4dFhUUFN2V2h3Y1k3UEMybTE0WUN6ZnZjQ1E9PSIsImRldmljZVNpZ25hdHVyZSI6IjZuRm9rUDhyell1bUZYSXNuUitYQ0JnV1p6a1hsUjlXTXNWcW1la3NpK1EzU3dveDR3MjQ2aEdla1UyNlNwNW5VTy81NXV6eXNkQ1pzbUZWZjVERmhBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjc2OTQ2OTgwOTU6MTZAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCYXp2cTNzVzhyNVlHM0oydlR5bFQ2bXU2K2tOSXFxMjZseEJKVk9USTNBRCJ9fV0sInBsYXRmb3JtIjoic21iYSIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc0MTMxNDQ3MH0=',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "jordiifox",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "255784766591",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'BMW_MD',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/17c83719a1b40e02971e4.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    TIMNASA_TMD : process.env.AUTO_LIKE_STATUS || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};

let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
