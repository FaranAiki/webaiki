"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Send, User, Plus, X, Camera, Trash2 } from 'lucide-react';
import { getNews, postNews, uploadFile, deleteNews } from '@/app/actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePresentation } from '../providers/PresentationContext';
import FadeInSection from '../shared/FadeInSection';
import { getNewsArticleSchema } from '@/lib/seo';
import Link from 'next/link';
import { getErrorMessage } from '@/lib/errors';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string | null;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
}

interface NewsDisplayProps {
  dict: Record<string, string>;
  lang: string;
  isAdmin: boolean;
  initialNews?: NewsItem[];
}

export default function NewsDisplay({ dict, lang, isAdmin, initialNews = [] }: NewsDisplayProps) {
  const router = useRouter();
  const { isPresentationMode } = usePresentation();
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [loading, setLoading] = useState(initialNews.length === 0);
  const [isAdminState, setIsAdminState] = useState(isAdmin);
  const [showPostForm, setShowPostForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check admin status on client side asynchronously
    // so it doesn't block the server-side rendering
    const checkAdmin = async () => {
      try {
        const { createClient } = await import('@/utils/supabase/client');
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email === 'faran.aiki.business@gmail.com') {
          setIsAdminState(true);
        }
      } catch (e) {
        console.error("Failed to check admin status", e);
      }
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    if (initialNews.length === 0) {
      fetchNews();
    }
  }, [initialNews]);

  // Generate JSON-LD for News Articles
  const jsonLd = useMemo(() => {
    return news.map(item => getNewsArticleSchema(item));
  }, [news]);

  const newsChunks = useMemo(() => {
    if (!isPresentationMode) return [];
    const chunks = [];
    for (let i = 0; i < news.length; i += 3) {
      chunks.push(news.slice(i, i + 3));
    }
    return chunks;
  }, [news, isPresentationMode]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await getNews();
      setNews(data as unknown as NewsItem[]);
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(dict.Delete + '?')) return;
    
    try {
      const result = await deleteNews(id);
      if (result.success) {
        setNews(news.filter(n => n.id !== id));
        router.refresh();
      } else {
        alert(getErrorMessage(result.error, dict));
      }
    } catch (err) {
      console.error('Error deleting news:', err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadFile(formData, 'news-image');

    if (result.success) {
      setImageUrl(result.url!);
    } else {
      setError(getErrorMessage(result.error, dict));
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    setError(null);

    const result = await postNews(title, content, imageUrl || undefined);

    if (result.success) {
      setTitle('');
      setContent('');
      setImageUrl('');
      setShowPostForm(false);
      fetchNews();
      router.refresh();
    } else {
      setError(getErrorMessage(result.error, dict));
    }
    setSubmitting(false);
  };

  return (
    <div className={`${isPresentationMode ? 'presentation-container' : 'max-w-4xl mx-auto space-y-12 pb-20'}`}>
      {/* Schema.org NewsArticle markup */}
      {jsonLd.map((ld, i) => (
        <script
          key={`news-ld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}

      {!isPresentationMode && (
        <section className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-4xl md:text-5xl font-black nav-active-gacor flex items-center gap-4">
            <Newspaper size={40} className="text-theme-500" />
            {dict.News}
          </h1>
          
          {isAdminState && (
            <button
              onClick={() => setShowPostForm(!showPostForm)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-theme-500 text-white font-bold hover:bg-theme-400 transition-all hover:scale-105"
            >
              {showPostForm ? <X size={20} /> : <Plus size={20} />}
              {dict.Post_News}
            </button>
          )}
        </section>
      )}

      {!isPresentationMode && (
        <AnimatePresence>
          {showPostForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 md:p-6 bg-theme-surface rounded-2xl border border-theme-border shadow-theme-shadow mb-12">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-theme-muted mb-1">{dict.Title || 'Title'}</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-theme-muted mb-1">{dict.Image_Optional || 'Image (Optional)'}</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-theme-surface-strong border border-theme-border hover:border-theme-500 cursor-pointer transition-all">
                        {uploading ? (
                          <div className="w-5 h-5 border-2 border-theme-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Camera size={18} className="text-theme-muted" />
                        )}
                        <span className="text-xs font-bold text-theme-muted">{dict.Upload_Photo || 'Upload Photo'}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                      </label>
                      
                      {imageUrl && (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-theme-border">
                          <Image src={imageUrl} alt="News" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                          <button 
                            type="button"
                            onClick={() => setImageUrl('')}
                            className="absolute top-1 right-1 p-0.5 bg-black/50 text-white rounded-full hover:bg-black"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-theme-muted mb-1">{dict.Content}</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full h-40 px-4 py-3 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 outline-none transition-all resize-none"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl bg-theme-500 text-white font-bold hover:bg-theme-400 hover:scale-105 transition-all disabled:opacity-50"
                    >
                      {submitting ? dict.Waiting : (
                        <>
                          <Send size={18} />
                          {dict.Send}
                        </>
                      )}
                    </button>
                  </div>
                  
                  {error && (
                    <p className="text-red-500 text-sm font-medium">
                      {error}
                    </p>
                  )}
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {isPresentationMode ? (
        newsChunks.map((chunk, slideIdx) => (
          <FadeInSection
            key={`slide-${slideIdx}`}
            className="w-full h-full flex items-center justify-center p-8"
            slideIndex={slideIdx + 1}
            totalSlides={newsChunks.length}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
              {chunk.map((item) => (
                <article
                  key={item.id}
                  className="bg-theme-surface border border-theme-border rounded-3xl overflow-hidden flex flex-col shadow-xl"
                >
                  <Link href={`/${lang}/news/${item.id}`} className="block">
                    {item.image ? (
                      <div className="relative w-full h-48 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-theme-surface-strong flex items-center justify-center text-theme-muted">
                        <Newspaper size={48} />
                      </div>
                    )}
                  </Link>
                  <div className="p-5 md:p-6 space-y-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-theme-500">
                        {new Date(item.createdAt).toLocaleDateString(lang, { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    <Link href={`/${lang}/news/${item.id}`}>
                      <h3 className="text-xl font-black text-foreground line-clamp-2 hover:text-theme-500 transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-theme-muted text-sm line-clamp-4 leading-relaxed flex-1">
                      {item.content}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </FadeInSection>
        ))
      ) : (
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-foreground opacity-80 border-l-4 border-theme-500 pl-4">
            {dict.Latest_News}
          </h2>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-theme-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : news.length === 0 ? (
            <p className="text-center text-theme-muted py-10">{dict.No_News}</p>
          ) : (
            <div className="grid gap-10">
              {news.map((item, idx) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative bg-theme-surface/30 rounded-3xl border border-theme-border overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                  <Link href={`/${lang}/news/${item.id}`} className="block">
                    {item.image && (
                      <div className="relative w-full h-64 md:h-96 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-theme-bg via-transparent to-transparent opacity-60" />
                      </div>
                    )}
                  </Link>
                  
                  <div className="p-5 md:p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-theme-border">
                          {item.author.avatarUrl ? (
                            <Image
                              src={item.author.avatarUrl}
                              alt={item.author.name || 'Author'}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-theme-surface-strong flex items-center justify-center text-theme-muted">
                              <User size={16} />
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-bold text-theme-500">{item.author.name || 'Admin'}</span>
                        <span className="text-xs text-theme-muted">•</span>
                        <span className="text-xs text-theme-muted">
                          {new Date(item.createdAt).toLocaleDateString(lang, { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>

                      {isAdminState && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-theme-muted hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                          title={dict.Delete}
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                    
                    <Link href={`/${lang}/news/${item.id}`}>
                      <h3 className="text-2xl md:text-3xl font-black text-foreground group-hover:text-theme-500 transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                    
                    <p className="text-theme-muted leading-relaxed whitespace-pre-wrap line-clamp-6">
                      {item.content}
                    </p>

                    <Link 
                      href={`/${lang}/news/${item.id}`}
                      className="inline-flex items-center gap-2 text-theme-500 font-bold hover:gap-3 transition-all"
                    >
                      {dict.Read_More || 'Read More'}
                      <Plus size={18} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
