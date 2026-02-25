const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou({
  nomCom: "people",
  aliases: ["country", "nchi"],
  reaction: "🌍",
  categorie: "Information"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    if (!arg[0]) {
      return repondre("❌ Tafadhali andika jina la nchi.\n\nMfano: .people Tanzania");
    }

    const countryName = arg.join(" ");
    await zk.sendPresenceUpdate('composing', dest);

    // 1. Pata data kutoka RestCountries API
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`;
    const response = await axios.get(url);
    const data = response.data[0];

    if (!data) {
      return repondre("❌ Siwezi kupata taarifa za nchi hiyo. Hakikisha umeandika jina la nchi kwa usahihi (kwa Kiingereza).");
    }

    // 2. Chambua taarifa (Parsing Data)
    const name = data.name.common;
    const officialName = data.name.official;
    const capital = data.capital ? data.capital[0] : "N/A";
    const region = data.region;
    const subregion = data.subregion || "N/A";
    const population = data.population.toLocaleString();
    const flag = data.flags.png;
    const map = data.maps.googleMaps;
    
    // Pata Currency (Pesa)
    const currencyKeys = Object.keys(data.currencies);
    const currency = data.currencies[currencyKeys[0]].name;
    const symbol = data.currencies[currencyKeys[0]].symbol;

    // Pata Lugha
    const languages = Object.values(data.languages).join(", ");

    // 3. Tengeneza ujumbe
    const countryInfo = `
🌍 *COUNTRY INFORMATION: ${name.toUpperCase()}* 🌍

📌 *Official Name:* ${officialName}
🏛️ *Capital City:* ${capital}
👥 *Population:* ${population}
🗺️ *Region:* ${region} (${subregion})
💰 *Currency:* ${currency} (${symbol})
🗣️ *Languages:* ${languages}
📍 *Google Maps:* ${map}

🔗 *GitHub:* https://github.com/timnasax
> Taarifa hizi ni kwa mujibu wa kumbukumbu za kimataifa.
`.trim();

    // 4. Tuma ujumbe ukiwa na bendera ya nchi
    await zk.sendMessage(dest, {
      image: { url: flag },
      caption: countryInfo,
      contextInfo: {
        externalAdReply: {
          title: `KNOW MORE ABOUT ${name}`,
          body: "Timnasa International Data",
          sourceUrl: "https://github.com/timnasax",
          mediaType: 1
        }
      }
    }, { quoted: ms });

  } catch (e) {
    console.error(e);
    return repondre("❌ Nchi hiyo haijapatikana. Jaribu kutumia majina ya nchi kwa Kiingereza (mfano: .people Kenya, .people USA).");
  }
});
