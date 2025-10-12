
var tabCmds = [];
let cm = [];
function timoth(obj, fonctions) {
    let infoComs = obj;
    if (!obj.categorie) {
        infoComs.categorie = "General";
    }
    if (!obj.reaction) {
        infoComs.reaction = "🙂";
    }
    infoComs.fonction = fonctions;
    cm.push(infoComs);
    // console.log('chargement...')
    return infoComs;
}
module.exports = { timoth, Module: timoth, cm };
