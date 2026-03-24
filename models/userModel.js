const pool = require('../config/db');

const findByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, username, email, region, created_at FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
};

const create = async ({ username, email, password_hash, region }) => {
  const { rows } = await pool.query(
    'INSERT INTO users (username, email, password_hash, region) VALUES ($1, $2, $3, $4) RETURNING id, username, email, region, created_at',
    [username, email, password_hash, region]
  );
  return rows[0];
};

module.exports = { findByEmail, findById, create };
