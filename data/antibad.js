const badWords = [
  // Kiingereza
  "fuck", "shit", "bitch", "asshole", "nigga", "nigger", "sex", "porn", "cunt", "penis", "vagina",
  "dick", "boobs", "bastard", "whore", "jerk", "suck", "gay", "lesbian", "retard", "slut", "hoe",
  "motherfucker", "madafaka", "goddamn", "pussy", "fucker",

  // Kiswahili & Slang za Afrika Mashariki
  "mkundu", "kuma", "matako", "punda", "tumbua", "tombwa", "msenge", "malaya", "demu", "manii",
  "manina", "basha", "basha mkubwa", "firwa", "shoga", "mashoga", "mavi", "kinyesi", "mkojo",
  "ngono", "tigo", "bonge la demu", "kichwa maji", "shetani wewe", "mtoto wa kike", "mshenzi",
  "mchawi", "nyoka", "huyo kahaba", "kisenge", "nimekumwaga", "nitakutomba", "chezea nyeti zako", "nyege", 

  // Emoji na alama chafu
  "🖕", "🍑", "🍆", "💦", "🔞", "👅", "👙", "👄", "👠", "💋", "💣", "🔥",

  // Slang & kificho (code names) commonly used
  "mjinga", "mjinga wewe", "bwege", "sugu", "bitchy", "wack", "mbwa", "mbwa wewe", "mbuzi", "kondoo",
  "kimeo", "kichaa", "nyang'au", "matapeli", "fisi", "chura", "kula tigo", "mpapaso", "sponsor", "mahousegirl"
];


// Convert all words to lowercase for accurate matching
const lowerBadWords = badWords.map(w => w.toLowerCase());

// Check if a message contains bad text
function containsBadText(text) {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return lowerBadWords.some(bad => lowerText.includes(bad));
}

module.exports = {
  containsBadText
};