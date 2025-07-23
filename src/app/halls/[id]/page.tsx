'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingCalendar from '@/components/BookingCalendar';
import BookingForm from '@/components/BookingForm';
import MediaGallery from '@/components/MediaGallery';
import {
  ArrowLeft,
  Users,
  MapPin,
  Clock,
  Star,
  Calendar
} from 'lucide-react';

interface HallData {
  id: number;
  name: string;
  courts_count: number;
  description: string;
  detailed_description: string;
  features: string[];
  price_per_hour: number;
  images: string[];
  videos: string[];
  specifications: Record<string, string>;
  amenities: string[];
  working_hours: Record<string, string>;
  is_active: boolean;
}

const hallsData: Record<number, HallData> = {
  1: {
    id: 1,
    name: 'Зал 1',
    courts_count: 3,
    description: 'Уютный зал с профессиональными кортами для игры в бадминтон',
    detailed_description: 'Зал 1 - это идеальное место для начинающих игроков и любителей бадминтона. Компактный и уютный зал оборудован тремя профессиональными кортами с качественным покрытием. Отличное освещение и система кондиционирования обеспечивают комфортные условия для игры в любое время года.',
    features: [
      'Профессиональное покрытие',
      'Отличное освещение',
      'Кондиционирование воздуха',
      'Раздевалки с душем'
    ],
    price_per_hour: 150,
    images: [
      '/api/placeholder/800/600?text=Зал+1+Общий+вид',
      '/api/placeholder/800/600?text=Зал+1+Корт+1',
      '/api/placeholder/800/600?text=Зал+1+Корт+2',
      '/api/placeholder/800/600?text=Зал+1+Раздевалка',
      '/api/placeholder/800/600?text=Зал+1+Освещение'
    ],
    videos: [
      '/api/placeholder/video?text=Обзор+Зала+1',
      '/api/placeholder/video?text=Игра+в+Зале+1'
    ],
    specifications: {
      area: '400 м²',
      height: '9 м',
      flooring: 'Профессиональное покрытие Taraflex',
      lighting: 'LED освещение 1000 лк',
      ventilation: 'Принудительная вентиляция'
    },
    amenities: [
      'Раздевалки с индивидуальными шкафчиками',
      'Душевые кабины',
      'Зона отдыха',
      'Питьевые фонтанчики',
      'Wi-Fi',
      'Парковка'
    ],
    working_hours: {
      weekdays: '06:00 - 23:00',
      weekends: '08:00 - 22:00'
    },
    is_active: true
  },
  2: {
    id: 2,
    name: 'Зал 2',
    courts_count: 7,
    description: 'Большой зал с семью кортами для турниров и тренировок',
    detailed_description: 'Зал 2 - наш главный турнирный зал, оборудованный семью профессиональными кортами. Здесь проводятся официальные соревнования и тренировки спортсменов высокого уровня. Зал оснащен трибунами для зрителей и современной звуковой системой.',
    features: [
      'Турнирные корты',
      'Трибуны для зрителей',
      'Профессиональная разметка',
      'Система вентиляции',
      'Звуковая система'
    ],
    price_per_hour: 180,
    images: [
      '/api/placeholder/800/600?text=Зал+2+Турнирный+вид',
      '/api/placeholder/800/600?text=Зал+2+Трибуны',
      '/api/placeholder/800/600?text=Зал+2+Корты',
      '/api/placeholder/800/600?text=Зал+2+Звуковая+система',
      '/api/placeholder/800/600?text=Зал+2+Освещение'
    ],
    videos: [
      '/api/placeholder/video?text=Турнир+в+Зале+2',
      '/api/placeholder/video?text=Тренировка+в+Зале+2'
    ],
    specifications: {
      area: '1200 м²',
      height: '12 м',
      flooring: 'Турнирное покрытие BWF стандарт',
      lighting: 'Профессиональное LED 1500 лк',
      ventilation: 'Климат-контроль с рекуперацией'
    },
    amenities: [
      'VIP раздевалки',
      'Душевые с подогревом пола',
      'Зона для разминки',
      'Кафе',
      'Трибуны на 200 мест',
      'Профессиональная звуковая система',
      'Табло',
      'Wi-Fi',
      'Охраняемая парковка'
    ],
    working_hours: {
      weekdays: '06:00 - 23:00',
      weekends: '08:00 - 22:00'
    },
    is_active: true
  },
  3: {
    id: 3,
    name: 'Зал 3',
    courts_count: 7,
    description: 'Современный зал с новейшим оборудованием',
    detailed_description: 'Зал 3 - самый современный зал клуба с новейшими технологиями. Семь кортов оборудованы инновационным LED освещением и системой климат-контроля. VIP раздевалки и зона отдыха создают атмосферу премиум-класса.',
    features: [
      'Новейшее покрытие',
      'LED освещение',
      'Климат-контроль',
      'VIP раздевалки',
      'Зона отдыха'
    ],
    price_per_hour: 200,
    images: [
      '/api/placeholder/800/600?text=Зал+3+Премиум+вид',
      '/api/placeholder/800/600?text=Зал+3+LED+освещение',
      '/api/placeholder/800/600?text=Зал+3+VIP+раздевалка',
      '/api/placeholder/800/600?text=Зал+3+Зона+отдыха',
      '/api/placeholder/800/600?text=Зал+3+Климат+контроль'
    ],
    videos: [
      '/api/placeholder/video?text=Обзор+Зала+3+Premium',
      '/api/placeholder/video?text=Технологии+Зала+3'
    ],
    specifications: {
      area: '1100 м²',
      height: '11 м',
      flooring: 'Инновационное покрытие Gerflor',
      lighting: 'Умное LED освещение 1200 лк',
      ventilation: 'Интеллектуальный климат-контроль'
    },
    amenities: [
      'VIP раздевалки с сауной',
      'Премиум душевые',
      'Лаунж-зона',
      'Мини-бар',
      'Массажные кресла',
      'Система очистки воздуха',
      'Умное освещение',
      'Premium Wi-Fi',
      'Valet парковка'
    ],
    working_hours: {
      weekdays: '06:00 - 23:00',
      weekends: '08:00 - 22:00'
    },
    is_active: true
  }
};

