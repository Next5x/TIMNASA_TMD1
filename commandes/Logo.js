const { zokou } = require("../framework/zokou");
const mumaker = require("mumaker");

// Global Channel JID Configuration
const channelJid = "120363413554978773@newsletter";
const contextInfo = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: channelJid,
        newsletterName: "𝚻𝚰𝚳𝚴𝚫𝐒𝚫-𝚻𝚳𝐃 𝙻𝙾𝙶𝙾𝚂",
        serverMessageId: 1
    }
};

// --- HACKER LOGO ---
zokou({ nomCom: "hacker", categorie: "Logo", reaction: "👨🏿‍💻" }, async (dest, zk, commandeOptions) => {
    const { prefixe, arg, ms, repondre } = commandeOptions;
    if (!arg || arg.length === 0) return repondre(`*Example:* ${prefixe}hacker Timnasa`);

    try {
        repondre("*Processing your Hacker logo...*");
        let anu = await mumaker.ephoto("https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html", arg.join(' '));
        await zk.sendMessage(dest, { image: { url: anu.image }, caption: "*Logo by 𝚻𝚰𝚳𝚴𝚫𝐒𝚫-𝚻𝚳𝐃*", contextInfo }, { quoted: ms });
    } catch (e) { repondre("🥵 Error: " + e); }
});

// --- DRAGON BALL ---
zokou({ nomCom: "dragonball", categorie: "Logo", reaction: "🐉" }, async (dest, zk, commandeOptions) => {
    let { arg, repondre, prefixe, ms } = commandeOptions;
    if (!arg || arg.length === 0) return repondre(`*Example:* ${prefixe}dragonball Timoth`);

    try {
        repondre("*Creating Dragon Ball text...*");
        const imgInfo = await mumaker.ephoto("https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html", arg.join(' '));
        await zk.sendMessage(dest, { image: { url: imgInfo.image }, caption: "*Logo by 𝚻𝚰𝚳𝚴𝚫𝐒𝚫-𝚻𝚳𝐃*", contextInfo }, { quoted: ms });
    } catch (e) { repondre("🥵 Error: " + e); }
});

// --- NARUTO ---
zokou({ nomCom: "naruto", categorie: "Logo", reaction: "⛩" }, async (dest, zk, commandeOptions) => {
    let { ms, arg, repondre, prefixe } = commandeOptions;
    if (!arg || arg.length === 0) return repondre(`*Example:* ${prefixe}naruto Timnasa`);

    try {
        repondre("*Processing Naruto style...*");
        var img = await mumaker.ephoto("https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html", arg.join(' '));
        await zk.sendMessage(dest, { image: { url: img.image }, caption: "*Logo by 𝚻𝚰𝚳𝚴𝚫𝐒𝚫-𝚻𝚳𝐃*", contextInfo }, { quoted: ms });
    } catch (e) { repondre("🥵 Error: " + e); }
});

// --- DIDONG ---
zokou({ nomCom: "didong", categorie: "Logo", reaction: "📱" }, async (dest, zk, commandeOptions) => {
    let { arg, repondre, prefixe, ms } = commandeOptions;
    if (!arg || arg.length === 0) return repondre(`*Example:* ${prefixe}didong Timoth`);

    try {
        repondre("*Processing...*");
        var maker = await mumaker.ephoto("https://ephoto360.com/tao-anh-che-vui-tu-choi-cuoc-goi-voi-ten-cua-ban-930.html", arg.join(' '));
        await zk.sendMessage(dest, { image: { url: maker.image }, caption: "*Logo by 𝚻𝚰𝚳𝚴𝚫𝐒𝚫-𝚻𝚳𝐃*", contextInfo }, { quoted: ms });
    } catch (e) { repondre("🥵 Error: " + e); }
});

// --- TEXTPRO EFFECTS (WALL, SUMMER, NEON, GLITCH, ETC) ---
const textProEffects = [
    { nom: "wall", url: "https://textpro.me/break-wall-text-effect-871.html", react: "👍" },
    { nom: "summer", url: "https://textpro.me/create-sunset-light-text-effects-online-for-free-1124.html", react: "🌞" },
    { nom: "neonlight", url: "https://textpro.me/create-glowing-neon-light-text-effect-online-free-1061.html", react: "💡" },
    { nom: "greenneon", url: "https://textpro.me/green-neon-text-effect-874.html", react: "🟢" },
    { nom: "glitch", url: "https://textpro.me/create-impressive-glitch-text-effects-online-1027.html", react: "🎛️" },
    { nom: "devil", url: "https://textpro.me/create-neon-devil-wings-text-effect-online-free-1014.html", react: "😈" },
    { nom: "snow", url: "https://textpro.me/create-beautiful-3d-snow-text-effect-online-1101.html", react: "❄️" },
    { nom: "thunder", url: "https://textpro.me/online-thunder-text-effect-generator-1031.html", react: "⚡" }
];

textProEffects.forEach(effect => {
    zokou({ nomCom: effect.nom, categorie: "Logo", reaction: effect.react }, async (dest, zk, commandeOptions) => {
        const { arg, repondre, ms, prefixe } = commandeOptions;
        if (!arg || arg.length === 0) return repondre(`*Example:* ${prefixe}${effect.nom} Timnasa`);

        try {
            let data = await mumaker.textpro(effect.url, arg.join(' '));
            await zk.sendMessage(dest, { image: { url: data.image }, caption: "*Logo by 𝚻𝚰𝚳𝚴𝚫𝐒𝚫-𝚻𝚳𝐃*", contextInfo }, { quoted: ms });
        } catch (e) { repondre("🥵 Error: " + e); }
    });
});

// --- GOLD LOGO ---
zokou({ nomCom: "gold", categorie: "Logo", reaction: "🧚🏿‍♀️" }, async (dest, zk, commandeOptions) => {
    let { ms, arg, prefixe, repondre } = commandeOptions;
    if (!arg || arg.length === 0) return repondre(`${prefixe}gold Timnasa`);

    try {
        repondre("*Creating gold text...*");
        var img = await mumaker.ephoto("https://en.ephoto360.com/modern-gold-4-213.html", arg.join(' '));
        await zk.sendMessage(dest, { image: { url: img.image }, caption: "*Logo by 𝚻𝚰𝚳𝚴𝚫𝐒𝚫-𝚻𝚳𝐃*", contextInfo }, { quoted: ms });
    } catch (e) { repondre(e); }
});
