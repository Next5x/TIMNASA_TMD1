const { zokou } = require("../framework/zokou");
const { exec } = require("child_process");
const axios = require("axios");
const s = require("../set");

// 1. WEBSITE CLONE (Saves as HTML file)
zokou({ nomCom: "webclone", categorie: "Tools", reaction: "🌐" }, async (dest, zk, context) => {
    const { arg, repondre, superUser, ms } = context;
    if (!superUser) return repondre("*Owner only!*");
    if (!arg) return repondre("Please provide a website URL.");

    try {
        const response = await axios.get(arg);
        const html = response.data;
        await zk.sendMessage(dest, { 
            document: Buffer.from(html), 
            fileName: 'cloned_site.html', 
            mimetype: 'text/html',
            caption: `*Timnasa TMD* - Source code for: ${arg}`
        }, { quoted: ms });
    } catch (e) {
        repondre("❌ Error: Could not fetch website source.");
    }
});

// 2. GIT CLONE (Direct Download Link)
zokou({ nomCom: "gitclone", categorie: "Tools", reaction: "📁" }, async (dest, zk, context) => {
    const { arg, repondre } = context;
    if (!arg) return repondre("Provide a GitHub repo link.");
    const repoUrl = arg.replace(".git", "");
    const zipUrl = `${repoUrl}/archive/refs/heads/main.zip`;
    await repondre(`📦 *Repo Zip Link:* ${zipUrl}\n\n_Note: This assumes the default branch is 'main'._`);
});

// 3. SHELL (Execute Terminal Commands)
zokou({ nomCom: "shell", categorie: "Owner", reaction: "💻" }, async (dest, zk, context) => {
    const { arg, repondre, superUser } = context;
    if (!superUser) return;
    exec(arg.join(" "), (err, stdout, stderr) => {
        if (err) return repondre(`❌ Error:\n${err.message}`);
        if (stderr) return repondre(`⚠️ Stderr:\n${stderr}`);
        repondre(`📝 Output:\n${stdout}`);
    });
});

// 4. BROADCAST (Send to all groups)
zokou({ nomCom: "bc", categorie: "Owner", reaction: "📢" }, async (dest, zk, context) => {
    const { arg, superUser, repondre } = context;
    if (!superUser) return;
    if (!arg) return repondre("What message do you want to broadcast?");

    const groups = await zk.groupFetchAllParticipating();
    const gids = Object.keys(groups);
    await repondre(`📢 Sending broadcast to ${gids.length} groups...`);

    for (let id of gids) {
        await zk.sendMessage(id, { text: `*TIMNASA BROADCAST*\n\n${arg.join(" ")}` });
    }
    repondre("✅ Broadcast completed.");
});

// 5. SCREENSHOT (Web Capture)
zokou({ nomCom: "ss", categorie: "Tools", reaction: "📸" }, async (dest, zk, context) => {
    const { arg, repondre } = context;
    if (!arg) return repondre("Provide a URL to capture.");
    const ssUrl = `https://api.screenshotmachine.com?key=free&url=${arg}&dimension=1024x768`;
    await zk.sendMessage(dest, { image: { url: ssUrl }, caption: `*Timnasa TMD Screenshot*` }, { quoted: context.ms });
});

// 6. EVAL (Test JavaScript Code)
zokou({ nomCom: "eval", categorie: "Owner", reaction: "🧪" }, async (dest, zk, context) => {
    const { arg, repondre, superUser } = context;
    if (!superUser) return;
    try {
        let code = eval(arg.join(" "));
        if (typeof code !== 'string') code = require('util').inspect(code);
        await repondre(code);
    } catch (e) {
        await repondre(`❌ Eval Error:\n${String(e)}`);
    }
});

// 7. BLOCK USER
zokou({ nomCom: "lock", categorie: "Owner", reaction: "🚫" }, async (dest, zk, context) => {
    const { arg, superUser, repondre } = context;
    if (!superUser) return;
    let users = context.msg.mentionedJid ? context.msg.mentionedJid : arg + "@s.whatsapp.net";
    await zk.updateBlockStatus(users, "block");
    repondre("✅ User blocked.");
});

// 8. UNBLOCK USER
zokou({ nomCom: "unlock", categorie: "Owner", reaction: "✅" }, async (dest, zk, context) => {
    const { arg, superUser, repondre } = context;
    if (!superUser) return;
    let users = context.msg.mentionedJid ? context.msg.mentionedJid : arg + "@s.whatsapp.net";
    await zk.updateBlockStatus(users, "unblock");
    repondre("✅ User unblocked.");
});

// 9. JOIN GROUP
zokou({ nomCom: "join", categorie: "Owner", reaction: "🔗" }, async (dest, zk, context) => {
    const { arg, superUser, repondre } = context;
    if (!superUser) return;
    if (!arg) return repondre("Provide the group link.");
    try {
        const code = arg.split("https://chat.whatsapp.com/");
        await zk.groupAcceptInvite(code);
        repondre("✅ Successfully joined.");
    } catch (e) {
        repondre("❌ Failed to join group.");
    }
});

// 10. RESTART BOT
zokou({ nomCom: "reboot", categorie: "Owner", reaction: "📴" }, async (dest, zk, context) => {
    const { superUser, repondre } = context;
    if (!superUser) return;
    await repondre("🚀 *Timnasa TMD is restarting...*");
    process.exit();
});

// 11. SHAZAM (Find Song Name)
zokou({ nomCom: "shazam", categorie: "Fun", reaction: "🎵" }, async (dest, zk, context) => {
    const { ms, repondre } = context;
    const { msg } = context;
    if (msg.message.audioMessage || (msg.message.extendedTextMessage && msg.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage)) {
        repondre("🔍 Searching for song info... (Make sure API is configured)");
        // Note: Requires Shazam API key in set.js or integrated library
    } else {
        repondre("Reply to a short audio clip with .shazam");
    }
});

// 12. DEL (Delete Message)
zokou({ nomCom: "clean", categorie: "Tools", reaction: "🗑️" }, async (dest, zk, context) => {
    const { ms, repondre, superUser } = context;
    if (!ms.quoted) return repondre("Reply to the message you want to delete.");
    try {
        const key = {
            remoteJid: dest,
            fromMe: ms.quoted.key.fromMe,
            id: ms.quoted.key.id,
            participant: ms.quoted.key.participant
        };
        await zk.sendMessage(dest, { delete: key });
    } catch (e) {
        repondre("❌ Could not delete the message. Make sure I am admin.");
    }
});
