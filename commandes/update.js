"use strict";

const { zokou } = require("../framework/zokou");
const { exec } = require("child_process");

zokou({
    nomCom: "update",
    category: "System",
    reaction: "🆙"
}, async (dest, zk, commandeOptions) => {
    const { repondre, superUser } = commandeOptions;

    // Security: Only the Owner can update the bot
    if (!superUser) return repondre("❌ *TIMNASA-TMD:* Unauthorized access. Only the Owner can trigger updates.");

    repondre("🔄 *TIMNASA-TMD Update System:* Connecting to GitHub...");

    const repoUrl = "https://github.com/Next5x/TIMNASA_TMD1";

    // Step 1: Check if the remote is set, if not, set it. Then Fetch and Pull.
    const updateScript = `git remote set-url origin ${repoUrl} && git fetch origin && git reset --hard origin/main && git pull origin main`;

    exec(updateScript, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return repondre(`❌ *Update Failed:* ${err.message}`);
        }

        if (stdout.includes("Already up to date") || stderr.includes("Already up to date")) {
            return repondre("✅ *TIMNASA-TMD* is already running the latest version from GitHub.");
        }

        repondre(`📥 *Update Downloaded Successfully!*\n\n*Changes summary:* \n${stdout.slice(0, 500)}\n\n*Rebuilding dependencies...*`);

        // Step 2: Install any new packages added to package.json
        exec("npm install", (installErr, installStdout, installStderr) => {
            if (installErr) {
                return repondre(`⚠️ *Warning:* Update pulled but packages failed to install: ${installErr.message}`);
            }

            repondre("🚀 *TIMNASA-TMD V2 Updated!* System is restarting to apply changes...");

            // Step 3: Kill the process so the hosting auto-restarter (PM2, Heroku, or Docker) reboots it
            setTimeout(() => {
                process.exit();
            }, 5000);
        });
    });
});
