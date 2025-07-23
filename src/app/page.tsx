'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HallCard from '@/components/HallCard';
import BookingCalendar from '@/components/BookingCalendar';
import BookingForm from '@/components/BookingForm';
import { Star, Users, Clock, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface BookingData {
  name: string;
  phone: string;
  email?: string;
  hallId: number;
  date: Date;
  time: string;
  court: number;
}

interface Hall {
  id: number;
  name: string;
  courts_count: number;
  price_per_hour: number;
  description: string;
  features: string[];
  images?: string[];
}

export default function Home() {
  const [selectedHall, setSelectedHall] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    time: string;
    court: number;
  } | null>(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const { data, error } = await supabase
        .from('halls')
        .select('*')
        .eq('is_active', true)
        .order('id');

      if (error) throw error;
      setHalls(data || []);
    } catch (error) {
      console.error('Error fetching halls:', error);
      // Fallback data if database is not available
      setHalls([
        {
          id: 1,
          name: 'Зал 1',
          courts_count: 3,
          price_per_hour: 150,
          description: 'Уютный зал с профессиональными кортами для игры в бадминтон',
          features: ['Профессиональное покрытие', 'Отличное освещение', 'Кондиционирование воздуха', 'Раздевалки с душем']
        },
        {
          id: 2,
          name: 'Зал 2',
          courts_count: 7,
          price_per_hour: 180,
          description: 'Большой зал с семью кортами для турниров и тренировок',
          features: ['Турнирные корты', 'Трибуны для зрителей', 'Профессиональная разметка', 'Система вентиляции', 'Звуковая система']
        },
        {
          id: 3,
          name: 'Зал 3',
          courts_count: 7,
          price_per_hour: 200,
          description: 'Современный зал с новейшим оборудованием',
          features: ['Новейшее покрытие', 'LED освещение', 'Климат-контроль', 'VIP раздевалки', 'Зона отдыха']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleHallSelect = (hallId: number) => {
    setSelectedHall(hallId);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (date: Date, time: string, court: number) => {
    setSelectedSlot({ date, time, court });
  };

  const handleBookingSubmit = (data: BookingData) => {
    console.log('Booking submitted:', data);
    setBookingComplete(true);
    // Здесь будет отправка данных на сервер
  };

  const handleBookingCancel = () => {
    setSelectedSlot(null);
    setSelectedHall(null);
  };

  const resetBooking = () => {
    setBookingComplete(false);
    setSelectedSlot(null);
    setSelectedHall(null);
  };

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Бронирование успешно!
            </h2>
            <p className="text-gray-600 mb-6">
              Ваша заявка принята. Мы свяжемся с вами в ближайшее время для подтверждения.
            </p>
            <button
              onClick={resetBooking}
              className="bg-altius-blue hover:bg-altius-blue-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Сделать новое бронирование
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Booking flow
  if (selectedSlot && selectedHall) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <BookingForm
            hallId={selectedHall}
            date={selectedSlot.date}
            time={selectedSlot.time}
            court={selectedSlot.court}
            onSubmit={handleBookingSubmit}
            onCancel={handleBookingCancel}
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (selectedHall) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <button
              onClick={() => setSelectedHall(null)}
              className="text-altius-blue hover:text-altius-blue-dark font-medium"
            >
              ← Назад к выбору зала
            </button>
          </div>
          <BookingCalendar
            hallId={selectedHall}
            onSlotSelect={handleSlotSelect}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-altius-blue via-altius-lime to-altius-orange text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Бадминтонный клуб
              <span className="block text-altius-lime-light">Altius</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Современные залы с профессиональными кортами.
              Удобная система онлайн бронирования. 17 кортов в 3 залах.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#halls"
                className="bg-white text-altius-blue font-semibold py-3 px-8 rounded-lg hover:bg-altius-lime hover:text-white transition-colors"
              >
                Посмотреть залы
              </a>
              <a
                href="#booking"
                className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-altius-orange transition-colors"
              >
                Забронировать
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Почему выбирают нас
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Мы предлагаем лучшие условия для игры в бадминтон в Кишиневе
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-altius-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-altius-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">17 кортов</h3>
              <p className="text-gray-600">
                3 современных зала с профессиональными кортами для игры и тренировок
              </p>
            </div>

            <div className="text-center">
              <div className="bg-altius-lime/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-altius-lime" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Удобное время</h3>
              <p className="text-gray-600">
                Работаем с 6:00 до 23:00 в будни и с 8:00 до 22:00 в выходные
              </p>
            </div>

            <div className="text-center">
              <div className="bg-altius-orange/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-altius-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Высокое качество</h3>
              <p className="text-gray-600">
                Профессиональное покрытие, отличное освещение и климат-контроль
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Halls Section */}
      <section id="halls" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Наши залы
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Выберите подходящий зал для вашей игры
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-altius-blue mx-auto"></div>
              <p className="mt-4 text-gray-600">Загрузка залов...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {halls.map((hall) => (
                <HallCard
                  key={hall.id}
                  id={hall.id}
                  name={hall.name}
                  courts={hall.courts_count}
                  image=""
                  description={hall.description}
                  features={hall.features}
                  pricePerHour={hall.price_per_hour}
                  onBookClick={handleHallSelect}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Контакты
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Свяжитесь с нами для получения дополнительной информации
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Как нас найти</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-altius-blue mt-1 mr-3" />
                  <div>
                    <div className="font-medium">Адрес</div>
                    <div className="text-gray-600">ул. Примерная, 123, Кишинев, Молдова</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-altius-lime mt-1 mr-3" />
                  <div>
                    <div className="font-medium">Телефон</div>
                    <div className="text-gray-600">+373 XX XXX XXX</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-altius-orange mt-1 mr-3" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-gray-600">info@altius.md</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-altius-blue mt-1 mr-3" />
                  <div>
                    <div className="font-medium">Режим работы</div>
                    <div className="text-gray-600">
                      <div>Пн-Пт: 06:00 - 23:00</div>
                      <div>Сб-Вс: 08:00 - 22:00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Расположение</h3>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <div>Карта будет здесь</div>
                  <div className="text-sm">Кишинев, Молдова</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
