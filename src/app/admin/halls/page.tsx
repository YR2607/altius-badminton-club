'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import {
  Edit,
  Eye,
  EyeOff,
  ArrowRight,
  Building,
  Users,
  DollarSign
} from 'lucide-react';

interface Hall {
  id: number;
  name: string;
  courts_count: number;
  price_per_hour: number;
  description: string;
  detailed_description: string;
  features: string[];
  images: string[];
  videos: string[];
  specifications: Record<string, string>;
  amenities: string[];
  working_hours: Record<string, string>;
  is_active: boolean;
}

export default function AdminHallsPage() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    console.log('Loading halls data...');
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('halls')
        .select('*')
        .order('id');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (data && data.length > 0) {
        console.log('Loaded halls from Supabase:', data.length);
        setHalls(data);
      } else {
        console.log('No halls found in database, using fallback data');
        // Fallback data if database is empty
        setHalls([
          {
            id: 1,
            name: 'Зал 1',
            courts_count: 3,
            price_per_hour: 150,
            description: 'Уютный зал с профессиональными кортами для игры в бадминтон',
            detailed_description: 'Зал 1 - это идеальное место для начинающих игроков и любителей бадминтона.',
            features: ['Профессиональное покрытие', 'Отличное освещение', 'Кондиционирование воздуха'],
            images: [],
            videos: [],
            specifications: { area: '300 м²', height: '9 м' },
            amenities: ['Раздевалки', 'Душевые', 'Парковка'],
            working_hours: { weekdays: '06:00 - 23:00', weekends: '08:00 - 22:00' },
            is_active: true
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading halls:', error);
      // Fallback data on error
      setHalls([
        {
          id: 1,
          name: 'Зал 1',
          courts_count: 3,
          price_per_hour: 150,
          description: 'Уютный зал с профессиональными кортами для игры в бадминтон',
          detailed_description: 'Зал 1 - это идеальное место для начинающих игроков и любителей бадминтона.',
          features: ['Профессиональное покрытие', 'Отличное освещение', 'Кондиционирование воздуха'],
          images: [],
          videos: [],
          specifications: { area: '300 м²', height: '9 м' },
          amenities: ['Раздевалки', 'Душевые', 'Парковка'],
          working_hours: { weekdays: '06:00 - 23:00', weekends: '08:00 - 22:00' },
          is_active: true
        },
        {
          id: 2,
          name: 'Зал 2',
          courts_count: 7,
          price_per_hour: 180,
          description: 'Большой зал с семью кортами для турниров и тренировок',
          detailed_description: 'Зал 2 - наш самый большой зал для турниров.',
          features: ['Турнирные корты', 'Трибуны для зрителей'],
          images: [],
          videos: [],
          specifications: { area: '700 м²', height: '12 м' },
          amenities: ['VIP раздевалки', 'Душевые', 'Трибуны'],
          working_hours: { weekdays: '06:00 - 23:00', weekends: '08:00 - 22:00' },
          is_active: true
        },
        {
          id: 3,
          name: 'Зал 3',
          courts_count: 7,
          price_per_hour: 200,
          description: 'Современный зал с новейшим оборудованием',
          detailed_description: 'Зал 3 - наш новейший зал с современным оборудованием.',
          features: ['Новейшее покрытие', 'LED освещение'],
          images: [],
          videos: [],
          specifications: { area: '700 м²', height: '12 м' },
          amenities: ['VIP раздевалки', 'Премиум душевые'],
          working_hours: { weekdays: '06:00 - 23:00', weekends: '08:00 - 22:00' },
          is_active: true
        }
      ]);
    }

    setLoading(false);
  };

  const navigateToHallEdit = (hallId: number) => {
    router.push(`/admin/halls/${hallId}`);
  };

  const toggleHallStatus = async (hallId: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('halls')
        .update({ is_active: !currentStatus })
        .eq('id', hallId);

      if (error) throw error;
      await fetchHalls();
    } catch (error) {
      console.error('Error toggling hall status:', error);
      // For fallback data, just update locally
      setHalls(prev => prev.map(hall => 
        hall.id === hallId ? { ...hall, is_active: !currentStatus } : hall
      ));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-altius-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка залов...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Управление залами
          </h1>
          <p className="text-gray-600">
            Выберите зал для редактирования информации, загрузки фотографий и управления контентом
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.map((hall) => (
            <div key={hall.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-altius-blue/10 p-2 rounded-lg">
                      <Building className="w-6 h-6 text-altius-blue" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{hall.name}</h2>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        hall.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {hall.is_active ? 'Активен' : 'Неактивен'}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleHallStatus(hall.id, hall.is_active)}
                    className={`p-2 rounded-lg transition-colors ${
                      hall.is_active
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={hall.is_active ? 'Деактивировать' : 'Активировать'}
                  >
                    {hall.is_active ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {hall.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <Users className="w-4 h-4 mr-2 text-altius-blue" />
                    <span className="text-sm">{hall.courts_count} кортов</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <DollarSign className="w-4 h-4 mr-2 text-altius-lime" />
                    <span className="text-sm">{hall.price_per_hour} лей/час</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateToHallEdit(hall.id)}
                    className="flex-1 bg-altius-blue text-white px-4 py-2 rounded-lg hover:bg-altius-blue-dark transition-colors inline-flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Редактировать
                  </button>
                  <button
                    onClick={() => navigateToHallEdit(hall.id)}
                    className="bg-altius-lime text-white p-2 rounded-lg hover:bg-altius-lime-dark transition-colors"
                    title="Открыть детали"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {halls.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Нет залов</h3>
            <p className="text-gray-600">Залы не найдены или не загружены</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
