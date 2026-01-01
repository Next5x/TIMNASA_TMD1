const { zokou } = require('../framework/zokou');
const cron = require('node-cron');

// Hapa tunatengeneza mfumo wa kuhifadhi muda (unaweza kutumia Database hapa)
let groupSettings = {};

zokou({
    nomCom: "antimute",
    categorie: "Group",
    reaction: "⏲️"
}, async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, verifAdmin, verifGroupe, superUser } = commandeOptions;

    if (!verifGroupe) return repondre("Command hii inafanya kazi kwenye vikundi tu.");
    if (!verifAdmin && !superUser) return repondre("Hii ni kwa ajili ya Admin tu.");

    if (!arg[0] || !arg[1]) {
        return repondre(`*Matumizi Sahihi:*\n\n.antimute [open/close] [saa:dakika]\n\nMfano:\n.antimute close 22:00 (Itafunga saa nne usiku)\n.antimute open 06:00 (Itafungua saa kumi na mbili asubuhi)`);
    }

    const action = arg[0].toLowerCase();
    const time = arg[1]; // Saa katika muundo wa HH:mm
    const [hour, minute] = time.split(':');

    if (isNaN(hour) || isNaN(minute) || hour > 23 || minute > 59) {
        return repondre("Muda uliowekwa si sahihi. Tumia mfano 22:00");
    }

    // Kupanga ratiba kwa Saa za Tanzania (Africa/Nairobi)
    cron.schedule(`${minute} ${hour} * * *`, async () => {
        if (action === "close") {
            await zk.groupSettingUpdate(dest, 'announcement');
            zk.sendMessage(dest, { text: "📢 *Group Limefungwa!* Muda wa kulala umefika. Tuonane kesho asubuhi." });
        } else if (action === "open") {
            await zk.groupSettingUpdate(dest, 'not_announcement');
            zk.sendMessage(dest, { text: "📢 *Group Limefunguliwa!* Habari za asubuhi? Sasa mnaweza kuendelea kuchat." });
        }
    }, {
        scheduled: true,
        timezone: "Africa/Nairobi" // Hii inahakikisha inatumia saa za Tanzania
    });

    repondre(`✅ Ratiba imepangwa! Group lita- ${action === 'close' ? 'fungwa' : 'funguliwa'} kila siku ifikapo saa ${time} (Saa za Tanzania).`);
});
