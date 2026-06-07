'use client';

import { useState } from 'react';
import { useAuthActions } from '@/app/auth-hooks';
import Link from 'next/link';

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
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-theme-surface rounded-2xl border border-theme-border shadow-theme-shadow">
      <h1 className="text-2xl font-bold mb-6 nav-active-gacor">{dict.Login}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block text-sm font-medium text-theme-muted mb-1">{dict.Password}</label>
          <input
            name="password"
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
          {loading ? dict.Waiting : dict.Login}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-theme-muted">
        {dict.Don_t_have_account}{' '}
        <Link href={`/${lang}/register`} className="text-theme-500 hover:underline">
          {dict.Register}
        </Link>
      </p>
    </div>
  );
}
