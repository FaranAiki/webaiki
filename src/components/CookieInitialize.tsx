'use client';

import { useEffect } from 'react';
import { initializeCookies } from '@/app/actions';

export function CookieInitializer() {
  useEffect(() => {
    console.log('Cookie Initializer is running in the browser...');
    initializeCookies();
  }, []);

  return null;
}
