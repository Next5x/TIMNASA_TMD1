const { zokou } = require('../framework/zokou');
const { updateAntiDeleteState, updateAntiDeleteDest, getAntiDeleteSettings } = require('../bdd/antidelete');

zokou({
    nomCom: "antidelete",
    categorie: "Settings",
    reaction: "🛡️"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, superUser } = commandeOptions;

    if (!superUser) return repondre("This command is for the Owner only!");
    
    const settings = await getAntiDeleteSettings();

    if (!arg[0]) {
        return repondre(`*TIMNASA ANTI-DELETE SETTINGS*\n\n` +
            `Current State: *${settings.state.toUpperCase()}*\n` +
            `Current Destination: *${settings.destination.toUpperCase()}*\n\n` +
            `*Commands:* \n` +
            `1. !antidelete on / off\n` +
            `2. !antidelete set dm (Send to your PM)\n` +
            `3. !antidelete set group (Send back to group)`);
    }

    const action = arg[0].toLowerCase();

    if (action === "on" || action === "off") {
        await updateAntiDeleteState(action);
        repondre(`✅ Anti-delete is now turned ${action.toUpperCase()}`);
    } else if (action === "set" && arg[1]) {
        const mode = arg[1].toLowerCase();
        if (mode === "dm" || mode === "group") {
            await updateAntiDeleteDest(mode);
            repondre(`✅ Anti-delete logs will now be sent to: *${mode.toUpperCase()}*`);
        }
    }
});
