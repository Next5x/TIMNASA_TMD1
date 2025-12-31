"use strict";

const { zokou } = require(__dirname + "/../framework/zokou");

zokou({
    nomCom: "broadcast",
    categorie: "Owner",
    reaction: "🚀"
}, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, verifGroupe, infosGroupe, superUser, mtype } = commandeOptions;

    // 1. SECURITY CHECK
    if (!superUser) return repondre("❌ This is an Owner-only command!");
    if (!verifGroupe) return repondre("✋ Please run this command inside a group.");
    
    const participants = await infosGroupe.participants;
    const text = arg.join(" ");
    
    // Check if user replied to an image/video/audio or just sent text
    const quoted = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;
    const content = quoted || ms.message;

    if (!text && !quoted) return repondre("Please provide a message or reply to an image/video to broadcast.");

    repondre(`📢 *TMD BROADCAST STARTED*\n\n👥 Recipients: ${participants.length}\n⏳ Estimated time: ${Math.floor((participants.length * 3) / 60)} minutes.\n\n_Bot will send messages with random delays to prevent banning._`);

    let success = 0;
    let failure = 0;

    for (let member of participants) {
        try {
            const jid = member.id;
            if (jid === zk.user.id.split(':')[0] + '@s.whatsapp.net') continue; // Skip bot

            if (quoted) {
                // Kama ume-reply picha/video, itatuma file hilo
                await zk.sendMessage(jid, { forward: ms.message.extendedTextMessage.contextInfo.quotedMessage, caption: text }, { quoted: ms });
            } else {
                // Kama ni maandishi tu
                await zk.sendMessage(jid, { text: text });
            }

            success++;
            
            // RANDOM DELAY (2 to 5 seconds) - ANTI BAN
            const delay = Math.floor(Math.random() * 3000) + 2000;
            await new Promise(resolve => setTimeout(resolve, delay));

        } catch (e) {
            console.log(`Failed to send to: ${member.id}`);
            failure++;
        }
    }

    await zk.sendMessage(dest, { 
        text: `✅ *BROADCAST COMPLETED*\n\n📊 *Statistics:*\n🟢 Success: ${success}\n🔴 Failed: ${failure}\n\n_All messages sent directly to DMs._` 
    }, { quoted: ms });
});
