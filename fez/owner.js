const { timoth } = require("../timnasa/timoth");
const moment = require("moment-timezone");
const { getBuffer } = require("../timnasa/dl/Function");
const { default: axios } = require('axios');

const runtime = function (seconds) { 
    seconds = Number(seconds); 
    var d = Math.floor(seconds / (3600 * 24)); 
    var h = Math.floor((seconds % (3600 * 24)) / 3600); 
    var m = Math.floor((seconds % 3600) / 60); 
    var s = Math.floor(seconds % 60); 
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " d, ") : ""; 
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " h, ") : ""; 
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " m, ") : ""; 
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " s") : ""; 
    return dDisplay + hDisplay + mDisplay + sDisplay; 
} 

timoth({ nomCom: "owner", categorie: "System", reaction: "🇹🇿" }, async (dest, zk, commandeOptions) => {
    const { ms , mybotpic } = commandeOptions;

    const thsudo = await isSudoTableNotEmpty()

    if (thsudo) {
        let msg = `*My Super-User*\n`
        + `*Owner Number:\n*`
        + `- 🌟 @${conf.NUMERO_OWNER}\n`
        + `------ *other sudos* -----\n`;

        let sudos = await getAllSudoNumbers();

        for (const sudo of sudos) {
            if (sudo) { // Strict check to skip falsy values
                const sudonumero = sudo.replace(/[^0-9]/g, '');
                msg += `- 💼 @${sudonumero}\n`;
            } else {
                console.log("Skipping invalid sudo:", sudo);
                continue; // Skip invalid entries instead of returning
            }
        }

        const ownerjid = conf.NUMERO_OWNER.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
        const mentionedJid = sudos.map(sudo => sudo.replace(/[^0-9]/g, '') + "@s.whatsapp.net").concat([ownerjid]);

        console.log(sudos);
        console.log(mentionedJid);

        zk.sendMessage(
            dest,
            {
                image: { url: mybotpic() },
                caption: msg,
                mentions: mentionedJid
            }
        );
    } else {
        const vcard =
            'BEGIN:VCARD\n' 
            + 'VERSION:3.0\n' 
            + 'FN:' + conf.OWNER_NAME + '\n' 
            + 'ORG:undefined;\n' 
            + 'TEL;type=CELL;type=VOICE;waid=' + conf.NUMERO_OWNER + ':+' + conf.NUMERO_OWNER + '\n' 
            + 'END:VCARD';

        zk.sendMessage(dest, {
            contacts: {
                displayName: conf.OWNER_NAME,
                contacts: [{ vcard }],
            },
        }, { quoted: ms });
    }
});
