'use client';

import { useEffect } from 'react';
import { useParams, useSearchParams, useRouter, usePathname } from 'next/navigation';
import { initializeCookies, setCookies } from '@/app/actions';

export function CookieInitializer() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const lang = params?.lang as string;

  useEffect(() => {
    initializeCookies();
  }, []);

  useEffect(() => {
    // 1. Handle Language sync
    if (lang) {
      const cookies = document.cookie.split('; ').reduce((acc: Record<string, string>, current) => {
        const [name, value] = current.split('=');
        if (name && value) acc[name.trim()] = value;
        return acc;
      }, {});

      if (cookies['language'] !== lang) {
        setCookies('language', lang);
      }

      // 2. Handle Settings sync from cookies (set by middleware from URL params)
      const settingsParams = [
        'presentation_mode',
        'presentation_slide_format',
        'settings-font',
        'settings-align',
        'settings-scale',
        'settings-spacing',
        'settings-lineheight'
      ];

      let hasSettingsInUrl = false;
      settingsParams.forEach(param => {
        if (searchParams.get(param) !== null) {
          hasSettingsInUrl = true;
        }
        
        // Ensure settings are synced to localStorage if cookie exists
        if (cookies[param]) {
          const value = decodeURIComponent(cookies[param]);
          localStorage.setItem(param, value);
          // Delete cookie
          document.cookie = `${param}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });

      // 3. Clean up URL parameters after they've been processed by middleware/cookies
      if (hasSettingsInUrl) {
        const newParams = new URLSearchParams(searchParams.toString());
        settingsParams.forEach(p => newParams.delete(p));
        const query = newParams.toString();
        const newUrl = `${pathname}${query ? `?${query}` : ''}`;
        
        // Use replace to clean URL without adding to history
        window.history.replaceState(null, '', newUrl);
      }
    }
  }, [lang, searchParams, pathname]);

  return null;
}
