const { zokou } = require("../framework/zokou");
const fancy = require("../commandes/style");

zokou({ nomCom: "fancy", categorie: "Fun", reaction: "✍️" }, async (dest, zk, commandeOptions) => {
    const { arg, repondre, prefixe } = commandeOptions;

    try {
        // 1. If no arguments are provided, show the instruction and the full list
        if (!arg || arg.length === 0) {
            const listHeader = `*─── 『 FANCY TEXT MENU 』 ───*\n\n` +
                               `Usage: *${prefixe}fancy [number] [text]*\n` +
                               `Example: *${prefixe}fancy 7 Hello World*\n\n` +
                               `*AVAILABLE STYLES:*`;
            
            // The repeat(4001) creates the "Read More" tag in WhatsApp
            return await repondre(listHeader + String.fromCharCode(8206).repeat(4001) + fancy.list('Style Example', fancy));
        }

        // 2. Extract the Style ID and the Text
        const styleIndex = parseInt(arg) - 1; // Array indexes start at 0
        const textToFormat = arg.slice(1).join(" ");

        // 3. Validation: Ensure ID is a number and text is provided
        if (isNaN(styleIndex) || !textToFormat) {
            return await repondre(`❌ *Invalid Format!*\n\nUsage: *${prefixe}fancy [number] [text]*\nExample: *${prefixe}fancy 10 Hello*`);
        }

        // 4. Check if the selected style exists in the library
        if (fancy[styleIndex]) {
            // Apply the chosen style to the text
            const result = fancy.apply(fancy[styleIndex], textToFormat);
            return await repondre(result);
        } else {
            return await repondre(`❌ Style number *${arg}* not found!\nType *${prefixe}fancy* to see the list.`);
        }

    } catch (error) {
        console.error("Fancy Command Error:", error);
        return await repondre("_An error occurred while processing the command._");
    }
});
