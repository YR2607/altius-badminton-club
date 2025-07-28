'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types';
import { 
  Calendar, 
  MapPin, 
  User, 
  Tag, 
  Clock, 
  Eye, 
  ArrowLeft,
  Share2
} from 'lucide-react';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    console.log('Loading post with slug:', slug);
    setLoading(true);

    try {
      // Fetch the post
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (data) {
        console.log('Loaded post from Supabase:', data.title);
        setPost(data);
        
        // Increment view count
        await supabase
          .from('posts')
          .update({ views_count: data.views_count + 1 })
          .eq('id', data.id);

        // Fetch related posts
        fetchRelatedPosts(data);
      } else {
        console.error('Post not found with slug:', slug);
        router.push('/blog');
      }
    } catch (error) {
      console.error('Error loading post:', error);
      router.push('/blog');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (currentPost: Post) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, slug, excerpt, featured_image, category, created_at')
        .eq('status', 'published')
        .eq('category', currentPost.category)
        .neq('id', currentPost.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching related posts:', error);
        return;
      }

      if (data) {
        setRelatedPosts(data);
      }
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

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

  const sharePost = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.excerpt || '',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Пост не найден</h1>
            <Link
              href="/blog"
              className="text-altius-blue hover:text-blue-700"
            >
              Вернуться к блогу
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-altius-blue hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к блогу
          </Link>
        </div>

        {/* Article Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3 bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Featured Image */}
            {post.featured_image && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8 lg:p-12">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              {post.title}
            </h1>

            {/* Content */}
            <div
              className="prose prose-lg prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Post Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      post.category === 'event'
                        ? 'bg-altius-orange text-white'
                        : 'bg-altius-lime text-white'
                    }`}
                  >
                    {post.category === 'event' ? 'Событие' : 'Новость'}
                  </span>
                  <button
                    onClick={sharePost}
                    className="flex items-center text-gray-500 hover:text-altius-blue transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center text-gray-500 text-sm">
                  <Eye className="w-4 h-4 mr-2" />
                  <span>{post.views_count + 1} просмотров</span>
                </div>

                <div className="flex items-center text-gray-500 text-sm">
                  <User className="w-4 h-4 mr-2" />
                  <span>{post.author_name}</span>
                </div>

                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Event Details in Sidebar */}
            {post.category === 'event' && (
              <div className="bg-altius-orange/10 border border-altius-orange/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-altius-orange mb-4">
                  Детали события
                </h3>
                <div className="space-y-3">
                  {post.event_date && (
                    <div className="flex items-start text-gray-700">
                      <Calendar className="w-5 h-5 mr-3 text-altius-orange mt-0.5" />
                      <div>
                        <span className="font-medium block">Дата и время:</span>
                        <span className="text-sm">{formatEventDate(post.event_date)}</span>
                      </div>
                    </div>
                  )}
                  {post.event_location && (
                    <div className="flex items-start text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 text-altius-orange mt-0.5" />
                      <div>
                        <span className="font-medium block">Место:</span>
                        <span className="text-sm">{post.event_location}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags in Sidebar */}
            {post.tags && post.tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Теги</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-sm"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Похожие {post.category === 'event' ? 'события' : 'новости'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <article
                  key={relatedPost.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {relatedPost.featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                        relatedPost.category === 'event'
                          ? 'bg-altius-orange text-white'
                          : 'bg-altius-lime text-white'
                      }`}
                    >
                      {relatedPost.category === 'event' ? 'Событие' : 'Новость'}
                    </span>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      <Link
                        href={`/blog/${relatedPost.slug}`}
                        className="hover:text-altius-blue transition-colors"
                      >
                        {relatedPost.title}
                      </Link>
                    </h3>
                    {relatedPost.excerpt && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {relatedPost.excerpt}
                      </p>
                    )}
                    <div className="text-xs text-gray-500">
                      {formatDate(relatedPost.created_at)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
