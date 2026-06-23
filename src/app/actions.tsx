"use server";

import { cookies, headers } from 'next/headers';
import { unstable_cache, revalidateTag } from 'next/cache';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { users, feedbacks, news } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';
import { createClient, createAdminClient } from '@/utils/supabase/server';
import { AppError } from '@/lib/errors';

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

  if (!user) return AppError.unauthorized('Require_Login').toJSON();

  const file = formData.get('file') as File;
  if (!file) return new AppError('APP_ERROR', 400, 'No file provided' ).toJSON();

  // Validate size (5MB)
  if (file.size > 5 * 1024 * 1024) return new AppError('APP_ERROR', 400, 'File too large (max 5MB)' ).toJSON();
  
  // Validate type
  if (!file.type.startsWith('image/')) return new AppError('APP_ERROR', 400, 'Invalid file type (images only)' ).toJSON();

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  try {
    // Convert to ArrayBuffer for better compatibility in server actions
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Use Admin Client to bypass RLS for uploads
    const adminSupabase = await createAdminClient();
    const { data, error } = await adminSupabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
        console.error(`Supabase storage error [${bucket}]:`, error);
        return new AppError('APP_ERROR', 400, `Upload failed: ${error.message}`).toJSON();
    }

    const { data: { publicUrl } } = adminSupabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Upload exception:', error);
    return new AppError('APP_ERROR', 400, 'Upload failed' ).toJSON();
  }
}

export async function updateProfile(data: { name?: string; username?: string; avatarUrl?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return AppError.unauthorized('Require_Login').toJSON();

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

    // 2. Persist to DB
    try {
      await db.insert(users).values({
        id: user.id,
        email: user.email!,
        name: data.name || null,
        username: data.username || null,
        avatarUrl: data.avatarUrl || null,
      }).onConflictDoUpdate({
        target: users.id,
        set: {
          name: data.name || null,
          username: data.username || null,
          avatarUrl: data.avatarUrl || null,
          updatedAt: new Date(),
        }
      });
    } catch (dbError) {
      console.error('Error syncing profile to DB:', dbError);
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return new AppError('APP_ERROR', 400, 'Profile_Update_Error' ).toJSON();
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

const fetchFeedbacksFromDb = unstable_cache(
  async () => {
    return await db.query.feedbacks.findMany({
      where: (feedbacks, { eq }) => eq(feedbacks.isPublic, true),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true
          }
        }
      },
      orderBy: (feedbacks, { desc }) => [desc(feedbacks.createdAt)]
    });
  },
  ['feedbacks'],
  { revalidate: 60, tags: ['feedbacks'] }
);

export const getFeedbacks = async () => {
  try {
    return await fetchFeedbacksFromDb();
  } catch (error) {
    console.error('Error in getFeedbacks:', error);
    return [];
  }
};

export async function deleteFeedback(feedbackId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return AppError.unauthorized('Require_Login').toJSON();

  try {
    const feedback = await db.query.feedbacks.findFirst({
      where: (feedbacks, { eq }) => eq(feedbacks.id, feedbackId)
    });

    if (!feedback) return AppError.notFound('Not_Found').toJSON();
    if (feedback.userId !== user.id) return AppError.forbidden('Unauthorized').toJSON();

    await db.delete(feedbacks).where(eq(feedbacks.id, feedbackId));

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting feedback:', error);
    return new AppError('APP_ERROR', 500, `Feedback deletion failed: ${message}`).toJSON();
  }
}

async function verifyRecaptcha(token: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY is missing in environment variables");
    return true; // Bypassed if not configured
  }

  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
    { method: 'POST' }
  );

  const data = await response.json();
  // v3 returns a score (0.0 - 1.0). 0.5 is the recommended default threshold.
  return data.success && data.score >= 0.5;
}

