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
