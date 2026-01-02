"use strict";

const { zokou } = require("../framework/zokou");
const conf = require("../set");

// 1. COMMAND TO CHANGE PREFIX
zokou({
    nomCom: "setprefix",
    categorie: "Settings",
    reaction: "⌨️"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, superUser, prefixe } = commandeOptions;

    if (!superUser) return repondre("❌ This command is restricted to the Bot Owner.");
    if (!arg[0]) return repondre(`Please provide the symbol you want to use (Example: ${prefixe}setprefix !)`);

    const newPrefix = arg[0];
    
    try {
        // Updates the prefix in the bot's temporary memory
        conf.PREFIXE = newPrefix;
        repondre(`✅ *Prefix updated!* You can now use: *${newPrefix}*`);
    } catch (e) {
        repondre("❌ An error occurred while updating the prefix.");
    }
});

// 2. COMMAND TO ADD A NEW OWNER
zokou({
    nomCom: "addowner",
    categorie: "Settings",
    reaction: "👑"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, superUser, msgRepondu, auteurMsgRepondu } = commandeOptions;

    if (!superUser) return repondre("❌ Only the Main Owner can add new owners.");

    let newOwner;
    if (msgRepondu) {
        newOwner = auteurMsgRepondu.split("@")[0];
    } else if (arg[0]) {
        newOwner = arg[0].replace(/[^0-9]/g, "");
    } else {
        return repondre("Please tag a user or type their number (e.g., 255743706043)");
    }

    try {
        // Appends the number to the current owners list
        if (!conf.NUMERO_OWNER.includes(newOwner)) {
            conf.NUMERO_OWNER += `,${newOwner}`;
            repondre(`✅ Number *${newOwner}* has been added as a New Owner.`);
        } else {
            repondre("This number is already in the Owners list.");
        }
    } catch (e) {
        repondre("❌ Failed to add owner.");
    }
});

// 3. COMMAND TO RESET/SET A SINGLE OWNER
zokou({
    nomCom: "setowner",
    categorie: "Settings",
    reaction: "👤"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, superUser } = commandeOptions;

    if (!superUser) return repondre("❌ This command is for the Main Owner only.");
    if (!arg[0]) return repondre("Please provide the number you want to set as the sole Owner.");

    const singleOwner = arg[0].replace(/[^0-9]/g, "");
    conf.NUMERO_OWNER = singleOwner;

    repondre(`✅ Owner list has been reset. *${singleOwner}* is now the only Owner.`);
});
