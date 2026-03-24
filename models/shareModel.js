const pool = require('../config/db');

const getAllForUser = async (userId) => {
  const { rows } = await pool.query(
    `SELECT sr.* FROM share_requests sr
     LEFT JOIN plants p ON p.id = sr.wanted_plant_id
     WHERE sr.requester_id = $1 OR p.user_id = $1
     ORDER BY sr.created_at DESC`,
    [userId]
  );
  return rows;
};

const getById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM share_requests WHERE id = $1', [id]);
  return rows[0] || null;
};

const create = async ({ requester_id, offered_plant_id, wanted_plant_id, message }) => {
  const { rows } = await pool.query(
    'INSERT INTO share_requests (requester_id, offered_plant_id, wanted_plant_id, message) VALUES ($1, $2, $3, $4) RETURNING *',
    [requester_id, offered_plant_id, wanted_plant_id, message]
  );
  return rows[0];
};

const updateStatus = async (id, status) => {
  const { rows } = await pool.query(
    'UPDATE share_requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [status, id]
  );
  return rows[0] || null;
};

const remove = async (id) => {
  await pool.query('DELETE FROM share_requests WHERE id = $1', [id]);
};

module.exports = { getAllForUser, getById, create, updateStatus, delete: remove };
