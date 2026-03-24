const pool = require('../config/db');

const create = async ({ share_request_id, plant1_id, plant2_id, user1_id, user2_id }) => {
  const { rows } = await pool.query(
    'INSERT INTO share_history (share_request_id, plant1_id, plant2_id, user1_id, user2_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [share_request_id, plant1_id, plant2_id, user1_id, user2_id]
  );
  return rows[0];
};

const getByUserId = async (userId) => {
  const { rows } = await pool.query(
    `SELECT sh.*,
            p1.name AS plant1_name, p2.name AS plant2_name,
            u1.username AS user1_name, u2.username AS user2_name
     FROM share_history sh
     JOIN plants p1 ON p1.id = sh.plant1_id
     JOIN plants p2 ON p2.id = sh.plant2_id
     JOIN users u1 ON u1.id = sh.user1_id
     JOIN users u2 ON u2.id = sh.user2_id
     WHERE sh.user1_id = $1 OR sh.user2_id = $1
     ORDER BY sh.completed_at DESC`,
    [userId]
  );
  return rows;
};

module.exports = { create, getByUserId };
