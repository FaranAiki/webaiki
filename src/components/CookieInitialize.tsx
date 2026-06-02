'use client';

import { useEffect, useRef } from 'react';
import { useParams, useSearchParams, usePathname } from 'next/navigation';
import { initializeCookies, setCookies } from '@/app/actions';
import { useTheme } from 'next-themes';

export function CookieInitializer() {
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const lang = params?.lang as string;
  const { setTheme, theme } = useTheme();
  
  // Track parameters already processed to prevent loops
  const processedParams = useRef<Set<string>>(new Set());

  useEffect(() => {
    initializeCookies();
  }, []);

  // Sync theme to cookie on change so server knows it on next load
  useEffect(() => {
    if (theme) {
        document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [theme]);

  useEffect(() => {
    // 1. Handle Language sync
    if (lang) {
      const cookies = document.cookie.split('; ').reduce((acc: Record<string, string>, current) => {
        const [name, value] = current.split('=');
        if (name && value) acc[name.trim()] = value;
        return acc;
      }, {});

      if (cookies['language'] !== lang && !processedParams.current.has(`lang-${lang}`)) {
        setCookies('language', lang);
        processedParams.current.add(`lang-${lang}`);
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
        const urlValue = searchParams.get(param);
        if (urlValue !== null) {
          hasSettingsInUrl = true;
        }

        // Check for the "command" cookie OR direct URL param
        const cookieName = `__set_${param}`;
        const cookieValue = cookies[cookieName];
        const finalValue = urlValue || cookieValue;

        if (finalValue && !processedParams.current.has(`${param}-${finalValue}`)) {
          const value = decodeURIComponent(finalValue);

          if (param === 'theme') {
            // Give ThemeProvider a moment to settle if needed, though usually direct call is fine
            setTheme(value);
          } else {
            localStorage.setItem(param, value);
          }

          // Delete command cookie if it exists
          if (cookieValue) {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          }

          processedParams.current.add(`${param}-${finalValue}`);
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
