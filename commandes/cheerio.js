const { zokou } = require('../framework/zokou');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

zokou({
    nomCom: "checkrepo",
    categorie: "System",
    reaction: "🔍"
}, async (dest, zk, commandeOptions) => {
    const { repondre, superUser } = commandeOptions;

    // 1. Ruhusa ya Owner pekee
    if (!superUser) return repondre("Command hii ni kwa ajili ya Owner pekee.");

    const repoOwner = "Next5x";
    const repoName = "TIMNASA_TMD1";
    const repoUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/commandes`;

    await repondre(`🛰️ *TIMNASA SYSTEM CHECK* 🛰️\n\nInachanganua commands kutoka:\nhttps://github.com/${repoOwner}/${repoName}\n\nTafadhali subiri...`);

    try {
        // 2. Omba orodha ya files kutoka GitHub API
        const response = await axios.get(repoUrl, {
            headers: { 'User-Agent': 'TIMNASA-MD' }
        });

        if (!response.data || !Array.isArray(response.data)) {
            return repondre("❌ Imeshindwa kupata data kutoka GitHub. Hakikisha folder la 'commandes' lipo.");
        }

        const githubFiles = response.data
            .filter(file => file.name.endsWith('.js'))
            .map(file => file.name);

        // 3. Soma files zilizopo kwenye bot kwa sasa
        const localPath = path.join(__dirname, '../commandes');
        const localFiles = fs.readdirSync(localPath).filter(file => file.endsWith('.js'));

        // 4. Linganisha tofauti
        const missingLocally = githubFiles.filter(file => !localFiles.includes(file));
        const missingOnGithub = localFiles.filter(file => !githubFiles.includes(file));
        const matchingFiles = githubFiles.filter(file => localFiles.includes(file));

        // 5. Tengeneza Ripoti
        let report = `*📊 TIMNASA REPO DIAGNOSIS*\n`;
        report += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
        report += `✅ *Commands Zinazofanana:* ${matchingFiles.length}\n`;
        report += `📥 *Zilizopo GitHub pekee:* ${missingLocally.length}\n`;
        report += `📤 *Zilizopo Local pekee:* ${missingOnGithub.length}\n\n`;

        if (missingLocally.length > 0) {
            report += `⚠️ *Ujumbe:* Kuna commands mpya GitHub ambazo bot yako haina:\n`;
            missingLocally.forEach((file, i) => {
                report += `${i + 1}. 📄 ${file}\n`;
            });
            report += `\n*Ushauri:* Tumia 'git pull' au redeploy bot yako kupata hizi mpya.\n`;
        } else {
            report += `🌟 *Hongera!* Bot yako imesawazishwa kikamilifu na GitHub repository yako.\n`;
        }

        if (missingOnGithub.length > 0) {
            report += `\n🛠️ *Commands za ziada (Local):*\n`;
            missingOnGithub.forEach(file => report += `- ${file}\n`);
        }

        await repondre(report);

    } catch (error) {
        console.error(error);
        let errorMsg = "❌ Hitilafu imetokea wakati wa kukagua GitHub.";
        if (error.response && error.response.status === 404) {
            errorMsg = "❌ Folder la 'commandes' halikupatikana kwenye repository yako.";
        } else if (error.response && error.response.status === 403) {
            errorMsg = "❌ GitHub API Limit imefikiwa. Jaribu tena baada ya muda kidogo.";
        }
        repondre(errorMsg);
    }
});
