-- Создание таблицы залов
CREATE TABLE IF NOT EXISTS halls (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  courts_count INTEGER NOT NULL,
  price_per_hour INTEGER NOT NULL,
  description TEXT,
  detailed_description TEXT,
  features JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  videos JSONB DEFAULT '[]',
  specifications JSONB DEFAULT '{}',
  amenities JSONB DEFAULT '[]',
  working_hours JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы бронирований
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  hall_id INTEGER NOT NULL REFERENCES halls(id),
  court INTEGER NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_hall_id ON bookings(hall_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date_hall_court ON bookings(date, hall_id, court);

-- Создание уникального ограничения для предотвращения двойного бронирования
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_booking 
ON bookings(hall_id, court, date, time) 
WHERE status != 'cancelled';

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_halls_updated_at
    BEFORE UPDATE ON halls
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Вставка данных о залах
INSERT INTO halls (name, courts_count, price_per_hour, description, detailed_description, features, specifications, amenities, working_hours) VALUES
('Зал 1', 3, 150,
 'Уютный зал с профессиональными кортами для игры в бадминтон',
 'Зал 1 - это идеальное место для начинающих игроков и любителей бадминтона. Компактный и уютный зал оборудован тремя профессиональными кортами с качественным покрытием. Отличное освещение и система кондиционирования обеспечивают комфортные условия для игры в любое время года.',
 '["Профессиональное покрытие", "Отличное освещение", "Кондиционирование воздуха", "Раздевалки с душем"]',
 '{"area": "300 м²", "height": "9 м", "flooring": "Профессиональное покрытие Yonex", "lighting": "LED освещение 1000 лк", "ventilation": "Принудительная вентиляция"}',
 '["Раздевалки", "Душевые", "Парковка", "Wi-Fi", "Кафе"]',
 '{"weekdays": "06:00 - 23:00", "weekends": "08:00 - 22:00"}'
),
('Зал 2', 7, 180,
 'Большой зал с семью кортами для турниров и тренировок',
 'Зал 2 - наш самый большой зал, предназначенный для проведения турниров и серьезных тренировок. Семь профессиональных кортов с трибунами для зрителей. Современная звуковая система и профессиональная разметка делают этот зал идеальным для соревнований любого уровня.',
 '["Турнирные корты", "Трибуны для зрителей", "Профессиональная разметка", "Система вентиляции", "Звуковая система"]',
 '{"area": "700 м²", "height": "12 м", "flooring": "Турнирное покрытие BWF", "lighting": "Профессиональное освещение 1500 лк", "ventilation": "Климат-контроль"}',
 '["VIP раздевалки", "Душевые", "Трибуны", "Звуковая система", "Парковка", "Wi-Fi", "Ресторан"]',
 '{"weekdays": "06:00 - 23:00", "weekends": "08:00 - 22:00"}'
),
('Зал 3', 7, 200,
 'Современный зал с новейшим оборудованием',
 'Зал 3 - наш новейший зал с самым современным оборудованием и технологиями. Семь кортов с инновационным покрытием и LED освещением последнего поколения. Умный климат-контроль и премиум удобства создают непревзойденный комфорт для игры.',
 '["Новейшее покрытие", "LED освещение", "Климат-контроль", "VIP раздевалки", "Зона отдыха"]',
 '{"area": "700 м²", "height": "12 м", "flooring": "Инновационное покрытие Victor", "lighting": "LED система 1800 лк", "ventilation": "Умный климат-контроль"}',
 '["VIP раздевалки", "Премиум душевые", "Зона отдыха", "Массажные кресла", "Парковка", "Wi-Fi", "Лаундж"]',
 '{"weekdays": "06:00 - 23:00", "weekends": "08:00 - 22:00"}'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  courts_count = EXCLUDED.courts_count,
  price_per_hour = EXCLUDED.price_per_hour,
  description = EXCLUDED.description,
  detailed_description = EXCLUDED.detailed_description,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  amenities = EXCLUDED.amenities,
  working_hours = EXCLUDED.working_hours;

-- Настройка Row Level Security (RLS)
ALTER TABLE halls ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Политики для публичного чтения залов
CREATE POLICY "Halls are viewable by everyone" ON halls
    FOR SELECT USING (true);

-- Политики для редактирования залов (временно разрешаем всем для демо)
CREATE POLICY "Anyone can update halls" ON halls
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can insert halls" ON halls
    FOR INSERT WITH CHECK (true);

-- Политики для бронирований
CREATE POLICY "Bookings are viewable by everyone" ON bookings
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert bookings" ON bookings
    FOR INSERT WITH CHECK (true);

-- Для админ-панели (требует аутентификации)
-- CREATE POLICY "Only authenticated users can update bookings" ON bookings
--     FOR UPDATE USING (auth.role() = 'authenticated');

-- CREATE POLICY "Only authenticated users can delete bookings" ON bookings
--     FOR DELETE USING (auth.role() = 'authenticated');

-- Временно разрешаем всем обновлять и удалять (для демо)
CREATE POLICY "Anyone can update bookings" ON bookings
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete bookings" ON bookings
    FOR DELETE USING (true);

-- Создание bucket для изображений залов
INSERT INTO storage.buckets (id, name, public) VALUES ('hall-images', 'hall-images', true);

-- Политики для storage bucket
CREATE POLICY "Anyone can view hall images" ON storage.objects
    FOR SELECT USING (bucket_id = 'hall-images');

CREATE POLICY "Anyone can upload hall images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'hall-images');

CREATE POLICY "Anyone can update hall images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'hall-images');

CREATE POLICY "Anyone can delete hall images" ON storage.objects
    FOR DELETE USING (bucket_id = 'hall-images');

-- ========================================
-- BLOG POSTS AND EVENTS SCHEMA
-- ========================================

-- Create posts table for blog and events
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('post', 'event')),
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  author_name VARCHAR(100) DEFAULT 'Altius Admin',
  tags TEXT[],
  event_date TIMESTAMP WITH TIME ZONE, -- Только для событий
  event_location VARCHAR(255), -- Только для событий
  meta_description TEXT,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_posts_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_posts_updated_at_column();

-- Insert sample blog posts and events
INSERT INTO posts (title, slug, excerpt, content, category, featured_image, tags, event_date, event_location) VALUES
('Добро пожаловать в клуб Altius!', 'welcome-to-altius', 'Мы рады приветствовать вас в нашем современном бадминтонном клубе в Кишиневе.',
'<h2>Добро пожаловать в Altius!</h2><p>Наш клуб предлагает лучшие условия для игры в бадминтон в Кишиневе. Современные залы, профессиональное оборудование и дружелюбная атмосфера ждут вас!</p><p>Мы предлагаем:</p><ul><li>3 современных зала с профессиональным покрытием</li><li>Аренда ракеток и воланов</li><li>Тренировки для всех уровней</li><li>Турниры и соревнования</li></ul>',
'post', '/api/placeholder/800/600?text=Добро+пожаловать+в+Altius', ARRAY['новости', 'клуб'], NULL, NULL),

('Открытие нового зала №3', 'new-hall-opening', 'Мы с гордостью объявляем об открытии нашего третьего зала с самым современным оборудованием!',
'<h2>Новый зал уже открыт!</h2><p>Зал №3 оснащен:</p><ul><li>Инновационным LED освещением</li><li>Системой климат-контроля</li><li>VIP раздевалками</li><li>Зоной отдыха</li></ul><p>Приходите опробовать новые возможности!</p>',
'post', '/api/placeholder/800/600?text=Новый+зал+3', ARRAY['новости', 'залы'], NULL, NULL),

('Турнир "Кубок Altius 2024"', 'altius-cup-2024', 'Приглашаем всех любителей бадминтона принять участие в нашем ежегодном турнире!',
'<h2>Кубок Altius 2024</h2><p>Ежегодный турнир нашего клуба пройдет в феврале 2024 года. Регистрация уже открыта!</p><h3>Категории:</h3><ul><li>Мужчины (одиночный разряд)</li><li>Женщины (одиночный разряд)</li><li>Смешанные пары</li><li>Юниоры до 18 лет</li></ul><p>Призовой фонд: 10,000 лей</p><p>Для регистрации обращайтесь к администратору.</p>',
'event', '/api/placeholder/800/600?text=Турнир+Кубок+Altius', ARRAY['турнир', 'соревнования'], '2024-02-15 10:00:00+02', 'Зал №2, Altius'),

('Мастер-класс от чемпиона', 'master-class-champion', 'Специальный мастер-класс от чемпиона Молдовы по бадминтону!',
'<h2>Мастер-класс от профессионала</h2><p>Не упустите уникальную возможность поучиться у лучших! Чемпион Молдовы проведет мастер-класс для игроков всех уровней.</p><h3>Программа:</h3><ul><li>Техника подачи</li><li>Тактика игры</li><li>Физическая подготовка</li><li>Ответы на вопросы</li></ul><p>Количество мест ограничено!</p>',
'event', '/api/placeholder/800/600?text=Мастер+класс', ARRAY['обучение', 'мастер-класс'], '2024-01-20 14:00:00+02', 'Зал №1, Altius'),

('Новогодний турнир для детей', 'new-year-kids-tournament', 'Праздничный турнир для юных спортсменов с призами и подарками!',
'<h2>Новогодний праздник для детей</h2><p>Приглашаем детей от 8 до 16 лет на праздничный турнир! Веселые игры, соревнования и подарки от Деда Мороза!</p><h3>Возрастные группы:</h3><ul><li>8-10 лет</li><li>11-13 лет</li><li>14-16 лет</li></ul><p>Каждый участник получит подарок!</p>',
'event', '/api/placeholder/800/600?text=Детский+турнир', ARRAY['дети', 'турнир', 'новый год'], '2024-01-05 11:00:00+02', 'Все залы, Altius')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  featured_image = EXCLUDED.featured_image,
  tags = EXCLUDED.tags,
  event_date = EXCLUDED.event_date,
  event_location = EXCLUDED.event_location;

-- Enable Row Level Security for posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies for posts (public read access for published posts)
CREATE POLICY "Anyone can view published posts" ON posts
    FOR SELECT USING (status = 'published');

-- Временно разрешаем всем создавать и редактировать посты (для демо)
CREATE POLICY "Anyone can insert posts" ON posts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update posts" ON posts
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete posts" ON posts
    FOR DELETE USING (true);

-- Create storage bucket for post images
INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for post images storage bucket
CREATE POLICY "Anyone can view post images" ON storage.objects
    FOR SELECT USING (bucket_id = 'post-images');

CREATE POLICY "Anyone can upload post images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'post-images');

CREATE POLICY "Anyone can update post images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'post-images');

CREATE POLICY "Anyone can delete post images" ON storage.objects
    FOR DELETE USING (bucket_id = 'post-images');
