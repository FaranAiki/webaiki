'use client';

import { useEffect } from 'react';
import { useParams, useSearchParams, usePathname } from 'next/navigation';
import { initializeCookies, setCookies } from '@/app/actions';
import { useTheme } from 'next-themes';

export function CookieInitializer() {
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const lang = params?.lang as string;
  const { setTheme } = useTheme();

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
        'theme',
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

          if (param === 'theme') {
            setTheme(value);
          } else {
            localStorage.setItem(param, value);
          }

          // Delete cookie
          document.cookie = `${param}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });

      // 3. Clean URL if parameters were processed
      if (hasSettingsInUrl) {
        const query = new URLSearchParams(searchParams.toString());
        settingsParams.forEach(param => query.delete(param));

        const newUrl = `${pathname}${query.toString() ? `?${query.toString()}` : ''}`;

        // Use replace to clean URL without adding to history
        window.history.replaceState(null, '', newUrl);
      }
    }
  }, [lang, searchParams, pathname, setTheme]);

  return null;
}
