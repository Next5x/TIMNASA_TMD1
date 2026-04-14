const { zokou } = require("../framework/zokou");
const { exec } = require("child_process");
const s = require("../set");
const Heroku = require('heroku-client');

zokou({
  nomCom: "fixd",
  categorie: "OWNER",
  reaction: "🛠️"
}, async (dest, zk, context) => {
  const { repondre, superUser } = context;

  // 1. Security: Restricted to Bot Owner
  if (!superUser) {
    return repondre("*This command is restricted to Timnasa Tech only! 👻*");
  }

  // 2. Check for required Heroku credentials
  if (!s.HEROKU_API_KEY || !s.HEROKU_APP_NAME) {
    return repondre("❌ *Error:* Please configure `HEROKU_API_KEY` and `HEROKU_APP_NAME` in your Heroku settings first.");
  }

  const heroku = new Heroku({ token: s.HEROKU_API_KEY });
  await repondre("⚙️ *Timnasa TMD is fixing system files and checking for updates...*");

  // 3. Force pull the latest code from GitHub
  // This resets the local files to match the 'main' branch of your repository
  exec("git fetch --all && git reset --hard origin/main", async (err, stdout, stderr) => {
    if (err) {
      return repondre(`❌ *Git Error:* ${err.message}`);
    }

    await repondre("✅ *Updates downloaded successfully. Starting Auto-Deploy...*");

    try {
      // 4. Clear build cache to prevent old dependency conflicts
      await heroku.delete(`/apps/${s.HEROKU_APP_NAME}/build-cache`);
      
      // 5. Restart all dynos (This forces Heroku to boot up using the new code)
      await heroku.delete(`/apps/${s.HEROKU_APP_NAME}/dynos`);

      await repondre("🚀 *FIXD COMPLETE!* \n\nThe bot has been updated and is restarting. Please wait 30-60 seconds for it to come back online.");
      
    } catch (error) {
      console.error("Heroku Deploy Error:", error);
      await repondre("⚠️ *Code was updated, but Auto-Deploy triggered an error.* I have attempted a standard Restart instead.");
      
      // Fallback: Just restart dynos if cache clearing fails
      await heroku.delete(`/apps/${s.HEROKU_APP_NAME}/dynos`);
    }
  });
});
