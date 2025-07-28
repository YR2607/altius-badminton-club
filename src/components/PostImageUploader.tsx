'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface PostImageUploaderProps {
  currentImage: string;
  onImageUpdate: (imageUrl: string) => void;
}

export default function PostImageUploader({ currentImage, onImageUpdate }: PostImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadImage = async (file: File) => {
    if (!file) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      alert('Файл должен быть изображением');
      return;
    }

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер: 5MB');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `posts/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert(`Ошибка загрузки: ${uploadError.message}`);
        return;
      }

      const { data } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      onImageUpdate(data.publicUrl);
      alert('Изображение успешно загружено!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Произошла ошибка при загрузке изображения');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadImage(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadImage(files[0]);
    }
  };

  const removeImage = () => {
    onImageUpdate('');
  };

  return (
    <div className="space-y-4">
      {/* Current Image */}
      {currentImage && (
        <div className="relative">
          <img
            src={currentImage}
            alt="Featured image"
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            title="Удалить изображение"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-altius-blue bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-altius-blue mb-2"></div>
            <p className="text-gray-600">Загрузка изображения...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              Перетащите изображение сюда или
            </p>
            <label className="cursor-pointer bg-altius-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Выберите файл
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">
              PNG, JPG, GIF до 5MB
            </p>
          </div>
        )}
      </div>

      {/* URL Input */}
      <div className="text-center text-gray-500">
        <span className="text-sm">или</span>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL изображения
        </label>
        <input
          type="url"
          value={currentImage}
          onChange={(e) => onImageUpdate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-altius-blue focus:border-transparent"
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </div>
  );
}
