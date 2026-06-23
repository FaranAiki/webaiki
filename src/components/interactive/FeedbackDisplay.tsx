"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User, Camera, Trash2, AlertCircle } from 'lucide-react';
import { getFeedbacks, submitFeedback, uploadFile, deleteFeedback } from '@/app/actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePresentation } from '../providers/PresentationContext';
import FadeInSection from '../shared/FadeInSection';
import { executeCaptcha } from './CaptchaValidator';
import RecaptchaNotice from '../shared/RecaptchaNotice';
import { getErrorMessage } from '@/lib/errors';

interface FeedbackItem {
  id: string;
  content: string;
  image: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    avatarUrl: string | null;
  };
}

interface FeedbackDisplayProps {
  dict: Record<string, string>;
  lang: string;
  currentUserId: string | null;
}

export default function FeedbackDisplay({ dict, lang, currentUserId }: FeedbackDisplayProps) {
  const router = useRouter();
  const { isPresentationMode } = usePresentation();
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const feedbackChunks = useMemo(() => {
    if (!isPresentationMode) return [];
    const chunks = [];
    for (let i = 0; i < feedbacks.length; i += 2) {
      chunks.push(feedbacks.slice(i, i + 2));
    }
    return chunks;
  }, [feedbacks, isPresentationMode]);
  const [submitting, setSubmitting] = useState(false);
  const [newFeedback, setNewFeedback] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await getFeedbacks();
      setFeedbacks(data as unknown as FeedbackItem[]);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(dict.Delete + '?')) return;

    try {
      const result = await deleteFeedback(id);
      if (result.success) {
        setFeedbacks(feedbacks.filter(f => f.id !== id));
        router.refresh();
      } else {
        alert(getErrorMessage(result.error, dict));
      }
    } catch (err) {
      console.error('Error deleting feedback:', err);
    }
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadImageFile(file);
  };

  const uploadImageFile = async (file: File) => {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadFile(formData, 'feedback-image');

    if (result.success) {
      setImageUrl(result.url!);
    } else {
      setError(getErrorMessage(result.error, dict));
    }
    setUploading(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    await uploadImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedback.trim()) return;

    setSubmitting(true);
    setError(null);

    const token = await executeCaptcha('feedback');
    if (!token) {
      setError(dict.Invalid_Captcha || "Captcha verification failed");
      setSubmitting(false);
      return;
    }

    const result = await submitFeedback(newFeedback, imageUrl, token);

    if (result.success) {
      setNewFeedback('');
      setImageUrl(undefined);
      fetchFeedbacks();
      router.refresh();
    } else {
      setError(getErrorMessage(result.error, dict));
    }
    setSubmitting(false);
  };

  return (
    <div className={`${isPresentationMode ? 'presentation-container' : 'max-w-4xl mx-auto space-y-12 pb-20'}`}>
      {!isPresentationMode && (
        <section className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-black nav-active-gacor flex items-center gap-4">
            <MessageSquare size={40} className="text-theme-500" />
            {dict.Feedback}
          </h1>

          {!currentUserId ? (
            <div className="p-8 bg-theme-surface border border-theme-border rounded-2xl shadow-sm flex flex-col items-center text-center gap-4">
              <div className="p-3 rounded-full bg-theme-500/10 text-theme-500">
                <User size={32} />
              </div>
              <p className="text-theme-muted font-bold max-w-md leading-relaxed">
                {dict.Require_Login || "You must be logged in to post feedback."}
              </p>
              <Link 
                href={`/${lang}/login?next=/${lang}/feedback`}
                className="px-8 py-3 rounded-xl bg-theme-500 text-white font-bold hover:bg-theme-400 transition-all hover:scale-105"
              >
                {dict.Login || "Login"}
              </Link>
            </div>
          ) : feedbacks.filter(f => f.user.id === currentUserId).length >= 2 ? (
            <div className="p-8 bg-theme-surface border border-theme-border rounded-2xl shadow-sm flex flex-col items-center text-center gap-4">
              <div className="p-3 rounded-full bg-theme-500/10 text-theme-500">
                <AlertCircle size={32} />
              </div>
              <p className="text-theme-muted font-bold max-w-md leading-relaxed">
                {dict.Feedback_Limit_Reached || "Feedback limit reached (maximum 2 per user). Please delete one of your comments to write a new one."}
              </p>
            </div>
          ) : (
            <div 
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative p-6 bg-theme-surface rounded-2xl border transition-all duration-300 shadow-theme-shadow ${
                isDragging ? 'border-dashed border-theme-500 scale-[1.01] bg-theme-surface-strong/50' : 'border-theme-border'
              }`}
            >
              <AnimatePresence>
                {isDragging && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-theme-bg/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-50 pointer-events-none"
                  >
                    <div className="flex flex-col items-center gap-2 animate-bounce">
                      <Camera size={36} className="text-theme-500" />
                      <span className="text-sm font-black text-theme-500 tracking-wider">
                        {dict.Drop_Here || "Drop Your Image Here"}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-theme-muted mb-2">{dict.Add_Feedback}</label>
                  <textarea
                    value={newFeedback}
                    onChange={(e) => setNewFeedback(e.target.value)}
                    placeholder={dict.Content}
                    className="w-full h-32 px-4 py-3 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 outline-none transition-all resize-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-theme-surface-strong border border-theme-border hover:border-theme-500 cursor-pointer transition-all">
                        {uploading ? (
                          <div className="w-5 h-5 border-2 border-theme-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Camera size={18} className="text-theme-muted" />
                        )}
                        <span className="text-xs font-bold text-theme-muted">{dict.Image || 'Image'}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                      </label>
                      {imageUrl && (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-theme-border">
                          <Image src={imageUrl} alt="Feedback" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

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

                <RecaptchaNotice dict={dict} className="mt-2" />

                {error && (
                  <p className="text-red-500 text-sm font-medium animate-shake">
                    {error}
                  </p>
                )}
              </form>
            </div>
          )}
        </section>
      )}

      {isPresentationMode ? (
        feedbackChunks.map((chunk, slideIdx) => (
          <FadeInSection
            key={`slide-${slideIdx}`}
            className="w-full h-full flex items-center justify-center p-8"
            slideIndex={slideIdx + 1}
            totalSlides={feedbackChunks.length}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto w-full">
              {chunk.map((item) => (
                <div
                  key={item.id}
                  className="p-8 bg-theme-surface border border-theme-border rounded-3xl shadow-xl space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-theme-border">
                      {item.user.avatarUrl ? (
                        <Image
                          src={item.user.avatarUrl}
                          alt={item.user.name || 'User'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-theme-surface-strong flex items-center justify-center text-theme-muted">
                          <User size={32} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{item.user.name || 'Anonymous'}</h3>
                      <p className="text-theme-muted text-sm">
                        {new Date(item.createdAt).toLocaleDateString(lang, {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-theme-muted text-lg leading-relaxed italic">
                    &quot;{item.content}&quot;
                  </p>
                  {item.image && (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-theme-border">
                      <Image src={item.image} alt="Feedback" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </FadeInSection>
        ))
      ) : (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground opacity-80 border-l-4 border-theme-500 pl-4">
            {dict.Latest} {dict.Feedback}
          </h2>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-theme-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : feedbacks.length === 0 ? (
            <p className="text-center text-theme-muted py-10">{dict.No_Feedback}</p>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence mode="popLayout">
                {feedbacks.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group p-6 bg-theme-surface/50 hover:bg-theme-surface-strong/50 rounded-2xl border border-theme-border transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-theme-border shadow-sm flex-shrink-0">
                        {item.user.avatarUrl ? (
                          <Image
                            src={item.user.avatarUrl}
                            alt={item.user.name || 'User'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-theme-surface-strong flex items-center justify-center text-theme-muted">
                            <User size={24} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground">
                                {item.user.name || 'Anonymous'}
                              </span>
                              {item.user.username && (
                                <span className="text-xs text-theme-muted font-medium">
                                  @{item.user.username}
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-theme-muted tracking-widest font-bold">
                              {new Date(item.createdAt).toLocaleDateString(lang, {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>

                          {item.user.id === currentUserId && (
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-theme-muted hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                              title={dict.Delete}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        <p className="text-theme-muted leading-relaxed whitespace-pre-wrap">
                          {item.content}
                        </p>

                        {item.image && (
                          <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden border border-theme-border mt-4">
                            <Image src={item.image} alt="Feedback" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
