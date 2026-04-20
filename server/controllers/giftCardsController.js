const pool = require('../config/db')

async function getAll(req, res) {
  try {
    const result = await pool.query('SELECT * FROM gift_cards ORDER BY created_at ASC')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

async function create(req, res) {
  try {
    const { name, description, price, image } = req.body

    if (!name || !price) {
      return res.status(400).json({ error: 'Название и цена обязательны' })
    }

    const result = await pool.query(
      `INSERT INTO gift_cards (name, description, price, image) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description || null, price, image || null]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM gift_cards WHERE id = $1', [id])
    res.json({ message: 'Карта удалена' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

async function reserve(req, res) {
  try {
    const { id } = req.params
    const userId = req.session.userId

    const existing = await pool.query(
      'SELECT id FROM gift_card_reservations WHERE gift_card_id = $1 AND user_id = $2',
      [id, userId]
    )

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Карта уже зарезервирована вами' })
    }

    const result = await pool.query(
      `INSERT INTO gift_card_reservations (gift_card_id, user_id) VALUES ($1, $2) RETURNING *`,
      [id, userId]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

async function getUserReservations(req, res) {
  try {
    const userId = req.session.userId

    const result = await pool.query(
      `SELECT gc.*, gcr.created_at AS reserved_at
       FROM gift_card_reservations gcr
       JOIN gift_cards gc ON gcr.gift_card_id = gc.id
       WHERE gcr.user_id = $1
       ORDER BY gcr.created_at DESC`,
      [userId]
    )

    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

async function getAllReservations(req, res) {
  try {
    const result = await pool.query(
      `SELECT gcr.id, gcr.status, gc.name AS card_name, gc.price, u.name AS user_name, u.email AS user_email, gcr.created_at AS reserved_at
       FROM gift_card_reservations gcr
       JOIN gift_cards gc ON gcr.gift_card_id = gc.id
       JOIN users u ON gcr.user_id = u.id
       ORDER BY gcr.created_at DESC`
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

async function updateReservationStatus(req, res) {
  try {
    const { id } = req.params
    const { status } = req.body
    if (!['confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Недопустимый статус' })
    }
    const result = await pool.query(
      'UPDATE gift_card_reservations SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Резервация не найдена' })
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

module.exports = { getAll, create, remove, reserve, getUserReservations, getAllReservations, updateReservationStatus }
