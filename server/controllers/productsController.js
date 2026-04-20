const pool = require('../config/db')

async function getAll(req, res) {
  try {
    const { search, category } = req.query
    let query = `
      SELECT p.*,
        COALESCE(
          array_agg(pi.image_url ORDER BY pi.sort_order) FILTER (WHERE pi.image_url IS NOT NULL),
          '{}'
        ) AS images
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p.id
      WHERE p.available = true`
    const params = []

    if (category) {
      params.push(category)
      query += ` AND p.category = $${params.length}`
    }

    if (search) {
      params.push(`%${search}%`)
      const idx = params.length
      query += ` AND (p.name ILIKE $${idx} OR p.short_description ILIKE $${idx} OR p.description ILIKE $${idx})`
    }

    query += ' GROUP BY p.id ORDER BY p.created_at ASC, p.id ASC'

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

async function getOne(req, res) {
  try {
    const { id } = req.params
    const result = await pool.query(
      `SELECT p.*,
        COALESCE(
          array_agg(pi.image_url ORDER BY pi.sort_order) FILTER (WHERE pi.image_url IS NOT NULL),
          '{}'
        ) AS images
       FROM products p
       LEFT JOIN product_images pi ON pi.product_id = p.id
       WHERE p.id = $1
       GROUP BY p.id`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

async function create(req, res) {
  try {
    const { name, short_description, description, price, image, category, material, care } = req.body

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Название, цена и категория обязательны' })
    }

    const result = await pool.query(
      `INSERT INTO products (name, short_description, description, price, image, category, material, care, available)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
       RETURNING *`,
      [name, short_description || null, description || null, price, image || null, category, material || null, care || null]
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
    const { name, short_description, description, price, image, category, material, care, available } = req.body

    const result = await pool.query(
      `UPDATE products SET
        name = COALESCE($1, name),
        short_description = COALESCE($2, short_description),
        description = COALESCE($3, description),
        price = COALESCE($4, price),
        image = COALESCE($5, image),
        category = COALESCE($6, category),
        material = COALESCE($7, material),
        care = COALESCE($8, care),
        available = COALESCE($9, available)
       WHERE id = $10
       RETURNING *`,
      [name, short_description, description, price, image, category, material, care, available, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' })
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
    await pool.query('DELETE FROM products WHERE id = $1', [id])
    res.json({ message: 'Товар удалён' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

module.exports = { getAll, getOne, create, update, remove }
