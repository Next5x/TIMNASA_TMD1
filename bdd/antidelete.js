const { Pool } = require('pg');
const conf = require('../set');

const pool = new Pool({
  connectionString: conf.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Create table if it doesn't exist
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS antidelete (
      id SERIAL PRIMARY KEY,
      state TEXT DEFAULT 'off',
      destination TEXT DEFAULT 'dm'
    );`;
  await pool.query(query);
};

createTable();

async function getAntiDeleteSettings() {
  const res = await pool.query('SELECT * FROM antidelete LIMIT 1');
  if (res.rows.length === 0) {
    await pool.query('INSERT INTO antidelete (state, destination) VALUES ($1, $2)', ['off', 'dm']);
    return { state: 'off', destination: 'dm' };
  }
  return res.rows[0];
}

async function updateAntiDeleteState(state) {
  await pool.query('UPDATE antidelete SET state = $1', [state]);
}

async function updateAntiDeleteDest(dest) {
  await pool.query('UPDATE antidelete SET destination = $1', [dest]);
}

module.exports = { getAntiDeleteSettings, updateAntiDeleteState, updateAntiDeleteDest };