export default function HallPage() {
  const params = useParams();
  const router = useRouter();
  const hallId = parseInt(params.id as string);
  const hall = hallsData[hallId];

  const [showBooking, setShowBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    time: string;
    court: number;
  } | null>(null);

  if (!hall) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Зал не найден</h1>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  const handleSlotSelect = (date: Date, time: string, court: number) => {
    setSelectedSlot({ date, time, court });
  };

  const handleBookingSubmit = (data: { name: string; phone: string; email?: string; hallId: number; date: Date; time: string; court: number }) => {
    console.log('Booking submitted:', data);
    setSelectedSlot(null);
    setShowBooking(false);
    // Здесь будет отправка данных на сервер
  };

  const handleBookingCancel = () => {
    setSelectedSlot(null);
    setShowBooking(false);
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <button
              onClick={() => router.push('/')}
              className="flex items-center text-blue-200 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к залам
            </button>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{hall.name}</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6">
              {hall.description}
            </p>
            <div className="flex items-center space-x-6 text-blue-100">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {hall.courts_count} кортов
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Кишинев
              </div>
              <div className="text-2xl font-bold text-white">
                {hall.price_per_hour} лей/час
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Info */}
          <div className="lg:col-span-2">
            {/* Media Gallery */}
            <div className="mb-8">
              <MediaGallery
                images={hall.images}
                videos={hall.videos}
                title={hall.name}
              />
            </div>

            {/* Detailed Description */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">О зале</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {hall.detailed_description}
              </p>

              {/* Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Особенности:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {hall.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Star className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Технические характеристики:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Площадь:</span>
                    <div className="font-medium">{hall.specifications.area}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Высота потолков:</span>
                    <div className="font-medium">{hall.specifications.height}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Покрытие:</span>
                    <div className="font-medium">{hall.specifications.flooring}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Освещение:</span>
                    <div className="font-medium">{hall.specifications.lighting}</div>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-sm text-gray-500">Вентиляция:</span>
                    <div className="font-medium">{hall.specifications.ventilation}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking and Info */}
          <div className="lg:col-span-1">
            {/* Booking Section */}
            {!showBooking && !selectedSlot && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 sticky top-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Бронирование</h3>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {hall.price_per_hour} лей
                  </div>
                  <div className="text-gray-600">за час</div>
                </div>
                <button
                  onClick={() => setShowBooking(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Забронировать
                </button>
              </div>
            )}

            {/* Booking Calendar */}
            {showBooking && !selectedSlot && (
              <div className="mb-6">
                <BookingCalendar
                  hallId={hall.id}
                  onSlotSelect={handleSlotSelect}
                />
                <div className="mt-4">
                  <button
                    onClick={() => setShowBooking(false)}
                    className="w-full text-gray-600 hover:text-gray-800 py-2"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {/* Booking Form */}
            {selectedSlot && (
              <div className="mb-6">
                <BookingForm
                  hallId={hall.id}
                  date={selectedSlot.date}
                  time={selectedSlot.time}
                  court={selectedSlot.court}
                  onSubmit={handleBookingSubmit}
                  onCancel={handleBookingCancel}
                />
              </div>
            )}

            {/* Working Hours */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Режим работы</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <div>
                    <div className="font-medium">Пн-Пт:</div>
                    <div className="text-gray-600">{hall.working_hours.weekdays}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <div>
                    <div className="font-medium">Сб-Вс:</div>
                    <div className="text-gray-600">{hall.working_hours.weekends}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Удобства</h3>
              <div className="space-y-2">
                {hall.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-600">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>



      <Footer />
    </div>
  );
}
