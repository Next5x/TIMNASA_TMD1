"use strict";
const { zokou } = require("../framework/zokou");
const { ajouterOuMettreAJourJid, atbverifierEtatJid } = require("../bdd/antibot");

zokou({
    nomCom: "antibot",
    reaction: "🛡️",
    categorie: "Group"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, verifAdmin, superUser } = commandeOptions;

    if (!verifAdmin && !superUser) {
        return repondre("Amri hii ni kwa ajili ya Admins tu!");
    }

    if (!arg[0]) {
        const status = await atbverifierEtatJid(dest);
        return repondre(`Hali ya Antibot kwa sasa ni: *${status.toUpperCase()}*\n\nTumia:\n*.antibot on* kuwasha\n*.antibot off* kuzima`);
    }

    if (arg[0] === "on") {
        await ajouterOuMettreAJourJid(dest, "on");
        repondre("🛡️ *TIMNASA-MD ANTIBOT ACTIVE*\n\nBot nyingine haziruhusiwi kuandika kwenye kikundi hiki kuanzia sasa.");
    } else if (arg[0] === "off") {
        await ajouterOuMettreAJourJid(dest, "off");
        repondre("🔓 *TIMNASA-MD ANTIBOT DEACTIVATED*\n\nMfumo wa ulinzi umezimwa.");
    } else {
        repondre("Chagua 'on' au 'off'.");
    }
});
