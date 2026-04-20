const pool = require('../config/db')

async function getApproved(req, res) {
  try {
    const result = await pool.query(
      `SELECT r.*, u.name AS user_name
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.status = 'approved'
       ORDER BY r.created_at DESC`
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

async function getPending(req, res) {
  try {
    const result = await pool.query(
      `SELECT r.*, u.name AS user_name
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.status = 'pending'
       ORDER BY r.created_at ASC`
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

async function create(req, res) {
  try {
    const { product_name, text, rating } = req.body
    const userId = req.session.userId

    if (!product_name || !text || !rating) {
      return res.status(400).json({ error: 'Все поля обязательны' })
    }

    const result = await pool.query(
      `INSERT INTO reviews (user_id, product_name, text, rating, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING *`,
      [userId, product_name, text, rating]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

async function update(req, res) {
  try {
    const { id } = req.params
    const { text, rating } = req.body
    const userId = req.session.userId

    const review = await pool.query('SELECT * FROM reviews WHERE id = $1', [id])
    if (review.rows.length === 0) {
      return res.status(404).json({ error: 'Отзыв не найден' })
    }

    if (review.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Нет доступа' })
    }

    if (review.rows[0].status !== 'approved') {
      return res.status(400).json({ error: 'Можно редактировать только одобренные отзывы' })
    }

    const result = await pool.query(
      `UPDATE reviews SET text = $1, rating = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [text, rating, id]
    )

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

async function approve(req, res) {
  try {
    const { id } = req.params
    const result = await pool.query(
      `UPDATE reviews SET status = 'approved', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Отзыв не найден' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM reviews WHERE id = $1', [id])
    res.json({ message: 'Отзыв удалён' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

module.exports = { getApproved, getPending, create, update, approve, remove }
