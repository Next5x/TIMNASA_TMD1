const { zokou } = require("../framework/zokou");
const axios = require("axios");

// INSTAGRAM
zokou({
  nomCom: "insta",
  reaction: "📸",
  categorie: "Download"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  if (!arg[0]) return repondre("Weka link ya Instagram!");

  try {
    const res = await axios.get(`https://api.vreden.my.id/api/igdownload?url=${arg[0]}`);
    const media = res.data.result[0].url;
    await zk.sendMessage(dest, { video: { url: media }, caption: `GitHub: https://github.com/timnasax` }, { quoted: ms });
  } catch (e) { repondre("Imeshindikana kupakua."); }
});

// FACEBOOK
zokou({
  nomCom: "fb",
  reaction: "🔵",
  categorie: "Download"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  if (!arg[0]) return repondre("Weka link ya Facebook!");

  try {
    const res = await axios.get(`https://api.vreden.my.id/api/fbdownload?url=${arg[0]}`);
    const video = res.data.result.hd || res.data.result.sd;
    await zk.sendMessage(dest, { video: { url: video }, caption: `GitHub: https://github.com/timnasax` }, { quoted: ms });
  } catch (e) { repondre("Video haikuonekana."); }
});
