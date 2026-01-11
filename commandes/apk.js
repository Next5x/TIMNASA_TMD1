const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou({
    nomCom: "apk",
    categorie: "Download",
    reaction: "📥"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, ms } = commandeOptions;

    if (!arg[0]) {
        return repondre("Please provide the name of the app you want to download. \n\nExample: .playstore facebook");
    }

    const appName = arg.join(" ");

    try {
        repondre(`🔍 Searching for *${appName}* on Play Store...`);

        // Using a reliable API for APK downloads
        const searchUrl = `https://api.maher-zubair.tech/download/apk?id=${encodeURIComponent(appName)}`;
        const response = await axios.get(searchUrl);
        const data = response.data;

        if (!data || data.status !== 200) {
            return repondre("Sorry, the app was not found or the server is busy.");
        }

        const appDetails = data.result;
        const caption = `
✨ *TIMNASA PLAYSTORE DOWNLOADER* ✨

📦 *Name:* ${appDetails.name}
🏢 *Developer:* ${appDetails.developer}
⚖️ *Size:* ${appDetails.size}
🕒 *Last Updated:* ${appDetails.lastUpdate}

_Please wait, I am sending the APK file..._`;

        // Send App Info and Icon
        await zk.sendMessage(dest, { 
            image: { url: appDetails.icon }, 
            caption: caption 
        }, { quoted: ms });

        // Send the actual APK Document
        await zk.sendMessage(dest, { 
            document: { url: appDetails.downloadLink }, 
            mimetype: "application/vnd.android.package-archive", 
            fileName: `${appDetails.name}.apk` 
        }, { quoted: ms });

    } catch (e) {
        console.log(e);
        repondre("An error occurred while downloading the APK.");
    }
});
