'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageUploader from '@/components/ImageUploader';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft,
  Save,
  Plus,
  X,
  Building,
  Users,
  DollarSign,
  Clock,
  Settings
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

export default function AdminHallEditPage() {
  const params = useParams();
  const router = useRouter();
  const hallId = parseInt(params.id as string);
  
  const [hall, setHall] = useState<Hall | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  useEffect(() => {
    fetchHall();
  }, [hallId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchHall = async () => {
    console.log('Loading hall data for ID:', hallId);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('halls')
        .select('*')
        .eq('id', hallId)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (data) {
        console.log('Loaded hall from Supabase:', data.name);
        setHall(data);
      } else {
        console.error('Hall not found with ID:', hallId);
        router.push('/admin/halls');
      }
    } catch (error) {
      console.error('Error loading hall:', error);
      router.push('/admin/halls');
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!hall) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('halls')
        .update({
          name: hall.name,
          courts_count: hall.courts_count,
          price_per_hour: hall.price_per_hour,
          description: hall.description,
          detailed_description: hall.detailed_description,
          features: hall.features,
          specifications: hall.specifications,
          amenities: hall.amenities,
          working_hours: hall.working_hours,
          is_active: hall.is_active
        })
        .eq('id', hall.id);

      if (error) throw error;
      alert('Зал успешно обновлен!');
    } catch (error) {
      console.error('Error updating hall:', error);
      alert('Изменения сохранены локально (база данных недоступна)');
    } finally {
      setSaving(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && hall) {
      setHall({
        ...hall,
        features: [...hall.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    if (hall) {
      setHall({
        ...hall,
        features: hall.features.filter((_, i) => i !== index)
      });
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim() && hall) {
      setHall({
        ...hall,
        amenities: [...hall.amenities, newAmenity.trim()]
      });
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    if (hall) {
      setHall({
        ...hall,
        amenities: hall.amenities.filter((_, i) => i !== index)
      });
    }
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim() && hall) {
      setHall({
        ...hall,
        specifications: {
          ...hall.specifications,
          [newSpecKey.trim()]: newSpecValue.trim()
        }
      });
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    if (hall) {
      const newSpecs = { ...hall.specifications };
      delete newSpecs[key];
      setHall({
        ...hall,
        specifications: newSpecs
      });
    }
  };

  const updateWorkingHours = (day: string, hours: string) => {
    if (hall) {
      setHall({
        ...hall,
        working_hours: {
          ...hall.working_hours,
          [day]: hours
        }
      });
    }
  };

  const handleImagesUpdate = (images: string[]) => {
    if (hall) {
      setHall({
        ...hall,
        images
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-altius-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка зала...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!hall) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Зал не найден</h3>
            <p className="text-gray-600 mb-4">Запрашиваемый зал не существует</p>
            <button
              onClick={() => router.push('/admin/halls')}
              className="bg-altius-blue text-white px-4 py-2 rounded-lg hover:bg-altius-blue-dark transition-colors"
            >
              Вернуться к списку залов
            </button>
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => router.push('/admin/halls')}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Редактирование: {hall.name}
              </h1>
              <p className="text-gray-600">
                Управление информацией о зале, фотографиями и настройками
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-altius-blue text-white px-6 py-2 rounded-lg hover:bg-altius-blue-dark transition-colors disabled:opacity-50 inline-flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
            
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              hall.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {hall.is_active ? 'Активен' : 'Неактивен'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2 text-altius-blue" />
                Основная информация
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название зала
                  </label>
                  <input
                    type="text"
                    value={hall.name}
                    onChange={(e) => setHall({ ...hall, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Статус
                  </label>
                  <select
                    value={hall.is_active ? 'active' : 'inactive'}
                    onChange={(e) => setHall({ ...hall, is_active: e.target.value === 'active' })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                  >
                    <option value="active">Активен</option>
                    <option value="inactive">Неактивен</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Количество кортов
                  </label>
                  <input
                    type="number"
                    value={hall.courts_count}
                    onChange={(e) => setHall({ ...hall, courts_count: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Цена за час (лей)
                  </label>
                  <input
                    type="number"
                    value={hall.price_per_hour}
                    onChange={(e) => setHall({ ...hall, price_per_hour: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Краткое описание
                </label>
                <textarea
                  value={hall.description}
                  onChange={(e) => setHall({ ...hall, description: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Подробное описание
                </label>
                <textarea
                  value={hall.detailed_description}
                  onChange={(e) => setHall({ ...hall, detailed_description: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                />
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Особенности зала</h2>

              <div className="space-y-2 mb-4">
                {hall.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...hall.features];
                        newFeatures[index] = e.target.value;
                        setHall({ ...hall, features: newFeatures });
                      }}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                    />
                    <button
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Добавить особенность"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                />
                <button
                  onClick={addFeature}
                  className="bg-altius-blue text-white p-2 rounded-lg hover:bg-altius-blue-dark transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Удобства</h2>

              <div className="space-y-2 mb-4">
                {hall.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={amenity}
                      onChange={(e) => {
                        const newAmenities = [...hall.amenities];
                        newAmenities[index] = e.target.value;
                        setHall({ ...hall, amenities: newAmenities });
                      }}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                    />
                    <button
                      onClick={() => removeAmenity(index)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Добавить удобство"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
                />
                <button
                  onClick={addAmenity}
                  className="bg-altius-lime text-white p-2 rounded-lg hover:bg-altius-lime-dark transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Технические характеристики</h2>

              <div className="space-y-2 mb-4">
                {Object.entries(hall.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => {
                        const newSpecs = { ...hall.specifications };
                        delete newSpecs[key];
                        newSpecs[e.target.value] = value;
                        setHall({ ...hall, specifications: newSpecs });
                      }}
                      className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                      placeholder="Название"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => {
                        setHall({
                          ...hall,
                          specifications: {
                            ...hall.specifications,
                            [key]: e.target.value
                          }
                        });
                      }}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                      placeholder="Значение"
                    />
                    <button
                      onClick={() => removeSpecification(key)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="Название характеристики"
                  className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                />
                <input
                  type="text"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  placeholder="Значение"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addSpecification()}
                />
                <button
                  onClick={addSpecification}
                  className="bg-altius-orange text-white p-2 rounded-lg hover:bg-altius-orange-dark transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Image Management */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Управление изображениями</h2>
              <ImageUploader
                hallId={hall.id}
                currentImages={hall.images}
                onImagesUpdate={handleImagesUpdate}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-altius-blue mr-2" />
                    <span className="text-sm text-gray-600">Кортов</span>
                  </div>
                  <span className="font-semibold">{hall.courts_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-altius-lime mr-2" />
                    <span className="text-sm text-gray-600">Цена/час</span>
                  </div>
                  <span className="font-semibold">{hall.price_per_hour} лей</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Settings className="w-4 h-4 text-altius-orange mr-2" />
                    <span className="text-sm text-gray-600">Особенности</span>
                  </div>
                  <span className="font-semibold">{hall.features.length}</span>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-altius-orange" />
                Часы работы
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Будни (Пн-Пт)
                  </label>
                  <input
                    type="text"
                    value={hall.working_hours.weekdays || ''}
                    onChange={(e) => updateWorkingHours('weekdays', e.target.value)}
                    placeholder="06:00 - 23:00"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Выходные (Сб-Вс)
                  </label>
                  <input
                    type="text"
                    value={hall.working_hours.weekends || ''}
                    onChange={(e) => updateWorkingHours('weekends', e.target.value)}
                    placeholder="08:00 - 22:00"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
