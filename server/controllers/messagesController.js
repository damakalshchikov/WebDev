const pool = require('../config/db')

async function getMessages(req, res) {
  try {
    const userId = req.session.userId
    const role = req.session.role

    let result
    if (role === 'admin') {
      result = await pool.query(
        `SELECT m.*, u.name AS sender_name, u.email AS sender_email
         FROM messages m
         LEFT JOIN users u ON m.user_id = u.id
         ORDER BY m.created_at DESC`
      )
    } else {
      result = await pool.query(
        `SELECT m.* FROM messages m
         WHERE m.user_id = $1
         ORDER BY m.created_at DESC`,
        [userId]
      )
    }

    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

async function create(req, res) {
  try {
    const { subject, body } = req.body
    const userId = req.session.userId

    if (!body) {
      return res.status(400).json({ error: 'Текст сообщения обязателен' })
    }

    const result = await pool.query(
      `INSERT INTO messages (user_id, subject, body) VALUES ($1, $2, $3) RETURNING *`,
      [userId, subject || 'Без темы', body]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

async function reply(req, res) {
  try {
    const { id } = req.params
    const { reply_text } = req.body

    if (!reply_text) {
      return res.status(400).json({ error: 'Текст ответа обязателен' })
    }

    const result = await pool.query(
      `UPDATE messages SET reply = $1, replied_at = NOW() WHERE id = $2 RETURNING *`,
      [reply_text, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Сообщение не найдено' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

module.exports = { getMessages, create, reply }
