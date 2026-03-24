const pool = require('../config/db');

const getAll = async ({ type, region } = {}) => {
  let query = 'SELECT * FROM plants WHERE is_available = true';
  const params = [];
  if (type) {
    params.push(type);
    query += ` AND type = $${params.length}`;
  }
  if (region) {
    params.push(region);
    query += ` AND region = $${params.length}`;
  }
  query += ' ORDER BY created_at DESC';
  const { rows } = await pool.query(query, params);
  return rows;
};

const getById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM plants WHERE id = $1', [id]);
  return rows[0] || null;
};

const getByUserId = async (userId) => {
  const { rows } = await pool.query(
    'SELECT * FROM plants WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

const getCompatible = async (userId) => {
  const { rows } = await pool.query(
    'SELECT * FROM plants WHERE is_available = true AND user_id != $1 ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

const create = async ({ user_id, name, type, description, region }) => {
  const { rows } = await pool.query(
    'INSERT INTO plants (user_id, name, type, description, region) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [user_id, name, type, description, region]
  );
  return rows[0];
};

const update = async (id, fields) => {
  const allowed = ['name', 'type', 'description', 'region', 'is_available'];
  const keys = Object.keys(fields).filter((k) => allowed.includes(k));
  if (keys.length === 0) return null;
  const sets = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
  const values = keys.map((k) => fields[k]);
  values.push(id);
  const { rows } = await pool.query(
    `UPDATE plants SET ${sets} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return rows[0] || null;
};

const remove = async (id) => {
  await pool.query('DELETE FROM plants WHERE id = $1', [id]);
};

const setAvailability = async (id, isAvailable) => {
  const { rows } = await pool.query(
    'UPDATE plants SET is_available = $1 WHERE id = $2 RETURNING *',
    [isAvailable, id]
  );
  return rows[0] || null;
};

module.exports = { getAll, getById, getByUserId, getCompatible, create, update, delete: remove, setAvailability };
