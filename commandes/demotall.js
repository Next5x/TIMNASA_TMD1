"use strict";
const { zokou } = require(__dirname + "/../framework/zokou");

zokou({
    nomCom: "demoteall",
    categorie: "Group",
    reaction: "👑"
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, verifGroupe, verifAdmin, superUser } = commandeOptions;

    try {
        // 1. Hakikisha ni group
        if (!verifGroupe) {
            return repondre("✋🏿 Amri hii ni ya makundi pekee!");
        }

        // 2. Hakikisha anayeiita ni Admin au Owner
        if (!(verifAdmin || superUser)) {
            return repondre("❌ Amri hii ni ya Admins pekee!");
        }

        // 3. Pata metadata ya group upya ili kuwa na data sahihi
        const metadata = await zk.groupMetadata(dest);
        const participants = metadata.participants;
        const botNumber = zk.user.id.split(':')[0] + '@s.whatsapp.net';

        // 4. Tafuta admins wote lakini mtoe bot mwenyewe
        const admins = participants
            .filter(p => p.admin !== null && p.id !== botNumber)
            .map(p => p.id);

        if (admins.length === 0) {
            return repondre("Hakuna admins wa kuwavua madaraka (ukimtoa bot).");
        }

        // Tuma taarifa ya kuanza
        await repondre(`Zoezi limeanza... Nawavua madaraka viongozi ${admins.length}. Tafadhali subiri.`);

        // 5. Tekeleza kitendo cha kuwashusha vyeo (Demote)
        // Tunazigawa namba kwenye makundi (batches) ili kuzuia bot ku-crash
        await zk.groupParticipantsUpdate(dest, admins, "demote");

        // 6. Thibitisha mafanikio
        await zk.sendMessage(dest, { 
            text: "✅ Mafanikio! Ma-admin wote wamevuliwa madaraka na sasa ni wanachama wa kawaida." 
        }, { quoted: ms });

    } catch (e) {
        console.log("Error katika demoteall: ", e);
        repondre("Hitilafu: " + e.message + "\n\nHakikisha Bot ni Admin!");
    }
});
