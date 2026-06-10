'use client';

import { useState } from 'react';
import { useAuthActions } from '@/app/auth-hooks';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  dict: Record<string, string>;
  lang: string;
}

export default function LoginForm({ dict, lang }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthActions(lang);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signIn(formData);

    if (result?.error) {
      setError(dict[result.error] || result.error);
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
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
      className="relative max-w-md mx-auto mt-10"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-theme-500 to-gacor rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse" />
      
      <div className="relative p-8 bg-theme-surface/90 backdrop-blur-xl rounded-2xl border border-theme-border shadow-2xl overflow-hidden">
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-theme-500/10 rounded-xl">
            <LogIn className="text-theme-500" size={24} />
          </div>
          <h1 className="text-3xl font-black nav-active-gacor tracking-tighter">{dict.Login}</h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-theme-muted ml-1">
              <Mail size={14} />
              {dict.Email}
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 focus:ring-4 focus:ring-theme-500/10 outline-none transition-all duration-300 placeholder:text-theme-muted/50"
              placeholder="example@mail.com"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-theme-muted ml-1">
              <Lock size={14} />
              {dict.Password}
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 focus:ring-4 focus:ring-theme-500/10 outline-none transition-all duration-300"
              placeholder="••••••••"
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
              ) : dict.Login}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
          </motion.button>
        </form>

        <motion.p variants={itemVariants} className="mt-8 text-center text-sm text-theme-muted font-medium">
          {dict.Don_t_have_account}{' '}
          <Link href={`/${lang}/register`} className="text-theme-500 hover:text-theme-400 font-bold transition-colors underline-offset-4 hover:underline">
            {dict.Register}
          </Link>
        </motion.p>
      </div>
    </motion.div>
  );
}
