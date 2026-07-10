'use client';

import { useState } from 'react';
import { Github, Mail } from 'lucide-react';
import type { Provider } from '@supabase/supabase-js';

interface OAuthButtonsProps {
  dict: import('@/components/layout/Translator').TranslationDict;
  lang: string;
}

export default function OAuthButtons({ dict, lang }: OAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);

  const handleOAuth = async (provider: Provider) => {
    try {
      setLoadingProvider(provider);
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=/${lang}/all`,
        },
      });

      if (error) {
        console.error("Supabase OAuth Error:", error);
        alert(`Gagal login: ${error.message}`);
        setLoadingProvider(null);
      }
    } catch (err: unknown) {
      console.error("Fatal OAuth Error:", err);
      const errorMessage = err instanceof Error ? err.message : 'Gagal memuat client Supabase';
      alert(`Terjadi kesalahan sistem: ${errorMessage}`);
      setLoadingProvider(null);
    }
  };

  const providers: { id: Provider; icon: React.ReactNode; color: string; label: string }[] = [
    { id: 'google', icon: <Mail size={18} />, color: 'hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50', label: 'Google' },
    { id: 'github', icon: <Github size={18} />, color: 'hover:bg-neutral-500/10 hover:text-neutral-500 hover:border-neutral-500/50', label: 'GitHub' },
    // { id: 'twitter', icon: <Twitter size={18} />, color: 'hover:bg-sky-400/10 hover:text-sky-400 hover:border-sky-400/50', label: 'Twitter' },
    // { id: 'linkedin_oidc', icon: <Linkedin size={18} />, color: 'hover:bg-blue-600/10 hover:text-blue-600 hover:border-blue-600/50', label: 'LinkedIn' },
  ];

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--card-border)]" />
        </div>
        <div className="relative flex justify-center text-sm font-medium">
          <span className="px-2 text-[var(--text-muted)] text-xs tracking-widest">
            {dict.Or_Continue_With || "Or Continue With"}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => handleOAuth(provider.id)}
            disabled={loadingProvider !== null}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-[var(--text-muted)] transition-all ${provider.color} disabled:opacity-50 group`}
          >
            {loadingProvider === provider.id ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-theme-500 border-t-transparent" />
            ) : (
              <div className="transition-transform group-hover:scale-110">
                {provider.icon}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
