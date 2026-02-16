"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "database.db");
const db = new sqlite3.Database(dbPath);

// Tengeneza table ya antibot kama haipo
db.run(`CREATE TABLE IF NOT EXISTS antibot (
    jid TEXT PRIMARY KEY,
    etat TEXT DEFAULT 'off'
)`);

// Kazi ya kuwasha au kuzima (on/off)
async function ajouterOuMettreAJourJid(jid, etat) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT OR REPLACE INTO antibot (jid, etat) VALUES (?, ?)`, [jid, etat], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

// Kazi ya kuangalia kama antibot imewashwa kwenye group husika
async function atbverifierEtatJid(jid) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT etat FROM antibot WHERE jid = ?`, [jid], (err, row) => {
            if (err) reject(err);
            else resolve(row ? row.etat : 'off');
        });
    });
}

// Kazi ya kufuta mipangilio ya group fulani
async function viderEtatJid(jid) {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM antibot WHERE jid = ?`, [jid], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

module.exports = {
    ajouterOuMettreAJourJid,
    atbverifierEtatJid,
    viderEtatJid
};
