const {timoth}=require("../timnasa/timoth")


timoth({nomCom:"restart",categorie:"Mods",reaction:"📴"},async(dest,z,com)=>{


  
const{repondre,ms,dev,superUser}=com;

  if(!superUser)
  {
    return repondre("This command is for owner only");
  }

  const {exec}=require("child_process")

    repondre("TimnasaTech bot Restarting please wait😔😔😔⏳");

  exec("pm2 restart all");
  

  



})
