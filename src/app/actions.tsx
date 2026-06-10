"use server";

import { cookies, headers } from 'next/headers';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';
import { createClient, createAdminClient } from '@/utils/supabase/server';

const cookie_default : { [key: string]: string } = {
  'theme': 'system' 
};

export async function initializeCookies() {
  const cookieStore = await cookies();
  
  for (const item in cookie_default) {
    if (!cookieStore.has(item)) {
      cookieStore.set(item, cookie_default[item], {
        httpOnly: false, 
        secure: process.env.NODE_ENV === 'production', 
        path: '/',
      });
    }
  } 

  if (!cookieStore.has('language')) {
    const headersList = await headers();
    const country = headersList.get('x-vercel-ip-country') || 'US';
    
    let selectedLanguage = 'en';

    const countryToLang: { [key: string]: string } = {
        'ID': 'id', // Indonesia
        'RU': 'ru', // Russia
        'CN': 'zh', // China
        'JP': 'jp', // Japan
        'FR': 'fr', // France
        'SA': 'ar', // Saudi Arabia
        'AE': 'ar', // UAE
        'EG': 'ar', // Egypt
    };

    const candidateLang = countryToLang[country] || country.toLowerCase();

    try {
      const localesDir = path.join(process.cwd(), 'public', 'locales');
      if (fs.existsSync(localesDir)) {
        const availableLocales = fs.readdirSync(localesDir)
          .filter(file => file.endsWith('.json'))
          .map(file => path.basename(file, '.json')); 

        if (availableLocales.includes(candidateLang)) {
          selectedLanguage = candidateLang;
        }
      }
    } catch (error) {
      console.error("Error reading locales directory:", error);
    }

    // Set the cookie
    cookieStore.set('language', selectedLanguage, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
  }
};

export async function uploadFile(formData: FormData, bucket: 'user-icon' | 'news-image' | 'feedback-image') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Require_Login' };

  const file = formData.get('file') as File;
  if (!file) return { error: 'No file provided' };

  // Validate size (5MB)
  if (file.size > 5 * 1024 * 1024) return { error: 'File too large (max 5MB)' };
  
  // Validate type
  if (!file.type.startsWith('image/')) return { error: 'Invalid file type (images only)' };

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  try {
    // Use Admin Client to bypass RLS for uploads
    const adminSupabase = await createAdminClient();
    const { data, error } = await adminSupabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
        console.error(`Supabase storage error [${bucket}]:`, error);
        return { error: `Upload failed: ${error.message}` };
    }

    const { data: { publicUrl } } = adminSupabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Upload exception:', error);
    return { error: 'Upload failed' };
  }
}

export async function updateProfile(data: { name?: string; username?: string; avatarUrl?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Require_Login' };

  try {
    // 1. Update Supabase Auth metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: data.name,
        username: data.username,
        avatar_url: data.avatarUrl,
      }
    });

    if (authError) throw authError;

    // 2. Persist to Prisma
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: data.name,
        username: data.username,
        avatarUrl: data.avatarUrl,
      },
      create: {
        id: user.id,
        email: user.email!,
        name: data.name,
        username: data.username,
        avatarUrl: data.avatarUrl,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { error: 'Profile_Update_Error' };
  }
}

export async function setCookies(name: string, val: string) {
  const cookieStore = await cookies();
  cookieStore.set(name, val, {
    httpOnly: false, // Allow client-side JS to read settings cookies
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS
    path: '/',
  });
}

export async function getFeedbacks() {
  return await prisma.feedback.findMany({
    where: { isPublic: true },
    include: {
      user: {
        select: {
          name: true,
          username: true,
          avatarUrl: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function submitFeedback(content: string, image?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Require_Login' };

  try {
    // Ensure user exists in Prisma DB before creating feedback
    await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email! },
      create: {
        id: user.id,
        email: user.email!,
        username: user.user_metadata?.username || null,
      },
    });

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Prisma Error submitting feedback:', error);
    return { error: `Feedback submission failed: ${message}` };
  }
}

export async function getNews() {
  return await prisma.news.findMany({
    where: { isPublic: true },
    include: {
      author: {
        select: {
          name: true,
          avatarUrl: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function postNews(title: string, content: string, image?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Require_Login' };

  try {
    // Ensure admin user is synced to Prisma
    const dbUser = await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email! },
      create: {
        id: user.id,
        email: user.email!,
        username: user.user_metadata?.username || null,
      },
    });

    if (dbUser?.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Prisma Error posting news:', error);
    return { error: `News posting failed: ${message}` };
  }
}
