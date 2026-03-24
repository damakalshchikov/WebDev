-- Plant Share Database Schema

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  region VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS plants (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(100),
  description TEXT,
  region VARCHAR(100),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS share_requests (
  id SERIAL PRIMARY KEY,
  requester_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  offered_plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  wanted_plant_id INTEGER NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS share_history (
  id SERIAL PRIMARY KEY,
  share_request_id INTEGER NOT NULL REFERENCES share_requests(id) ON DELETE CASCADE,
  plant1_id INTEGER NOT NULL,
  plant2_id INTEGER NOT NULL,
  user1_id INTEGER NOT NULL,
  user2_id INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Тестовые данные

INSERT INTO users (username, email, password_hash, region) VALUES
  ('алиса', 'alisa@example.com', '$2b$10$examplehash1111111111111111111111111111111', 'Москва'),
  ('борис', 'boris@example.com', '$2b$10$examplehash2222222222222222222222222222222', 'Санкт-Петербург'),
  ('карина', 'karina@example.com', '$2b$10$examplehash3333333333333333333333333333333', 'Казань');

INSERT INTO plants (user_id, name, type, description, region, is_available) VALUES
  (1, 'Монстера деликатесная', 'тропическое', 'Крупнолистное тропическое растение', 'Москва', true),
  (1, 'Потос золотистый', 'лиана', 'Неприхотливая ампельная лиана', 'Москва', true),
  (1, 'Спатифиллум', 'цветущее', 'Белоцветущее растение, переносит полутень', 'Москва', true),
  (2, 'Опунция', 'кактус', 'Кактус-опунция с плоскими члениками', 'Санкт-Петербург', true),
  (2, 'Сансевиерия', 'суккулент', 'Выносливый суккулент, очищает воздух', 'Санкт-Петербург', true),
  (2, 'Алоэ вера', 'суккулент', 'Лекарственный суккулент', 'Санкт-Петербург', true),
  (2, 'Фикус Бенджамина', 'дерево', 'Декоративное комнатное деревце', 'Санкт-Петербург', true),
  (3, 'Лаванда', 'трава', 'Ароматное травянистое растение', 'Казань', true),
  (3, 'Базилик', 'трава', 'Пряная трава, легко выращивается', 'Казань', true),
  (3, 'Роза миниатюрная', 'цветущее', 'Небольшая декоративная роза', 'Казань', true),
  (3, 'Хлорофитум', 'ампельное', 'Неприхотливое ампельное растение', 'Казань', true);

INSERT INTO share_requests (requester_id, offered_plant_id, wanted_plant_id, status, message) VALUES
  (1, 1, 4, 'pending', 'Хотела бы обменять мою монстеру на вашу опунцию!'),
  (1, 2, 8, 'accepted', 'Потос на лаванду — отличный вариант'),
  (2, 5, 3, 'pending', 'Сансевиерия на спатифиллум?'),
  (3, 9, 6, 'rejected', 'Предлагаю базилик в обмен на алоэ'),
  (2, 7, 10, 'pending', 'Фикус на вашу миниатюрную розу');

INSERT INTO share_history (share_request_id, plant1_id, plant2_id, user1_id, user2_id) VALUES
  (2, 2, 8, 1, 3),
  (4, 9, 6, 3, 2);
