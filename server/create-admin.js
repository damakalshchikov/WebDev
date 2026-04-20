/**
 * Скрипт создания аккаунта администратора.
 * Запуск: node create-admin.js
 * Логин: admin@diamand.com / Пароль: admin123
 */
const pool = require('./config/db')
const bcrypt = require('bcrypt')

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@diamand.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const name = 'Администратор'
  const phone = '+70000000000'

  const hash = await bcrypt.hash(password, 10)

  await pool.query(
    `INSERT INTO users (name, phone, email, password_hash, role)
     VALUES ($1, $2, $3, $4, 'admin')
     ON CONFLICT (email) DO UPDATE SET password_hash = $4, role = 'admin'`,
    [name, phone, email, hash]
  )

  console.log(`Администратор создан: email=${email}, password=${password}`)
  process.exit(0)
}

createAdmin().catch(err => {
  console.error('Ошибка:', err)
  process.exit(1)
})
