'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Play, Image as ImageIcon } from 'lucide-react';

interface MediaGalleryProps {
  images: string[];
  videos: string[];
  title: string;
}

export default function MediaGallery({ images, videos, title }: MediaGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const openVideoModal = (index: number) => {
    setSelectedVideoIndex(index);
    setIsVideoModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('images')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'images'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ImageIcon className="w-4 h-4 inline mr-2" />
            Фотографии ({images.length})
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'videos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Play className="w-4 h-4 inline mr-2" />
            Видео ({videos.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'images' && (
          <div>
            {/* Main Image */}
            <div className="relative h-96 mb-4 rounded-lg overflow-hidden">
              <img
                src={images[selectedImageIndex]}
                alt={`${title} - фото ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => openImageModal(selectedImageIndex)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Миниатюра ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video, index) => (
              <div
                key={index}
                className="relative bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => openVideoModal(index)}
              >
                <div className="aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-12 h-12 text-blue-600 group-hover:text-blue-700 transition-colors mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Видео {index + 1}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full w-full">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative">
              <img
                src={images[selectedImageIndex]}
                alt={`${title} - фото ${selectedImageIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain mx-auto"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}
            </div>
            
            <div className="text-center mt-4">
              <p className="text-white text-lg">{title}</p>
              <p className="text-gray-300">Фото {selectedImageIndex + 1} из {images.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full w-full">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <Play className="w-16 h-16 text-white mx-auto mb-4" />
              <h3 className="text-white text-xl mb-2">Видео плеер</h3>
              <p className="text-gray-400 mb-4">
                Здесь будет воспроизводиться видео: {videos[selectedVideoIndex]}
              </p>
              <div className="bg-gray-700 rounded-lg p-4 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">Видео {selectedVideoIndex + 1}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
