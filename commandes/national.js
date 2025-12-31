const nationList = [
  { name: "tanzania", code: "255", flag: "🇹🇿", song: "https://files.catbox.moe/e4c48n.mp3" },
  { name: "kenya", code: "254", flag: "🇰🇪", song: "https://files.catbox.moe/e4c48n.mp3" },
  { name: "uganda", code: "256", flag: "🇺🇬", song: "https://files.catbox.moe/e4c48n.mp3" },
  { name: "somalia", code: "252", flag: "🇸🇴", song: "https://files.catbox.moe/e4c48n.mp3" },
  { name: "southafrica", code: "27", flag: "🇿🇦", song: "https://files.catbox.moe/e4c48n.mp3" },
  { name: "nigeria", code: "234", flag: "🇳🇬", song: "https://files.catbox.moe/e4c48n.mp3" },
  { name: "usa", code: "1", flag: "🇺🇸", song: "https://files.catbox.moe/e4c48n.mp3" },
  { name: "zambia", code: "260", flag: "🇿🇲", song: "https://files.catbox.moe/e4c48n.mp3" },
  { name: "zimbabwe", code: "263", flag: "🇿🇼", song: "https://files.catbox.moe/e4c48n.mp3" },
  { name: "rwanda", code: "250", flag: "🇷🇼", song: "https://files.catbox.moe/e4c48n.mp3" },
  { name: "burundi", code: "257", flag: "🇧🇮", song: "https://files.catbox.moe/e4c48n.mp3" }
];

nationList.forEach((country) => {
  zokou({ nomCom: country.name, categorie: "Group" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, verifGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

    if (!verifGroupe) return repondre("Command hii ni ya makundi pekee!");
    if (!(verifAdmin || superUser)) return repondre("Ni Admins pekee wanaweza kutag Taifa!");

    // Weka bendera kama reaction
    await zk.sendMessage(dest, { react: { text: country.flag, key: ms.key } });

    let membresGroupe = await infosGroupe.participants;
    let raia = membresGroupe.filter(m => m.id.startsWith(country.code));

    if (raia.length === 0) {
      return repondre(`Hakuna namba za ${country.name.toUpperCase()} kwenye kundi hili!`);
    }

    let ujumbe = arg && arg.join(' ') ? arg.join(' ') : `Amkeni watu wa ${country.name.toUpperCase()}! ${country.flag}`;

    let tag = `╭─────────────━┈⊷ 
│ ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ ${country.name.toUpperCase()} ${country.flag}
╰─────────────━┈⊷ 
│🏛️ *Taifa* : ${country.name.toUpperCase()}
│👑 *Kiongozi* : *${nomAuteurMessage}* │📢 *Tangazo* : *${ujumbe}* ╰─────────────━┈⊷\n\n`;

    for (const membre of raia) {
      tag += `${country.flag} @${membre.id.split("@")[0]}\n`;
    }

    // Tuma Tag na Wimbo
    await zk.sendMessage(dest, { text: tag, mentions: raia.map((i) => i.id) }, { quoted: ms });
    await zk.sendMessage(dest, { audio: { url: country.song }, mimetype: 'audio/mp4', ptt: true }, { quoted: ms });
  });
});
