-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица товаров
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    short_description TEXT,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    image VARCHAR(500),
    available BOOLEAN DEFAULT true,
    category VARCHAR(50),
    material TEXT,
    care TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица дополнительных свойств товаров
CREATE TABLE IF NOT EXISTS product_properties (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    key VARCHAR(100),
    value TEXT
);

-- Таблица дополнительных изображений товаров
CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0
);

-- Таблица отзывов
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_name VARCHAR(255),
    text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    status VARCHAR(10) DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица сообщений
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255) DEFAULT 'Без темы',
    body TEXT NOT NULL,
    reply TEXT,
    replied_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица подарочных карт
CREATE TABLE IF NOT EXISTS gift_cards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица резервирований подарочных карт
CREATE TABLE IF NOT EXISTS gift_card_reservations (
    id SERIAL PRIMARY KEY,
    gift_card_id INTEGER REFERENCES gift_cards(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(gift_card_id, user_id)
);

-- Таблица категорий
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO categories (id, title) VALUES
('gold', 'Золото'),
('silver', 'Серебро'),
('platinum', 'Платина')
ON CONFLICT DO NOTHING;

-- Наполнение товарами
INSERT INTO products (name, short_description, description, price, image, available, category, material, care) VALUES
('Кольцо «Ослепляющий взгляд»', 'Золотое кольцо 585 пробы с бриллиантом', 'Золотое кольцо 585 пробы с бриллиантом 0,15 карат', 12500.00, '/images/catalog/gold-ring.png', true, 'gold', 'Золото 585 пробы, бриллиант 0,15 карат (огранка «круг»)', 'Избегайте контакта с химическими веществами и парфюмом. Снимайте перед водными процедурами. Протирайте мягкой замшевой тканью. Храните в отдельном футляре'),
('Браслет «Золотая линия»', 'Изогнутый браслет из золота 585 пробы', 'Изогнутый браслет из золота 585 пробы', 15200.00, '/images/catalog/gold-bracelet.png', true, 'gold', 'Золото 585 пробы, с элегантными изгибами', 'Регулярно протирайте мягкой тканью без абразивов. Не носите во время занятий спортом. Раз в год рекомендуется профессиональная чистка в ювелирной мастерской'),
('Серьги «Алая тайна»', 'Серьги-пусеты из золота 585 пробы с рубинами', 'Серьги-пусеты из золота 585 пробы с рубинами', 8900.00, '/images/catalog/gold-earrings.png', true, 'gold', 'Золото 585 пробы, натуральные рубины 0,4 карат (2 шт.)', 'Храните завёрнутыми в мягкую ткань. Избегайте ударов — камни могут расколоться. Очищайте мягкой щёткой с тёплой водой без моющих средств'),
('Кольцо «Изумрудное изящество»', 'Тонкое кольцо из серебра 925 пробы с изумрудом', 'Тонкое кольцо из серебра 925 пробы с вставкой из изумруда', 3200.00, '/images/catalog/silver-ring.png', true, 'silver', 'Серебро 925 пробы, изумруд', 'Серебро темнеет при контакте с воздухом — храните в закрытой коробке. Полируйте специальной салфеткой для серебра. Не носите в бассейне'),
('Браслет «Тройная волна»', 'Браслет из серебра 925 пробы с фактурным плетением', 'Браслет из серебра 925 пробы с фактурным плетением', 4800.00, '/images/catalog/silver-bracelet.png', true, 'silver', 'Серебро 925 пробы с родиевым покрытием', 'Родиевое покрытие защищает от потемнения. Избегайте механических повреждений. Протирайте мягкой тканью. При сильном загрязнении — промойте тёплой водой с мылом и просушите'),
('Серьги «Серебряная снежинка»', 'Серьги-гвоздики из серебра 925 пробы с топазами', 'Серьги-гвоздики из серебра 925 пробы с топазами белого цвета', 2900.00, '/images/catalog/silver-earrings.png', true, 'silver', 'Серебро 925 пробы, белые топазы 0,3 карат (2 шт.)', 'Очищайте мягкой щёткой и тёплой водой. Не используйте ультразвуковую чистку. Храните отдельно, чтобы избежать царапин на камнях'),
('Кольцо «Вечная красота»', 'Кольцо из платины 950 пробы с бриллиантом', 'Кольцо из платины 950 пробы с бриллиантом 0.3 карат', 48000.00, '/images/catalog/platinum-ring.png', true, 'platinum', 'Платина 950 пробы, бриллиант 0,3 карат (огранка «принцесса»)', 'Платина практически не темнеет, но со временем приобретает патину. При желании отполируйте у ювелира. Регулярно проверяйте крепление камня. Храните в футляре'),
('Браслет «Платиновый блеск»', 'Браслет из платины 950 пробы с полированной отделкой', 'Браслет из платины 950 пробы с полированной отделкой', 62000.00, '/images/catalog/platinum-bracelet.png', true, 'platinum', 'Платина 950 пробы, замок-бокс с двойной безопасностью', 'Платина очень прочная — царапается меньше золота. Очищайте тёплой водой с мягким мылом и мягкой щёткой. Для восстановления блеска обратитесь к ювелиру раз в 2–3 года'),
('Серьги «Роскошная искра»', 'Серьги-капли из платины 950 пробы с бриллиантами', 'Серьги-капли из платины 950 пробы с бриллиантами', 54000.00, '/images/catalog/platinum-earrings.png', true, 'platinum', 'Платина 950 пробы, бриллианты весом 0,45 карат', 'Берегите от ударов, несмотря на прочность металла. Очищайте мягкой щёткой с тёплым мыльным раствором. Регулярно проверяйте надёжность застёжек')
ON CONFLICT DO NOTHING;

-- Наполнение подарочными картами
INSERT INTO gift_cards (name, description, price) VALUES
('Подарочная карта 5 000 ₽', 'Идеальный подарок для любого случая. Карта действует 12 месяцев.', 5000.00),
('Подарочная карта 10 000 ₽', 'Широкий выбор украшений для вашего близкого. Карта действует 12 месяцев.', 10000.00),
('Подарочная карта 20 000 ₽', 'Роскошный подарок из нашей премиум-коллекции. Карта действует 12 месяцев.', 20000.00)
ON CONFLICT DO NOTHING;
