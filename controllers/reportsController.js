const pool = require('../config/db');

const summary = async (req, res, next) => {
  try {
    const [users, plants, exchanges] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM plants'),
      pool.query("SELECT COUNT(*) FROM share_requests WHERE status = 'accepted'"),
    ]);
    res.json({
      total_users: parseInt(users.rows[0].count),
      total_plants: parseInt(plants.rows[0].count),
      total_exchanges: parseInt(exchanges.rows[0].count),
    });
  } catch (err) {
    next(err);
  }
};

const activeUsers = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.username, u.region, COUNT(sh.id) AS exchanges
       FROM users u
       LEFT JOIN share_history sh ON sh.user1_id = u.id OR sh.user2_id = u.id
       GROUP BY u.id, u.username, u.region
       ORDER BY exchanges DESC
       LIMIT 10`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

const popularPlants = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.id, p.name, p.type, p.region, COUNT(sr.id) AS request_count
       FROM plants p
       LEFT JOIN share_requests sr ON sr.wanted_plant_id = p.id
       GROUP BY p.id, p.name, p.type, p.region
       ORDER BY request_count DESC
       LIMIT 10`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { summary, activeUsers, popularPlants };
