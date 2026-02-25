const { zokou } = require("../framework/zokou");

zokou({
  nomCom: "saveall",
  reaction: "📇",
  categorie: "Group"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms, isGroup, participants, superUser } = commandeOptions;

  // 1. Hakikisha command inatumika kwenye group
  if (!isGroup) return repondre("❌ Command hii inafanya kazi kwenye makundi (groups) pekee.");

  // 2. Ruhusu mmiliki wa bot pekee (SuperUser) kutumia hii kwa usalama wa faragha
  if (!superUser) return repondre("❌ Ni mmiliki wa bot pekee anayeweza kuchukua namba za watu.");

  try {
    await repondre("⏳ Ninakusanya namba za washiriki, tafadhali subiri...");

    let contactList = `--- CONTACT LIST FROM: ${dest} ---\n\n`;
    let count = 1;

    // 3. Pata namba za washiriki wote
    for (let mem of participants) {
      contactList += `${count}. ${mem.id.split("@")[0]}\n`;
      count++;
    }

    const ownerId = zk.user.id.split(":")[0] + "@s.whatsapp.net";
    const fileName = `./contacts_${dest.split('@')[0]}.txt`;

    // 4. Tengeneza file la muda la maandishi (Buffer)
    const buffer = Buffer.from(contactList, 'utf-8');

    // 5. Tuma faili hilo kwenye Inbox ya mmiliki
    await zk.sendMessage(ownerId, {
      document: buffer,
      mimetype: 'text/plain',
      fileName: `Contacts_Group.txt`,
      caption: `✅ Hapa kuna orodha ya namba ${participants.length} kutoka kwenye group.\n\n🔗 GitHub: https://github.com/timnasax`
    });

    return repondre("✅ Orodha ya namba imetumwa kwenye inbox yako ya mmiliki.");

  } catch (e) {
    console.log(e);
    return repondre(`❌ Kushindwa kukusanya namba: ${e.message}`);
  }
});
