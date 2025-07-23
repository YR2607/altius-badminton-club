'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  hallId: number;
  currentImages: string[];
  onImagesUpdate: (images: string[]) => void;
}

export default function ImageUploader({ hallId, currentImages, onImagesUpdate }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadImages = async (files: FileList) => {
    if (!files.length) return;

    setUploading(true);
    try {
      const uploadedImages: string[] = [];

      for (const file of Array.from(files)) {
        // Проверяем тип файла
        if (!file.type.startsWith('image/')) {
          alert(`Файл ${file.name} не является изображением`);
          continue;
        }

        // Проверяем размер файла (максимум 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`Файл ${file.name} слишком большой. Максимальный размер: 5MB`);
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${hallId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('hall-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          alert(`Ошибка загрузки файла ${file.name}: ${uploadError.message}`);
          continue;
        }

        const { data } = supabase.storage
          .from('hall-images')
          .getPublicUrl(fileName);

        uploadedImages.push(data.publicUrl);
      }

      if (uploadedImages.length > 0) {
        const updatedImages = [...currentImages, ...uploadedImages];
        onImagesUpdate(updatedImages);
        alert(`Успешно загружено ${uploadedImages.length} изображений`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Произошла ошибка при загрузке изображений');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (imageUrl: string, index: number) => {
    try {
      // Извлекаем путь к файлу из URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${hallId}/${fileName}`;

      // Удаляем файл из storage
      const { error } = await supabase.storage
        .from('hall-images')
        .remove([filePath]);

      if (error) {
        console.error('Error removing file:', error);
      }

      // Обновляем список изображений
      const updatedImages = currentImages.filter((_, i) => i !== index);
      onImagesUpdate(updatedImages);
    } catch (error) {
      console.error('Error removing image:', error);
      alert('Ошибка при удалении изображения');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadImages(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className="space-y-4">
      {/* Зона загрузки */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-altius-blue bg-altius-blue/5'
            : 'border-gray-300 hover:border-altius-blue'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && uploadImages(e.target.files)}
          className="hidden"
          id={`images-${hallId}`}
          disabled={uploading}
        />
        
        <div className="space-y-2">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
          <div>
            <label
              htmlFor={`images-${hallId}`}
              className={`cursor-pointer text-altius-blue hover:text-altius-blue-dark font-medium ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? 'Загрузка...' : 'Выберите файлы'}
            </label>
            <span className="text-gray-500"> или перетащите их сюда</span>
          </div>
          <p className="text-sm text-gray-500">
            PNG, JPG, GIF до 5MB каждый
          </p>
        </div>
      </div>

      {/* Кнопка загрузки */}
      <button
        onClick={() => document.getElementById(`images-${hallId}`)?.click()}
        disabled={uploading}
        className="w-full bg-altius-orange text-white py-3 px-4 rounded-lg hover:bg-altius-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
      >
        <Upload className="w-5 h-5 mr-2" />
        {uploading ? 'Загрузка изображений...' : 'Загрузить изображения'}
      </button>

      {/* Превью загруженных изображений */}
      {currentImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Загруженные изображения ({currentImages.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Изображение ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(image, index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Удалить изображение"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
