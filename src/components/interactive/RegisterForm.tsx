'use client';

import { useState } from 'react';
import { useAuthActions } from '@/app/auth-hooks';
import Link from 'next/link';
import { m as motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { executeCaptcha } from './CaptchaValidator';
import RecaptchaNotice from '../shared/RecaptchaNotice';
import { getErrorMessage } from '@/lib/errors';
import OAuthButtons from './OAuthButtons';

interface RegisterFormProps {
  dict: Record<string, string>;
  lang: string;
}

export default function RegisterForm({ dict, lang }: RegisterFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuthActions(lang);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setError(null);
    setLoading(true);

    const token = await executeCaptcha('register');
    if (!token) {
      setError(dict.Invalid_Captcha || "Captcha verification failed");
      setLoading(false);
      return;
    }

    const formData = new FormData(form);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError(dict.Passwords_do_not_match);
      setLoading(false);
      return;
    }

    const result = await signUp(formData, token);

    if (result?.error) {
      setError(getErrorMessage(result.error, dict));
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const }
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto mt-10 p-10 bg-theme-surface rounded-3xl border border-theme-border shadow-2xl text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="p-4 bg-green-500/10 rounded-full">
            <CheckCircle2 className="text-green-500" size={48} />
          </div>
        </div>
        <h2 className="text-2xl font-black text-foreground tracking-tight">{dict.Register_Success}</h2>
        <Link
          href={`/${lang}/login`}
          className="inline-block px-8 py-3 rounded-xl bg-theme-500 text-white font-bold hover:bg-theme-400 transition-all hover:scale-105"
        >
          {dict.Login}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative max-w-md mx-auto mt-10"
    >
      <div className="absolute -inset-1 bg-gradient-to-tr from-gacor via-theme-500 to-gacor-500 rounded-3xl blur-xl opacity-10 animate-pulse" />

      <div className="relative p-8 bg-theme-surface/90 backdrop-blur-xl rounded-2xl border border-theme-border shadow-2xl overflow-hidden">
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-theme-500/10 rounded-xl">
            <UserPlus className="text-theme-500" size={24} />
          </div>
          <h1 className="text-3xl font-black nav-active-gacor tracking-tighter">{dict.Register}</h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div variants={itemVariants} className="space-y-1.5">
            <label htmlFor="register-username" className="flex items-center gap-2 text-sm font-bold text-theme-muted ml-1">
              <User size={14} />
              {dict.Username}
            </label>
            <input
              id="register-username"
              name="username"
              type="text"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 focus:ring-4 focus:ring-theme-500/10 outline-none transition-all duration-300"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1.5">
            <label htmlFor="register-email" className="flex items-center gap-2 text-sm font-bold text-theme-muted ml-1">
              <Mail size={14} />
              {dict.Email}
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 focus:ring-4 focus:ring-theme-500/10 outline-none transition-all duration-300"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1.5">
            <label htmlFor="register-reason" className="flex items-center gap-2 text-sm font-bold text-theme-muted ml-1">
              <Info size={14} />
              {dict.Registration_Reason}
            </label>
            <div className="relative">
              <select
                id="register-reason"
                name="reason"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 focus:ring-4 focus:ring-theme-500/10 outline-none transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="VISITOR">{dict.Visitor}</option>
                <option value="HR">{dict.HR}</option>
                <option value="COMMENTING">{dict.Commenting}</option>
                <option value="OTHER">{dict.Other}</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-theme-muted opacity-50">
                <motion.div animate={{ y: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 2 }}>↓</motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1.5">
            <label htmlFor="register-password" className="flex items-center gap-2 text-sm font-bold text-theme-muted ml-1">
              <Lock size={14} />
              {dict.Password}
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 focus:ring-4 focus:ring-theme-500/10 outline-none transition-all duration-300"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-1.5">
            <label htmlFor="register-confirm-password" className="flex items-center gap-2 text-sm font-bold text-theme-muted ml-1">
              <Lock size={14} />
              {dict.Confirm_Password}
            </label>
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 focus:ring-4 focus:ring-theme-500/10 outline-none transition-all duration-300"
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
            className="group relative w-full py-4 rounded-xl bg-theme-500 text-white font-black tracking-wide overflow-hidden transition-all hover:bg-theme-400 disabled:opacity-50 mt-4"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : dict.Register}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
          </motion.button>

          <RecaptchaNotice dict={dict} className="mt-2" />
        </form>

        <motion.div variants={itemVariants}>
          <OAuthButtons dict={dict} lang={lang} />
        </motion.div>

        <motion.p variants={itemVariants} className="mt-8 text-center text-sm text-theme-muted font-medium">
          {dict.Already_have_account}{' '}
          <Link href={`/${lang}/login`} className="text-theme-500 hover:text-theme-400 font-bold transition-colors underline-offset-4 hover:underline">
            {dict.Login}
          </Link>
        </motion.p>
      </div>
    </motion.div>
  );
}
