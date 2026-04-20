/**
 * Скрипт инициализации базы данных.
 * Запуск: node schema.js
 */
const fs = require('fs')
const path = require('path')
const pool = require('./config/db')

async function init() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
  await pool.query(sql)
  console.log('База данных инициализирована')
  process.exit(0)
}

init().catch(err => {
  console.error('Ошибка инициализации:', err)
  process.exit(1)
})
