const { timoth } = require("../timnasa/timoth");
const moment = require("moment-timezone");
const { getBuffer } = require("../timnasa/dl/Function");
const { default: axios } = require('axios');

const runtime = function (seconds) { 
 seconds = Number(seconds); 
 var d = Math.floor(seconds / (3600 * 24)); 
 var h = Math.floor((seconds % (3600 * 24)) / 3600); 
 var m = Math.floor((seconds % 3600) / 60); 
 var s = Math.floor(seconds % 60); 
 var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " d, ") : ""; 
 var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " h, ") : ""; 
 var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " m, ") : ""; 
 var sDisplay = s > 0 ? s + (s == 1 ? " second" : " s") : ""; 
 return dDisplay + hDisplay + mDisplay + sDisplay; 
}
timoth({
  'nomCom': "agents",
  'categorie': 'General',
  'reaction': "🤙"
}, async (_0x1b06c5, _0x54bb8b, _0x2358bf) => {
  const {
    ms: _0x2aecc0,
    mybotpic: _0x43a6e2
  } = _0x2358bf;
  const _0x21b56d = [{
    'nom': "TimnasaTech agents",
    'nom': "TimnasaTech from Tanzania 🇹🇿",
    'numero': "255784766591"
  }, {
    'nom': "Belta from Kenya 🇰🇪",
    'numero': "254114141192"
  }, {
    'nom': "Ibrahim Adams Kenya 🇰🇪",
    'numero': "254710772666"
  }, {
    'nom': "Baraka Bega From Tanzania 🇹🇿",
    'numero': "255762190568"
  }, {
    'nom': "Boniphace from Tanzania 🇹🇿",
    'numero': "255716661569"
  }, {
    'nom': "Joel it🕷️ From Tanzania 🇹🇿",
    'numero': "255714595078"
  }, {
    'nom': "Dullah From Tanzania 🇹🇿",
    'numero': "255716945971"
  }, {
    'nom': "YassinTech From Tanzania 🇹🇿",
    'numero': "255621995482"
  }, {
'nom': "HansTech From Tanzania 🇹🇿",
    'numero': "255692540143"
  }, {
'nom': "🤕",
    'numero': "load...."
  }, {
'nom': "🤕",
    'numero': "Load...."
  }, {
'nom': "Kingtimnasa-tech From Tanzania 🇹🇿",
    'numero': "255756469954"
  }, {
    'nom': "🤕",
    'numero': "load...."
  }];
  let _0x2d5c7e = "Hello👋  *I'm TimnasaTech Wa Bot* \nThe Following Numbers Are For  *TIMNASA_TMD* Agents, \nYou Can Ask Them Anything Regarding Timnasa Bot \nFollow Our Channel For More Tech :https://whatsapp.com/channel/0029VajweHxKQuJP6qnjLM31 \n*KEEP USING TIMNASA TMD*:\n\n";
  for (const _0x14eeec of _0x21b56d) {
    _0x2d5c7e += "----------------\n(●) " + _0x14eeec.nom + " : https://wa.me/" + _0x14eeec.numero + "\n";
  }
  var _0x11d31d = _0x43a6e2();
  if (_0x11d31d.match(/\.(mp4|gif)$/i)) {
    try {
      _0x54bb8b.sendMessage(_0x1b06c5, {
        'video': {
          'url': _0x11d31d
        },
        'caption': _0x2d5c7e
      }, {
        'quoted': _0x2aecc0
      });
    } catch (_0x55af9c) {
      console.log("🥵🥵 Menu erreur " + _0x55af9c);
      repondre("🥵🥵 Menu erreur " + _0x55af9c);
    }
  } else {
    if (_0x11d31d.match(/\.(jpeg|png|jpg)$/i)) {
      try {
        _0x54bb8b.sendMessage(_0x1b06c5, {
          'image': {
            'url': _0x11d31d
          },
          'caption': _0x2d5c7e
        }, {
          'quoted': _0x2aecc0
        });
      } catch (_0x39b1ed) {
        console.log("🥵🥵 Menu erreur " + _0x39b1ed);
        repondre("🥵🥵 Menu erreur " + _0x39b1ed);
      }
    } else {
      repondre(_0x11d31d);
      repondre("link error");
    }
  }
});
