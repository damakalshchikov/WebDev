const pool = require('../config/db')

async function getAll(req, res) {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY created_at ASC, id ASC')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

async function create(req, res) {
  try {
    const { id, title } = req.body

    if (!id || !title) {
      return res.status(400).json({ error: 'ID и название категории обязательны' })
    }

    const existing = await pool.query('SELECT id FROM categories WHERE id = $1', [id])
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Категория с таким ID уже существует' })
    }

    const result = await pool.query(
      'INSERT INTO categories (id, title) VALUES ($1, $2) RETURNING *',
      [id, title]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

module.exports = { getAll, create }
