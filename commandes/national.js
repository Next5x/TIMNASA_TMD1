const { zokou } = require("../framework/zokou");

// 1. DATA YA MATAIFA (Nimeongeza Pakistan na Zimbabwe)
const nationData = {
  "tanzania": { flag: "🇹🇿", code: "255", song: "https://files.catbox.moe/e4c48n.mp3" },
  "kenya": { flag: "🇰🇪", code: "254", song: "https://files.catbox.moe/e4c48n.mp3" },
  "uganda": { flag: "🇺🇬", code: "256", song: "https://files.catbox.moe/e4c48n.mp3" },
  "southafrica": { flag: "🇿🇦", code: "27", song: "https://files.catbox.moe/e4c48n.mp3" },
  "nigeria": { flag: "🇳🇬", code: "234", song: "https://files.catbox.moe/e4c48n.mp3" },
  "usa": { flag: "🇺🇸", code: "1", song: "https://files.catbox.moe/e4c48n.mp3" },
  "rwanda": { flag: "🇷🇼", code: "250", song: "https://files.catbox.moe/e4c48n.mp3" },
  "burundi": { flag: "🇧🇮", code: "257", song: "https://files.catbox.moe/e4c48n.mp3" },
  "zambia": { flag: "🇿🇲", code: "260", song: "https://files.catbox.moe/e4c48n.mp3" },
  "somalia": { flag: "🇸🇴", code: "252", song: "https://files.catbox.moe/e4c48n.mp3" },
  "pakistan": { flag: "🇵🇰", code: "92", song: "https://files.catbox.moe/e4c48n.mp3" },
  "zimbabwe": { flag: "🇿🇼", code: "263", song: "https://files.catbox.moe/e4c48n.mp3" }
};

// 2. FUNCTION KUU YA KUTAG
async function executeNationTag(dest, zk, commandeOptions, countryKey) {
  const { ms, repondre, arg, verifGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

  if (!verifGroupe) return repondre("✋🏿 Amri hii ni ya makundi pekee!");
  if (!(verifAdmin || superUser)) return repondre("❌ Ni Admins pekee wanaoweza kutag Taifa!");

  const country = nationData[countryKey];
  
  // Weka reaction ya bendera
  await zk.sendMessage(dest, { react: { text: country.flag, key: ms.key } });

  let membresGroupe = await infosGroupe.participants;
  // Chuja namba za nchi husika
  let raia = membresGroupe.filter(m => m.id.startsWith(country.code));

  if (raia.length === 0) {
    return repondre(`Hakuna raia wa ${countryKey.toUpperCase()} (+${country.code}) kwenye kundi hili!`);
  }

  let mess = arg && arg.join(' ') ? arg.join(' ') : `Amkeni Taifa la ${countryKey.toUpperCase()}! ${country.flag}`;

  let tag = `╭─────────────━┈⊷ 
│ ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ ${countryKey.toUpperCase()} ${country.flag}
╰─────────────━┈⊷ 
│👑 *Kiongozi* : *${nomAuteurMessage}*
│📢 *Ujumbe* : *${mess}* ╰─────────────━┈⊷\n\n`;

  for (const membre of raia) {
    tag += `${country.flag} @${membre.id.split("@")[0]}\n`;
  }

  // Tuma Tag na Wimbo
  await zk.sendMessage(dest, { text: tag, mentions: raia.map(i => i.id) }, { quoted: ms });
  await zk.sendMessage(dest, { audio: { url: country.song }, mimetype: 'audio/mp4', ptt: true }, { quoted: ms });
}

// 3. KUSAJILI COMMANDS KWENYE ZOKOU
Object.keys(nationData).forEach((countryName) => {
  zokou(
    { nomCom: countryName, categorie: "Group", reaction: nationData[countryName].flag },
    async (dest, zk, commandeOptions) => {
      await executeNationTag(dest, zk, commandeOptions, countryName);
    }
  );
});
