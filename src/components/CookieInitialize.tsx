'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { initializeCookies, setCookies } from '@/app/actions';

export function CookieInitializer() {
  const params = useParams();
  const lang = params?.lang as string;

  useEffect(() => {
    initializeCookies();
  }, []);

  useEffect(() => {
    if (lang) {
      // Get cookie value
      const cookies = document.cookie.split('; ').reduce((acc: Record<string, string>, current) => {
        const [name, value] = current.split('=');
        acc[name] = value;
        return acc;
      }, {});

      if (cookies['language'] !== lang) {
        setCookies('language', lang);
      }
    }
  }, [lang]);

  return null;
}
