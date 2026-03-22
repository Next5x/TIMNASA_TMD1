"use strict";

const { zokou } = require("../framework/zokou");

// Hifadhi ya muda ya namba zilizozuiwa (RAM)
global.mutedUsers = global.mutedUsers || [];

// 1. AMRI YA KUZUIA MTU (BAN)
zokou({
    nomCom: "ban-chat",
    categorie: "Group",
    reaction: "🚫"
}, async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, isGroupAdmins, superUser, isBotGroupAdmins } = commandeOptions;

    // Usalama: Admin au Owner pekee
    if (!isGroupAdmins && !superUser) return repondre("❌ Samahani, amri hii ni kwa ajili ya Admins tu.");
    if (!isBotGroupAdmins) return repondre("❌ Tafadhali nipe u-Admin kwanza ili niweze kufuta ujumbe.");

    // Kupata JID ya mtu aliye-tagiwa
    let user = ms.message.extendedTextMessage?.contextInfo?.mentionedJid?. || (arg ? arg.replace(/[^0-9]/g, '') + "@s.whatsapp.net" : null);

    if (!user) return repondre("Tafadhali m-tag mtu unayetaka kumzuia asitume ujumbe.");

    if (!global.mutedUsers.includes(user)) {
        global.mutedUsers.push(user);
        repondre(`✅ Mtumiaji @${user.split('@')} amezuiliwa rasmi. Kila ujumbe atakaotuma utafutwa papo hapo.`, { mentions: [user] });
    } else {
        repondre("Mtumiaji huyu tayari ameshazuiliwa.");
    }
});

// 2. AMRI YA KURUHUSU MTU (UNBAN)
zokou({
    nomCom: "unban-chat",
    categorie: "Group",
    reaction: "✅"
}, async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, isGroupAdmins, superUser } = commandeOptions;
    
    if (!isGroupAdmins && !superUser) return repondre("❌ Amri hii ni kwa ajili ya Admins tu.");

    let user = ms.message.extendedTextMessage?.contextInfo?.mentionedJid?. || (arg ? arg.replace(/[^0-9]/g, '') + "@s.whatsapp.net" : null);
    
    if (!user) return repondre("M-tag mtu unayetaka kumruhusu achat tena.");

    if (global.mutedUsers.includes(user)) {
        global.mutedUsers = global.mutedUsers.filter(u => u !== user);
        repondre(`✅ Mtumiaji @${user.split('@')} ameruhusiwa kuchat tena.`, { mentions: [user] });
    } else {
        repondre("Mtumiaji huyu hayupo kwenye orodha ya waliozuiliwa.");
    }
});

module.exports = { zokou };
