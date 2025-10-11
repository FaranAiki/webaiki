// force use server
"use server";

import { cookies } from 'next/headers';
import "./globals.css";

const cookie_default : { [key: string]: string } = {
  'language': 'id',
  'theme': 'dark'
};

export async function initializeCookies() {
  const cookieStore = await cookies();
  for (const item in cookie_default) {
    if (!(item in cookieStore)) {
      cookieStore.set(item, cookie_default[item], {
        httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS
        path: '/',
      });
    }
  } 
};

export async function setCookies(name: string, val: string) {
  const cookieStore = await cookies();
  cookieStore.set(name, val, {
    httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS
    path: '/',
  });
}
