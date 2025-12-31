const { zokou } = require("../framework/zokou");

zokou({ nomCom: "promoteall", categorie: "Group", reaction: "👨‍💼" }, async (dest, zk, commandeOptions) => {
  const { repondre, verifGroupe, infosGroupe, verifAdmin, superUser, idBot } = commandeOptions;

  // 1. Hakikisha ni kundi (group)
  if (!verifGroupe) return repondre("✋🏿 Amri hii ni ya vikundi pekee!");

  // 2. Hakikisha anayeiita ni Admin au Owner wa Bot
  if (!(verifAdmin || superUser)) {
    return repondre("❌ Amri hii ni ya Admins pekee!");
  }

  try {
    const metadata = await zk.groupMetadata(dest);
    const participants = metadata.participants;

    // 3. Tafuta watu ambao SIYO ma-admin bado
    const nonAdmins = participants
      .filter(p => p.admin === null)
      .map(p => p.id);

    if (nonAdmins.length === 0) {
      return repondre("Kila mwanachama kwenye kundi hili tayari ni Admin.");
    }

    repondre(`Zoezi limeanza... Nawapa upandaji wa daraja wanachama ${nonAdmins.length}. Tafadhali subiri.`);

    // 4. Tekeleza kitendo cha kuwapandisha vyeo (Promote)
    // Tunatumia zk.groupParticipantsUpdate na action "promote"
    await zk.groupParticipantsUpdate(dest, nonAdmins, "promote");

    repondre("✅ Mafanikio! Wanachama wote sasa wamepandishwa daraja na kuwa ma-administrator wa kundi.");

  } catch (e) {
    console.log("Error promoteall: " + e);
    repondre("Hitilafu imetokea. Hakikisha bot amepewa nguvu za Admin (Admin Rights).");
  }
});
