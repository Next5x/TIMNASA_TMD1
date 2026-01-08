const { zokou } = require('../framework/zokou');
const axios = require('axios');
const vm = require('vm'); // Ipo ndani ya Node.js tayari

zokou({
    nomCom: "analyze",
    categorie: "System",
    reaction: "🧪"
}, async (dest, zk, commandeOptions) => {
    const { arg, repondre, superUser } = commandeOptions;

    if (!superUser) return repondre("Amri hii ni kwa ajili ya Owner pekee.");
    if (!arg[0]) return repondre("Tafadhali andika jina la faili la kukagua.\nMfano: !analyze test.js");

    const fileName = arg[0].endsWith('.js') ? arg[0] : `${arg[0]}.js`;
    const repoOwner = "Next5x";
    const repoName = "TIMNASA_TMD1";
    const rawUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/commandes/${fileName}`;

    await repondre(`🧪 Inachanganua kodi ya *${fileName}* kutoka GitHub...`);

    try {
        // 1. Pakua kodi ghafi (Raw Code)
        const response = await axios.get(rawUrl);
        const code = response.data;

        // 2. Jaribu Syntax Analysis
        try {
            new vm.Script(code);
            
            // Kama imefika hapa, basi haina Syntax Error
            let report = `✅ *UCHAMBUZI UMEKAMILIKA*\n\n`;
            report += `📄 *Faili:* ${fileName}\n`;
            report += `STATUS: *SAFI (CLEAN)*\n\n`;
            report += `Kodi hii haina makosa ya kimsingi ya uandishi (Syntax Errors) na inaweza kuwashwa salama kwenye bot yako.`;
            
            await repondre(report);

        } catch (syntaxError) {
            // Kama kuna kosa, itatupa maelezo kamili
            let errorMsg = `❌ *KOSA LA KIUFUNDI LIMEGUNDULIKA*\n\n`;
            errorMsg += `📄 *Faili:* ${fileName}\n`;
            errorMsg += `⚠️ *Aina ya Kosa:* Syntax Error\n`;
            errorMsg += `📝 *Maelezo:* ${syntaxError.message}\n`;
            
            // Jaribu kutafuta namba ya mstari kama ipo
            if (syntaxError.stack) {
                const lineMatch = syntaxError.stack.match(/evalmachine\.<anonymous>:(\d+)/);
                if (lineMatch) {
                    errorMsg += `📍 *Mstari wa Kosa:* Line ${lineMatch[1]}\n`;
                }
            }

            errorMsg += `\n*Ushauri:* Sahihisha kosa hili kwenye GitHub yako kabla ya ku-pull kodi hii kwenye bot.`;
            await repondre(errorMsg);
        }

    } catch (fetchError) {
        if (fetchError.response && fetchError.response.status === 404) {
            repondre(`❌ Faili la *${fileName}* halikupatikana kwenye folder la commandes la repo yako.`);
        } else {
            repondre(`❌ Imeshindwa kuunganisha na GitHub (Network Error).`);
        }
    }
});
