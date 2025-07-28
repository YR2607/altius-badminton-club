'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostImageUploader from '@/components/PostImageUploader';
import PostGalleryManager from '@/components/PostGalleryManager';
import { supabase } from '@/lib/supabase';
import { Post, PostFormData } from '@/types';
import { 
  ArrowLeft,
  Save,
  Eye,
  Calendar,
  MapPin,
  Tag,
  Image as ImageIcon,
  Type,
  FileText,
  User,
  ExternalLink
} from 'lucide-react';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    gallery_images: [],
    category: 'post',
    status: 'draft',
    author_name: 'Altius Admin',
    tags: [],
    event_date: '',
    event_location: '',
    meta_description: ''
  });

  const fetchPost = useCallback(async () => {
    console.log('Loading post with ID:', postId);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (data) {
        console.log('Loaded post from Supabase:', data.title);
        setPost(data);
        setFormData({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || '',
          content: data.content,
          featured_image: data.featured_image || '',
          gallery_images: data.gallery_images || [],
          category: data.category,
          status: data.status,
          author_name: data.author_name,
          tags: data.tags || [],
          event_date: data.event_date ? data.event_date.slice(0, 16) : '',
          event_location: data.event_location || '',
          meta_description: data.meta_description || ''
        });
      } else {
        console.error('Post not found with ID:', postId);
        router.push('/admin/posts');
      }
    } catch (error) {
      console.error('Error loading post:', error);
      router.push('/admin/posts');
    } finally {
      setLoading(false);
    }
  }, [postId, router]);

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId, fetchPost]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[а-я]/g, (char) => {
        const map: { [key: string]: string } = {
          'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
          'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
          'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
          'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
          'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };
        return map[char] || char;
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      // Only auto-generate slug if it's empty or matches the current auto-generated one
      slug: prev.slug === generateSlug(prev.title) || !prev.slug ? generateSlug(title) : prev.slug
    }));
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSave = async (status?: 'draft' | 'published') => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Заполните обязательные поля: заголовок и содержание');
      return;
    }

    setSaving(true);
    try {
      const postData = {
        ...formData,
        status: status || formData.status,
        event_date: formData.event_date || null,
        event_location: formData.event_location || null,
        meta_description: formData.meta_description || formData.excerpt
      };

      const { data, error } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', postId)
        .select()
        .single();

      if (error) {
        console.error('Error updating post:', error);
        alert('Ошибка при обновлении поста: ' + error.message);
        return;
      }

      console.log('Post updated successfully:', data);
      alert('Пост успешно обновлен!');
      
      // Update local state
      setPost(data);
      setFormData(prev => ({ ...prev, status: data.status }));
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Произошла ошибка при обновлении поста');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-altius-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка поста...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Пост не найден</h1>
            <Link
              href="/admin/posts"
              className="text-altius-blue hover:text-blue-700"
            >
              Вернуться к списку постов
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              href="/admin/posts"
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Редактировать пост</h1>
              <p className="text-gray-600 mt-1">
                {post.category === 'event' ? 'Событие' : 'Новость'} • 
                <span className={`ml-1 ${
                  post.status === 'published' ? 'text-green-600' : 
                  post.status === 'draft' ? 'text-yellow-600' : 'text-gray-600'
                }`}>
                  {post.status === 'published' ? 'Опубликован' : 
                   post.status === 'draft' ? 'Черновик' : 'Архив'}
                </span>
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Просмотр
            </Link>
            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </button>
            <button
              onClick={() => handleSave('published')}
              disabled={saving}
              className="px-4 py-2 bg-altius-blue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              {formData.status === 'published' ? 'Обновить' : 'Опубликовать'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Type className="w-4 h-4 inline mr-2" />
                Заголовок *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                placeholder="Введите заголовок поста"
              />
            </div>

            {/* Slug */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL (slug)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                placeholder="url-адрес-поста"
              />
              <p className="text-sm text-gray-500 mt-1">
                URL: /blog/{formData.slug || 'url-адрес-поста'}
              </p>
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Краткое описание
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                placeholder="Краткое описание для превью"
              />
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Содержание *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-altius-blue focus:border-transparent font-mono text-sm"
                placeholder="Содержание поста (поддерживается HTML)"
              />
              <p className="text-sm text-gray-500 mt-2">
                Поддерживается HTML разметка: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'post' | 'event' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-altius-blue focus:border-transparent"
              >
                <option value="post">Новость</option>
                <option value="event">Событие</option>
              </select>
            </div>

            {/* Event Details */}
            {formData.category === 'event' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Детали события</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Дата и время
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.event_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Место проведения
                    </label>
                    <input
                      type="text"
                      value={formData.event_location}
                      onChange={(e) => setFormData(prev => ({ ...prev, event_location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                      placeholder="Зал №1, Altius"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Featured Image */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                <ImageIcon className="w-4 h-4 inline mr-2" />
                Изображение поста
              </label>
              <PostImageUploader
                currentImage={formData.featured_image}
                onImageUpdate={(imageUrl) => setFormData(prev => ({ ...prev, featured_image: imageUrl }))}
              />
            </div>

            {/* Gallery Images */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <PostGalleryManager
                images={formData.gallery_images}
                onImagesUpdate={(images) => setFormData(prev => ({ ...prev, gallery_images: images }))}
              />
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Теги
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                placeholder="тег1, тег2, тег3"
              />
              <p className="text-sm text-gray-500 mt-1">
                Разделяйте теги запятыми
              </p>
            </div>

            {/* Author */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Автор
              </label>
              <input
                type="text"
                value={formData.author_name}
                onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                placeholder="Имя автора"
              />
            </div>

            {/* Meta Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO описание
              </label>
              <textarea
                value={formData.meta_description}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-altius-blue focus:border-transparent"
                placeholder="Описание для поисковых систем"
              />
            </div>

            {/* Post Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Статистика</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Просмотры:</span>
                  <span className="font-medium">{post.views_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Создан:</span>
                  <span className="font-medium">
                    {new Date(post.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Обновлен:</span>
                  <span className="font-medium">
                    {new Date(post.updated_at).toLocaleDateString('ru-RU')}
                  </span>
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
