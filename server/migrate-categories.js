/**
 * Миграция: добавляет таблицу categories в существующую БД.
 * Запуск: node migrate-categories.js  (из папки server/)
 */
const pool = require('./config/db')

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await pool.query(`
    INSERT INTO categories (id, title) VALUES
      ('gold',     'Золото'),
      ('silver',   'Серебро'),
      ('platinum', 'Платина')
    ON CONFLICT DO NOTHING
  `)

  console.log('Миграция выполнена: таблица categories создана, базовые категории добавлены.')
  process.exit(0)
}

migrate().catch(err => {
  console.error('Ошибка миграции:', err)
  process.exit(1)
})
