-- Создание таблицы залов
CREATE TABLE IF NOT EXISTS halls (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  courts_count INTEGER NOT NULL,
  price_per_hour INTEGER NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Вставка данных о залах
INSERT INTO halls (name, courts_count, price_per_hour, description, features) VALUES
('Зал 1', 3, 150, 'Уютный зал с профессиональными кортами для игры в бадминтон', 
 '["Профессиональное покрытие", "Отличное освещение", "Кондиционирование воздуха", "Раздевалки с душем"]'),
('Зал 2', 7, 180, 'Большой зал с семью кортами для турниров и тренировок', 
 '["Турнирные корты", "Трибуны для зрителей", "Профессиональная разметка", "Система вентиляции", "Звуковая система"]'),
('Зал 3', 7, 200, 'Современный зал с новейшим оборудованием', 
 '["Новейшее покрытие", "LED освещение", "Климат-контроль", "VIP раздевалки", "Зона отдыха"]')
ON CONFLICT DO NOTHING;

-- Настройка Row Level Security (RLS)
ALTER TABLE halls ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Политики для публичного чтения залов
CREATE POLICY "Halls are viewable by everyone" ON halls
    FOR SELECT USING (true);

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
