// force use server
"use server";

import { cookies } from 'next/headers';
import "./globals.css";

// TODO implement this (?)
const cookie_default : { [key: string]: string } = {
  'language': 'id',
  'theme': 'dark'
};

export async function initializeCookies() {
  const cookieStore = await cookies();
  for (const item in cookie_default) {
    if (!(item in cookieStore)) {
      cookieStore.set(item, cookie_default[item], {
        httpOnly: true, // cookies inaccessible to client-side JavaScript for safety measure
        secure: process.env.NODE_ENV === 'production', // if production, make it secure, otherwise just ignore it (false)
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