export async function submitFeedback(content: string, image?: string, captchaToken?: string) {
  if (!captchaToken) {
    return AppError.badRequest('Captcha_Required').toJSON();
  }
  const isCaptchaValid = await verifyRecaptcha(captchaToken);
  if (!isCaptchaValid) {
    return AppError.badRequest('Invalid_Captcha').toJSON();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return AppError.unauthorized('Require_Login').toJSON();

  try {
    // 1. Ensure user exists in DB
    await db.insert(users).values({
      id: user.id,
      email: user.email!,
      username: user.user_metadata?.username || null,
      name: user.user_metadata?.full_name || null,
      avatarUrl: user.user_metadata?.avatar_url || null,
    }).onConflictDoUpdate({
      target: users.id,
      set: {
        email: user.email!,
        updatedAt: new Date(),
      }
    });

    // 2. Check comment limit (max 2 per user)
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(feedbacks).where(eq(feedbacks.userId, user.id));
    const feedbackCount = Number(result?.count || 0);

    if (feedbackCount >= 2) {
      return new AppError('APP_ERROR', 400, 'Feedback_Limit_Reached' ).toJSON();
    }

    // 3. Create feedback
    await db.insert(feedbacks).values({
      id: crypto.randomUUID(),
      content,
      image: image || null,
      userId: user.id,
      isPublic: true,
    });

    // Invalidate the feedbacks cache so new feedback appears immediately
    revalidateTag('feedbacks');

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error submitting feedback:', error);
    return new AppError('APP_ERROR', 500, `Feedback submission failed: ${message}`).toJSON();
  }
}

const fetchNewsFromDb = unstable_cache(
  async () => {
    return await db.query.news.findMany({
      where: (news, { eq }) => eq(news.isPublic, true),
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      },
      orderBy: (news, { desc }) => [desc(news.createdAt)]
    });
  },
  ['news'],
  { revalidate: 30, tags: ['news'] }
);

export const getNews = async () => {
  try {
    return await fetchNewsFromDb();
  } catch (error) {
    console.error('Error in getNews:', error);
    return [];
  }
};

export const getNewsItem = async (id: string) => {
  try {
    const cachedFn = unstable_cache(
      async (newsId: string) => {
        return await db.query.news.findFirst({
          where: (news, { eq }) => eq(news.id, newsId),
          with: {
            author: {
              columns: {
                id: true,
                name: true,
                avatarUrl: true
              }
            }
          }
        });
      },
      [`news-${id}`],
      { revalidate: 30, tags: ['news', `news-${id}`] }
    );
    return await cachedFn(id);
  } catch (error) {
    console.error('Error in getNewsItem:', error);
    return null;
  }
};

export async function deleteNews(newsId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return AppError.unauthorized('Require_Login').toJSON();
  
  const dbUser = await db.query.users.findFirst({ where: (users, { eq }) => eq(users.id, user.id) });
  if (!dbUser || dbUser.role !== 'ADMIN') return AppError.forbidden('Unauthorized_Admin').toJSON();


  try {
    await db.delete(news).where(eq(news.id, newsId));

    // Invalidate the news cache so deletion appears immediately
    revalidateTag('news');

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting news:', error);
    return new AppError('APP_ERROR', 500, `News deletion failed: ${message}`).toJSON();
  }
}

export async function postNews(title: string, content: string, image?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return AppError.unauthorized('Require_Login').toJSON();
  
  const dbUser = await db.query.users.findFirst({ where: (users, { eq }) => eq(users.id, user.id) });
  if (!dbUser || dbUser.role !== 'ADMIN') return AppError.forbidden('Unauthorized_Admin').toJSON();


  try {
    // Ensure user is synced to DB
    try {
      await db.insert(users).values({
        id: user.id,
        email: user.email!,
        username: user.user_metadata?.username || null,
        name: user.user_metadata?.full_name || null,
        avatarUrl: user.user_metadata?.avatar_url || null,
      }).onConflictDoUpdate({
        target: users.id,
        set: {
          email: user.email!,
          updatedAt: new Date(),
        }
      });
    } catch (pe) {
      console.error('DB sync failed during postNews:', pe);
      throw pe; // Re-throw to be caught by the outer catch
    }

    await db.insert(news).values({
      id: crypto.randomUUID(),
      title,
      content,
      image: image || null,
      authorId: user.id,
      isPublic: true,
    });

    // Invalidate the news cache so newly posted news appears immediately
    revalidateTag('news');

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error posting news:', error);
    return new AppError('APP_ERROR', 500, `News posting failed: ${message}`).toJSON();
  }
}
