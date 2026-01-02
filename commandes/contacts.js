const { zokou } = require("../framework/zokou");

// ==========================================
// SAVE & DELETE CONTACT COMMANDS WITH CHANNEL
// ==========================================

const channelJid = "120363413554978773@newsletter";

/**
 * Command to Save Contact (Generates vCard)
 */
zokou({
    nomCom: "savecontact",
    reaction: "💾",
    categorie: "General"
}, async (dest, zk, reponse) => {
    const { ms, arg, msgRepondu } = reponse;
    let number, name;

    if (msgRepondu) {
        // If replying to a message
        number = msgRepondu.sender.split('@')[0];
        name = arg.join(" ") || `Contact_${number}`;
    } else if (arg[0] && arg[1]) {
        // If typing number and name (e.g., .savecontact 2547xxx Name)
        number = arg[0].replace(/[^0-9]/g, "");
        name = arg.slice(1).join(" ");
    } else {
        return zk.sendMessage(dest, { 
            text: "*TIMNASA CONTACT SAVER*\n\n" +
                 "🔹 *Reply to a message:* .savecontact [Name]\n" +
                 "🔹 *Type manually:* .savecontact [Number] [Name]" 
        }, { quoted: ms });
    }

    const vcard = 'BEGIN:VCARD\n' +
        'VERSION:3.0\n' +
        'FN:' + name + '\n' +
        'ORG:Timnasa User;\n' +
        'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n' +
        'END:VCARD';

    // Send the Contact Card
    await zk.sendMessage(dest, {
        contacts: {
            displayName: name,
            contacts: [{ vcard }]
        }
    }, { quoted: ms });

    // Send Channel Promotion Card
    await zk.sendMessage(dest, { 
        text: `✅ Contact for *${name}* created successfully!\n\nJoin our official channel for more updates:`,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: channelJid,
                newsletterName: "Timnasa Official Updates",
                serverMessageId: 1
            }
        }
    });
});

/**
 * Command to Delete Message (Unsend Contact Card)
 */
zokou({
    nomCom: "deletecontact",
    reaction: "🗑️",
    categorie: "General"
}, async (dest, zk, reponse) => {
    const { ms, msgRepondu } = reponse;

    if (!msgRepondu) {
        return zk.sendMessage(dest, { text: "Please reply to the contact card or message you want to delete (unsend)." }, { quoted: ms });
    }

    try {
        const key = {
            remoteJid: dest,
            fromMe: msgRepondu.fromMe,
            id: msgRepondu.id,
            participant: msgRepondu.sender
        };

        await zk.sendMessage(dest, { delete: key });

        // Send channel info after deletion
        await zk.sendMessage(dest, { 
            text: "🗑️ Message deleted. Keep enjoying our services on our official channel.",
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    newsletterName: "Timnasa Official Updates"
                }
            }
        });
    } catch (e) {
        zk.sendMessage(dest, { text: "Failed to delete! Ensure the bot has administrative privileges." });
    }
});
