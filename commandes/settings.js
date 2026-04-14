const { zokou } = require("../framework/zokou");
const s = require("../set");

/**
 * Optimized Helper Function to handle settings updates
 */
async function updateSetting(context, settingName, option, successMsg) {
    const { repondre, superUser } = context;

    if (!superUser) {
        return repondre("*This command is restricted to the bot owner or Timnasa Tech 👻*");
    }

    if (!option) {
        return repondre(`Usage:\n\nType "ON" to enable or "OFF" to disable.`);
    }

    const mode = option.toLowerCase();
    if (mode === "yes" || mode === "on") {
        s[settingName] = settingName === "ETAT" ? (settingName === "ETAT_VAL" ? settingName : "yes") : "yes"; 
        // Note: For ETAT specific values, handled in switch below
        return repondre(`✅ ${successMsg} has been enabled.`);
    } else if (mode === "no" || mode === "off") {
        s[settingName] = "no";
        return repondre(`❌ ${successMsg} has been disabled.`);
    } else {
        return repondre("Please use 'yes' or 'no'.");
    }
}

// --- COMMANDS SETUP ---

const commands = [
    { nom: 'anticall', key: 'ANTICALL', desc: 'Anti-call' },
    { nom: 'areact', key: 'AUTO_REACT', desc: 'Auto-reaction' },
    { nom: 'readstatus', key: 'AUTO_READ_STATUS', desc: 'Auto-read status' },
    { nom: 'antideletedm', key: 'ANTIDELETEDM', desc: 'Anti-delete DM' },
    { nom: 'downloadstatus', key: 'AUTO_DOWNLOAD_STATUS', desc: 'Auto-download status' },
    { nom: 'startmessage', key: 'DP', desc: 'Start message' },
    { nom: 'readmessage', key: 'AUTO_READ_MESSAGES', desc: 'Auto-read messages' },
    { nom: 'pm-permit', key: 'PM_PERMIT', desc: 'PM Permit' },
    { nom: 'chatbot', key: 'CHAT_BOT', desc: 'Chatbot' },
    { nom: 'areply', key: 'AUTO_REPLY', desc: 'Auto-reply' },
    { nom: 'antivv', key: 'ANTI_VV', desc: 'Anti-view once' },
    { nom: 'publicmode', key: 'MODE', desc: 'Public mode' }
];

// Loop to register all standard YES/NO commands
commands.forEach(cmd => {
    zokou({ nomCom: cmd.nom, categorie: "HEROKU-CLIENT" }, async (dest, zk, context) => {
        await updateSetting(context, cmd.key, context.arg, cmd.desc);
    });
});

// --- SPECIAL CASE COMMANDS (ETAT) ---

zokou({ nomCom: 'autorecord', categorie: "HEROKU-CLIENT" }, async (dest, zk, context) => {
    const { arg, repondre, superUser } = context;
    if (!superUser) return repondre("*Restricted to Timnasa Tech*");
    if (arg?.toLowerCase() === "yes") {
        s.ETAT = '3';
        return repondre("✅ Auto-record enabled.");
    } else {
        s.ETAT = 'no';
        return repondre("❌ Auto-record disabled.");
    }
});

zokou({ nomCom: 'autotyping', categorie: "HEROKU-CLIENT" }, async (dest, zk, context) => {
    const { arg, repondre, superUser } = context;
    if (!superUser) return repondre("*Restricted to Timnasa Tech*");
    if (arg?.toLowerCase() === "yes") {
        s.ETAT = '2';
        return repondre("✅ Auto-typing enabled.");
    } else {
        s.ETAT = 'no';
        return repondre("❌ Auto-typing disabled.");
    }
});

zokou({ nomCom: 'alwaysonline', categorie: "HEROKU-CLIENT" }, async (dest, zk, context) => {
    const { arg, repondre, superUser } = context;
    if (!superUser) return repondre("*Restricted to Timnasa Tech*");
    if (arg?.toLowerCase() === "yes") {
        s.ETAT = '1';
        return repondre("✅ Always online enabled.");
    } else {
        s.ETAT = 'no';
        return repondre("❌ Always online disabled.");
    }
});

zokou({ nomCom: 'privatemode', categorie: "HEROKU-CLIENT" }, async (dest, zk, context) => {
    const { arg, repondre, superUser } = context;
    if (!superUser) return repondre("*Restricted to Timnasa Tech*");
    if (arg?.toLowerCase() === "yes") {
        s.MODE = 'no'; // Private mode usually means Public Mode is "no"
        return repondre("✅ Private mode enabled.");
    } else {
        s.MODE = 'yes';
        return repondre("❌ Private mode disabled (Bot is now Public).");
    }
});
