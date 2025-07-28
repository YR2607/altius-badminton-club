'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, X, Plus, Image as ImageIcon, Move } from 'lucide-react';

interface PostGalleryManagerProps {
  images: string[];
  onImagesUpdate: (images: string[]) => void;
}

export default function PostGalleryManager({ images, onImagesUpdate }: PostGalleryManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

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
      const fileName = `posts/gallery/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

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

      const newImages = [...images, data.publicUrl];
      onImagesUpdate(newImages);
      alert('Изображение успешно добавлено в галерею!');
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

  const addImageByUrl = () => {
    if (!newImageUrl.trim()) return;
    
    const newImages = [...images, newImageUrl.trim()];
    onImagesUpdate(newImages);
    setNewImageUrl('');
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesUpdate(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesUpdate(newImages);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Галерея изображений ({images.length})
        </h3>
        <span className="text-sm text-gray-500">
          Для слайдера в посте
        </span>
      </div>

      {/* Current Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              
              {/* Image Controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <div className="flex space-x-2">
                  {/* Move Left */}
                  {index > 0 && (
                    <button
                      onClick={() => moveImage(index, index - 1)}
                      className="p-1 bg-white/20 text-white rounded hover:bg-white/30 transition-colors"
                      title="Переместить влево"
                    >
                      <Move className="w-4 h-4 rotate-180" />
                    </button>
                  )}
                  
                  {/* Move Right */}
                  {index < images.length - 1 && (
                    <button
                      onClick={() => moveImage(index, index + 1)}
                      className="p-1 bg-white/20 text-white rounded hover:bg-white/30 transition-colors"
                      title="Переместить вправо"
                    >
                      <Move className="w-4 h-4" />
                    </button>
                  )}
                  
                  {/* Remove */}
                  <button
                    onClick={() => removeImage(index)}
                    className="p-1 bg-red-500/80 text-white rounded hover:bg-red-600 transition-colors"
                    title="Удалить"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Image Number */}
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
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

      {/* Add by URL */}
      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Добавить изображение по URL
        </label>
        <div className="flex space-x-2">
          <input
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-altius-blue focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
          <button
            onClick={addImageByUrl}
            disabled={!newImageUrl.trim()}
            className="px-4 py-2 bg-altius-lime text-white rounded-lg hover:bg-lime-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Добавить
          </button>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Как использовать в посте:</h4>
        <p className="text-sm text-blue-800 mb-2">
          Добавьте в содержание поста следующий код для отображения слайдера:
        </p>
        <code className="block bg-blue-100 text-blue-900 p-2 rounded text-sm font-mono">
          {`<div data-slider="gallery"></div>`}
        </code>
        <p className="text-xs text-blue-700 mt-2">
          Слайдер автоматически отобразит все изображения из галереи
        </p>
      </div>
    </div>
  );
}
