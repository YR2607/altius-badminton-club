'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import {
  Edit,
  Save,
  X,
  Upload,
  Eye,
  EyeOff
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
  const [editingHall, setEditingHall] = useState<Hall | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const { data, error } = await supabase
        .from('halls')
        .select('*')
        .order('id');

      if (error) throw error;
      setHalls(data || []);
    } catch (error) {
      console.error('Error fetching halls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hall: Hall) => {
    setEditingHall({ ...hall });
  };

  const handleCancel = () => {
    setEditingHall(null);
  };

  const handleSave = async () => {
    if (!editingHall) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('halls')
        .update({
          name: editingHall.name,
          courts_count: editingHall.courts_count,
          price_per_hour: editingHall.price_per_hour,
          description: editingHall.description,
          detailed_description: editingHall.detailed_description,
          features: editingHall.features,
          specifications: editingHall.specifications,
          amenities: editingHall.amenities,
          working_hours: editingHall.working_hours,
          is_active: editingHall.is_active
        })
        .eq('id', editingHall.id);

      if (error) throw error;

      await fetchHalls();
      setEditingHall(null);
      alert('Зал успешно обновлен!');
    } catch (error) {
      console.error('Error updating hall:', error);
      alert('Ошибка при обновлении зала');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (hallId: number, files: FileList) => {
    if (!files.length) return;

    setUploading(true);
    try {
      const uploadedImages: string[] = [];

      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${hallId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('hall-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('hall-images')
          .getPublicUrl(fileName);

        uploadedImages.push(data.publicUrl);
      }

      // Обновляем массив изображений в базе данных
      const hall = halls.find(h => h.id === hallId);
      if (hall) {
        const updatedImages = [...(hall.images || []), ...uploadedImages];
        
        const { error } = await supabase
          .from('halls')
          .update({ images: updatedImages })
          .eq('id', hallId);

        if (error) throw error;
        await fetchHalls();
        alert('Изображения успешно загружены!');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Ошибка при загрузке изображений');
    } finally {
      setUploading(false);
    }
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
      alert('Ошибка при изменении статуса зала');
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
            Редактируйте информацию о залах, загружайте фотографии и управляйте контентом
          </p>
        </div>

        <div className="space-y-6">
          {halls.map((hall) => (
            <div key={hall.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      {editingHall?.id === hall.id ? (
                        <input
                          type="text"
                          value={editingHall.name}
                          onChange={(e) => setEditingHall({
                            ...editingHall,
                            name: e.target.value
                          })}
                          className="border border-gray-300 rounded-lg px-3 py-1 text-xl font-bold"
                        />
                      ) : (
                        hall.name
                      )}
                    </h2>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      hall.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {hall.is_active ? 'Активен' : 'Неактивен'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
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
                    
                    {editingHall?.id === hall.id ? (
                      <>
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="bg-altius-blue text-white px-4 py-2 rounded-lg hover:bg-altius-blue-dark transition-colors disabled:opacity-50"
                        >
                          <Save className="w-4 h-4 mr-2 inline" />
                          {saving ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <X className="w-4 h-4 mr-2 inline" />
                          Отмена
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(hall)}
                        className="bg-altius-lime text-white px-4 py-2 rounded-lg hover:bg-altius-lime-dark transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-2 inline" />
                        Редактировать
                      </button>
                    )}
                  </div>
                </div>

                {/* Основная информация */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Количество кортов
                    </label>
                    {editingHall?.id === hall.id ? (
                      <input
                        type="number"
                        value={editingHall.courts_count}
                        onChange={(e) => setEditingHall({
                          ...editingHall,
                          courts_count: parseInt(e.target.value)
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    ) : (
                      <p className="text-gray-900">{hall.courts_count} кортов</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Цена за час (лей)
                    </label>
                    {editingHall?.id === hall.id ? (
                      <input
                        type="number"
                        value={editingHall.price_per_hour}
                        onChange={(e) => setEditingHall({
                          ...editingHall,
                          price_per_hour: parseInt(e.target.value)
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    ) : (
                      <p className="text-gray-900">{hall.price_per_hour} лей</p>
                    )}
                  </div>
                </div>

                {/* Описания */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Краткое описание
                    </label>
                    {editingHall?.id === hall.id ? (
                      <textarea
                        value={editingHall.description}
                        onChange={(e) => setEditingHall({
                          ...editingHall,
                          description: e.target.value
                        })}
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    ) : (
                      <p className="text-gray-700">{hall.description}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Подробное описание
                    </label>
                    {editingHall?.id === hall.id ? (
                      <textarea
                        value={editingHall.detailed_description || ''}
                        onChange={(e) => setEditingHall({
                          ...editingHall,
                          detailed_description: e.target.value
                        })}
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    ) : (
                      <p className="text-gray-700">{hall.detailed_description}</p>
                    )}
                  </div>
                </div>

                {/* Загрузка изображений */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Изображения зала
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => e.target.files && handleImageUpload(hall.id, e.target.files)}
                      className="hidden"
                      id={`images-${hall.id}`}
                    />
                    <label
                      htmlFor={`images-${hall.id}`}
                      className="bg-altius-orange text-white px-4 py-2 rounded-lg hover:bg-altius-orange-dark transition-colors cursor-pointer inline-flex items-center"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Загрузка...' : 'Загрузить фото'}
                    </label>
                    <span className="text-sm text-gray-500">
                      {hall.images?.length || 0} изображений
                    </span>
                  </div>
                  
                  {/* Превью изображений */}
                  {hall.images && hall.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {hall.images.slice(0, 4).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${hall.name} - ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      ))}
                      {hall.images.length > 4 && (
                        <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                          +{hall.images.length - 4} еще
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
