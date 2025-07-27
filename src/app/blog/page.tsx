'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types';
import { Calendar, MapPin, User, Tag, Clock, Eye } from 'lucide-react';

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'post' | 'event'>('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    console.log('Loading blog posts...');
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
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

  const filteredPosts = posts.filter(post => 
    activeFilter === 'all' || post.category === activeFilter
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatEventDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Новости и События
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Следите за последними новостями клуба Altius, предстоящими турнирами и специальными событиями
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-altius-blue text-white'
                  : 'text-gray-600 hover:text-altius-blue'
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setActiveFilter('post')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeFilter === 'post'
                  ? 'bg-altius-lime text-white'
                  : 'text-gray-600 hover:text-altius-lime'
              }`}
            >
              Новости
            </button>
            <button
              onClick={() => setActiveFilter('event')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeFilter === 'event'
                  ? 'bg-altius-orange text-white'
                  : 'text-gray-600 hover:text-altius-orange'
              }`}
            >
              События
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-altius-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка постов...</p>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Featured Image */}
                {post.featured_image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.category === 'event'
                          ? 'bg-altius-orange text-white'
                          : 'bg-altius-lime text-white'
                      }`}
                    >
                      {post.category === 'event' ? 'Событие' : 'Новость'}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Eye className="w-4 h-4 mr-1" />
                      {post.views_count}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-altius-blue transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Event Details */}
                  {post.category === 'event' && post.event_date && (
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-altius-orange" />
                        {formatEventDate(post.event_date)}
                      </div>
                      {post.event_location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-altius-orange" />
                          {post.event_location}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.author_name}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(post.created_at)}
                    </div>
                  </div>

                  {/* Read More Button */}
                  <div className="mt-4">
                    <Link
                      href={`/blog/${post.slug}`}
                      className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                        post.category === 'event'
                          ? 'bg-altius-orange text-white hover:bg-orange-600'
                          : 'bg-altius-blue text-white hover:bg-blue-700'
                      }`}
                    >
                      Читать далее
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Пока нет постов
            </h3>
            <p className="text-gray-600">
              {activeFilter === 'all' 
                ? 'Скоро здесь появятся новости и события клуба'
                : `Пока нет ${activeFilter === 'post' ? 'новостей' : 'событий'}`
              }
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
