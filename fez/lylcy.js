const {timoth} =require("../timnasa/timoth");
const axios =require("axios");


timoth({ nomCom: "timolay",
        reaction: "✨",
        categorie: "Search" }, async (dest, zk, commandeOptions) => {
    
    const { repondre, arg, ms } = commandeOptions;  
        
   try {

    if (!arg || arg.length === 0) return repondre("Where is the name of music");

    let  result  = await axios.get(`http://api.maher-zubair.tech/search/lyrics?q=${arg.join(' ')}`);

    let lyrics = result.data.result;

    if (lyrics.error) return repondre("no lyrics found");

    let msg = `---------⬡┃TKM bot┃⬡--------

* *Artist :* ${lyrics.artist}


* *Title :* ${lyrics.title}


${lyrics.lyrics}`

    zk.sendMessage(dest,{image : { url : './media/lyrics-img.jpg'} , caption : msg}, { quoted : ms });
    
   } catch (err) {
       repondre('Error')
   }
        })
