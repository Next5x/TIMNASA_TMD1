const fs = require("fs");
const path = require("path");

// Path to antibug JSON file
const bugFilePath = path.join(__dirname, "../tmd/antibug.json");

// Bug triggers and lag/crash characters
const BUG_STRINGS = [
  // RTL, LTR manipulation
  "@everyone", "‏", "\u202e", "\u202d", "\u202c", "\u200f", "\u200e",

  // Unicode Crash Characters
  "࿋", "࿊", "⃝", "﷽", "۝", "𓆩𓆪", "𓂀", "𓅓", "𓇌", "𓃰",
  "𓃱", "𓃲", "𓃳", "𓃴", "𓃵", "𓃶", "𓃷", "𓃸", "𓃹", "𓃺", "𓃻",
  "𓀀", "𓁿", "𒀱", "𒀲", "𒀳", "𒀴", "𒀵", "𒀶",

  // Flags, Emojis, Symbols (used in crash codes)
  "🇮🇳", "🇧🇷", "🇨🇳", "🇰🇪", "🌚", "🌝", "💀", "🥵", "🔥🔥🔥🔥🔥", "🤬🤬🤬",
  "💥💥💥", "🌀🌀🌀", "💣💣💣", "🕳️🕳️🕳️", "🚫🚫🚫", "⚠️⚠️⚠️", "🔞🔞🔞", "😈😈😈",

  // Group invite spam
  "https://wa.me/join", "https://chat.whatsapp.com", "wa.me/join/",

  // Crash keywords & tricks
  "bug", "spam", "lag", "laggggggggggg", "爆炸", "كراش", "crash", "crash link", "bot crash", 
  "0x0", "0x1", "0x00000000", "xdxdxdxdxdxd", "null.null.null.null", "invisible_char_bug",

  // Compressed emoji spam
  "🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣", 
  "👿👿👿👿👿👿👿👿👿👿👿👿👿👿👿👿",

  // Invisible Characters
  "‎‎", "‎", "ㅤ", "⠀", "⁧⁧", "⁦⁦", "⁧", "⁦", "‎‏‎‏", "", "",

  // Custom lag/crash combos
  "🥵💀🔥🔥🔥🤬🤬🤬", "💣💣💣💣💣💣💣", "𓆩𓆪𓃰𓃱𓃲𓃳𓃴", "🔞🔞🔞🔞🔞", "🚨🚨🚨🚨🚨", "🪓🪓🪓🪓🪓"
];


// Load AntiBug config from file
function loadBugData() {
  try {
    const data = fs.readFileSync(bugFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

// Save updated config
function saveBugData(data) {
  fs.writeFileSync(bugFilePath, JSON.stringify(data, null, 2));
}

// Data cache
const antibugData = loadBugData();

// Enable AntiBug for a specific JID
async function enableAntiBug(jid) {
  antibugData[jid] = { active: true };
  saveBugData(antibugData);
}

// Disable AntiBug for a specific JID
async function disableAntiBug(jid) {
  delete antibugData[jid];
  saveBugData(antibugData);
}

// Check if AntiBug is enabled
function isAntiBugOn(jid) {
  return antibugData[jid]?.active === true;
}

// Check if text contains bug triggers
function containsBug(text) {
  if (!text || typeof text !== "string") return false;

  // Normalize and scan text
  const lower = text.toLowerCase();

  return (
    BUG_STRINGS.some((bug) => lower.includes(bug.toLowerCase())) ||
    text.length > 600
  );
}

// Optional: Reset all AntiBug data
function resetAntiBug() {
  saveBugData({});
}

module.exports = {
  enableAntiBug,
  disableAntiBug,
  isAntiBugOn,
  containsBug,
  resetAntiBug, // Optional export
};