'use client';

import { useState } from 'react';
import { useAuthActions } from '@/app/auth-hooks';
import Link from 'next/link';

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
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError(dict.Passwords_do_not_match);
      return;
    }

    setLoading(true);
    const result = await signUp(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-theme-surface rounded-2xl border border-theme-border shadow-theme-shadow text-center">
        <h2 className="text-xl font-bold text-theme-500 mb-4">{dict.Register_Success}</h2>
        <Link href={`/${lang}/login`} className="text-theme-500 hover:underline">
          {dict.Login}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-theme-surface rounded-2xl border border-theme-border shadow-theme-shadow">
      <h1 className="text-2xl font-bold mb-6 nav-active-gacor">{dict.Register}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-theme-muted mb-1">{dict.Username}</label>
          <input
            name="username"
            type="text"
            required
            className="w-full px-4 py-2 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-theme-muted mb-1">{dict.Email}</label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-2 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-theme-muted mb-1">{dict.Registration_Reason}</label>
          <select
            name="reason"
            required
            className="w-full px-4 py-2 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 outline-none transition-colors appearance-none"
          >
            <option value="VISITOR">{dict.Visitor}</option>
            <option value="HR">{dict.HR}</option>
            <option value="COMMENTING">{dict.Commenting}</option>
            <option value="OTHER">{dict.Other}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-theme-muted mb-1">{dict.Password}</label>
          <input
            name="password"
            type="password"
            required
            className="w-full px-4 py-2 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-theme-muted mb-1">{dict.Confirm_Password}</label>
          <input
            name="confirmPassword"
            type="password"
            required
            className="w-full px-4 py-2 rounded-xl bg-theme-surface-strong border border-theme-border focus:border-theme-500 outline-none transition-colors"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-theme-500 text-white font-bold hover:bg-theme-400 transition-colors disabled:opacity-50"
        >
          {loading ? dict.Waiting : dict.Register}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-theme-muted">
        {dict.Already_have_account}{' '}
        <Link href={`/${lang}/login`} className="text-theme-500 hover:underline">
          {dict.Login}
        </Link>
      </p>
    </div>
  );
}
