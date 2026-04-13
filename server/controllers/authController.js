const pool = require('../config/db')
const bcrypt = require('bcrypt')

async function register(req, res) {
  try {
    const { name, phone, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Имя, email и пароль обязательны' })
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email уже зарегистрирован' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const result = await pool.query(
      'INSERT INTO users (name, phone, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role',
      [name, phone || null, email, passwordHash, 'user']
    )

    const user = result.rows[0]
    req.session.userId = user.id
    req.session.role = user.role

    res.status(201).json({ user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' })
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный email или пароль' })
    }

    const user = result.rows[0]
    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) {
      return res.status(401).json({ error: 'Неверный email или пароль' })
    }

    req.session.userId = user.id
    req.session.role = user.role

    res.json({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

async function logout(req, res) {
  req.session.destroy()
  res.json({ message: 'Выход выполнен' })
}

async function me(req, res) {
  if (!req.session.userId) {
    return res.json({ user: null })
  }

  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, role FROM users WHERE id = $1',
      [req.session.userId]
    )

    if (result.rows.length === 0) {
      req.session.destroy()
      return res.json({ user: null })
    }

    res.json({ user: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

module.exports = { register, login, logout, me }
