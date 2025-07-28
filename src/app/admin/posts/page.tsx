'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types';
import { 
  Plus, 
  Edit, 
  Eye,
  EyeOff,
  Trash2,
  Calendar,
  MapPin,
  Tag,
  User,
  Clock
} from 'lucide-react';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'post' | 'event' | 'draft' | 'published'>('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    console.log('Loading posts for admin...');
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (data) {
        console.log('Loaded posts from Supabase:', data.length);
        setPosts(data);
      } else {
        console.log('No posts found');
        setPosts([]);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const togglePostStatus = async (post: Post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    
    try {
      const { error } = await supabase
        .from('posts')
        .update({ status: newStatus })
        .eq('id', post.id);

      if (error) {
        console.error('Error updating post status:', error);
        alert('Ошибка при изменении статуса поста');
        return;
      }

      // Update local state
      setPosts(posts.map(p => 
        p.id === post.id ? { ...p, status: newStatus } : p
      ));
    } catch (error) {
      console.error('Error updating post status:', error);
      alert('Ошибка при изменении статуса поста');
    }
  };

  const deletePost = async (post: Post) => {
    if (!confirm(`Вы уверены, что хотите удалить пост "${post.title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);

      if (error) {
        console.error('Error deleting post:', error);
        alert('Ошибка при удалении поста');
        return;
      }

      // Update local state
      setPosts(posts.filter(p => p.id !== post.id));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Ошибка при удалении поста');
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'post' || filter === 'event') return post.category === filter;
    if (filter === 'draft' || filter === 'published') return post.status === filter;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatEventDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Управление постами</h1>
            <p className="text-gray-600 mt-2">Создавайте и редактируйте новости и события</p>
          </div>
          <Link
            href="/admin/posts/new"
            className="bg-altius-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Создать пост
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Все', color: 'gray' },
              { key: 'post', label: 'Новости', color: 'lime' },
              { key: 'event', label: 'События', color: 'orange' },
              { key: 'published', label: 'Опубликованные', color: 'green' },
              { key: 'draft', label: 'Черновики', color: 'yellow' }
            ].map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setFilter(key as 'all' | 'post' | 'event' | 'draft' | 'published')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === key
                    ? `bg-${color === 'gray' ? 'gray' : color === 'lime' ? 'altius-lime' : color === 'orange' ? 'altius-orange' : color === 'green' ? 'green' : 'yellow'}-${color === 'gray' ? '800' : '500'} text-white`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-altius-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка постов...</p>
          </div>
        )}

        {/* Posts List */}
        {!loading && (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center space-x-3 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          post.category === 'event'
                            ? 'bg-altius-orange text-white'
                            : 'bg-altius-lime text-white'
                        }`}
                      >
                        {post.category === 'event' ? 'Событие' : 'Новость'}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : post.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {post.status === 'published' ? 'Опубликован' : 
                         post.status === 'draft' ? 'Черновик' : 'Архив'}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Eye className="w-4 h-4 mr-1" />
                        {post.views_count}
                      </div>
                    </div>

                    {/* Title and Excerpt */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Event Details */}
                    {post.category === 'event' && (
                      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                        {post.event_date && (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-altius-orange" />
                            {formatEventDate(post.event_date)}
                          </div>
                        )}
                        {post.event_location && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-altius-orange" />
                            {post.event_location}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{post.tags.length - 3} еще
                          </span>
                        )}
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {post.author_name}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(post.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-altius-blue transition-colors"
                      title="Просмотреть"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="p-2 text-gray-400 hover:text-altius-lime transition-colors"
                      title="Редактировать"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => togglePostStatus(post)}
                      className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                      title={post.status === 'published' ? 'Снять с публикации' : 'Опубликовать'}
                    >
                      {post.status === 'published' ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => deletePost(post)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Нет постов
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Создайте первый пост для вашего блога'
                : `Нет постов в категории "${filter}"`
              }
            </p>
            <Link
              href="/admin/posts/new"
              className="bg-altius-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Создать пост
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
