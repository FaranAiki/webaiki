"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Camera, Save, AlertCircle, CheckCircle2, UserCircle } from 'lucide-react';
import { updateProfile, uploadFile } from '@/app/actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getErrorMessage } from '@/lib/errors';

interface EditProfileFormProps {
  dict: Record<string, string>;
  user: {
    email?: string;
    user_metadata?: {
      full_name?: string;
      username?: string;
      avatar_url?: string;
    };
  };
}

export default function EditProfileForm({ dict, user }: EditProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState(user.user_metadata?.full_name || '');
  const [username, setUsername] = useState(user.user_metadata?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(user.user_metadata?.avatar_url || '');
  const [uploading, setUploading] = useState(false);
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

    const result = await uploadFile(formData, 'user-icon');

    if (result.success) {
      setAvatarUrl(result.url!);
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
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await updateProfile({
      name,
      username,
      avatarUrl
    });

    if (result.success) {
      setSuccess(true);
      router.refresh();
    } else {
      setError(getErrorMessage(result.error, dict));
    }
    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto space-y-8"
    >
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-4xl font-black nav-active-gacor tracking-tighter flex items-center gap-4">
          <UserCircle size={40} className="text-theme-500" />
          {dict.Edit_Profile}
        </h1>
        <p className="text-theme-muted font-medium ml-1">
          {user.email}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-[1fr_2fr] gap-8">
        {/* Profile Preview */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="relative group mx-auto w-48 h-48">
            <div className={`absolute -inset-2 bg-gradient-to-r from-theme-500 to-gacor rounded-full blur transition duration-500 ${isDragging ? 'opacity-80 scale-105 animate-pulse' : 'opacity-20 group-hover:opacity-40'}`} />
            <label 
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative block w-full h-full rounded-full overflow-hidden border-4 shadow-2xl bg-theme-surface-strong cursor-pointer transition-all duration-300 ${isDragging ? 'border-theme-500 scale-105' : 'border-theme-surface'}`}
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={name || 'User'}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-theme-muted">
                  <User size={80} />
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="text-white mb-2" size={32} />
                <span className="text-white text-sm font-bold tracking-widest">{dict.Change}</span>
              </div>

              {/* Drag & Drop Overlay */}
              {isDragging && (
                <div className="absolute inset-0 bg-theme-500/20 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none">
                  <Camera className="text-theme-500 animate-bounce mb-2" size={32} />
                  <span className="text-theme-500 text-xs font-bold tracking-widest text-center px-2">
                    {dict.Drop_Here || "Drop here"}
                  </span>
                </div>
              )}

              {uploading && (
                <div className="absolute inset-0 bg-theme-bg/80 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-theme-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-bold text-theme-500 tracking-tighter animate-pulse">{dict.Uploading}</span>
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          </div>
          <p className="text-center text-xs text-theme-muted font-bold tracking-widest">
            {dict.Click_To_Upload}
          </p>
        </motion.div>

        {/* Edit Form */}
        <div className="p-8 bg-theme-surface/90 backdrop-blur-xl rounded-3xl border border-theme-border shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-theme-muted ml-1">
                <User size={14} />
                {dict.Full_Name}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 focus:ring-4 focus:ring-theme-500/10 outline-none transition-all duration-300"
                placeholder={dict.Your_Name_Placeholder}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-theme-muted ml-1">
                <Mail size={14} />
                {dict.Username}
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 focus:ring-4 focus:ring-theme-500/10 outline-none transition-all duration-300"
                placeholder={dict.Username_Placeholder}
              />
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 text-red-500 text-sm font-medium bg-red-500/10 p-3 rounded-xl border border-red-500/20"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 text-green-500 text-sm font-medium bg-green-500/10 p-3 rounded-xl border border-green-500/20"
              >
                <CheckCircle2 size={16} />
                {dict.Profile_Updated}
              </motion.div>
            )}

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="group relative w-full py-4 rounded-xl bg-theme-500 text-white font-black tracking-wide overflow-hidden transition-all hover:bg-theme-400 disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    {dict.Update_Profile}
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
