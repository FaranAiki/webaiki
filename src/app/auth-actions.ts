'use server';
import { headers } from "next/headers";

import { Type } from '@sinclair/typebox';
import { db } from '@/lib/db';
import { users, RegistrationReason } from '@/lib/schema';
import { sql } from 'drizzle-orm';
import { createClient } from '@/utils/supabase/server';
import { validateData } from '@/lib/validation';
import { AppError } from '@/lib/errors';

// Schemas
const LoginSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
});

const RegisterSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
  username: Type.String({ minLength: 3 }),
  reason: Type.Enum(RegistrationReason),
});

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

export async function signInAction(formData: FormData) {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  // Validate with TypeBox
  const validation = validateData(LoginSchema, rawData);
  if (!validation.success) {
    return AppError.badRequest(validation.error  || 'Validation Error').toJSON();
  }

  const { email, password } = validation.data;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return new AppError('APP_ERROR', 400, 'Auth_Error' ).toJSON();
  }

  // Sync with Drizzle after successful login to ensure user exists in our DB
  if (data.user) {
    try {
      const metadata = data.user.user_metadata;
      await db.insert(users).values({
        id: data.user.id,
        email: data.user.email!,
        username: metadata.username || null,
        role: data.user.email === 'faran.aiki.business@gmail.com' ? 'ADMIN' : 'USER',
        registrationReason: metadata.registration_reason || 'VISITOR',
        updatedAt: sql`now()`,
        createdAt: sql`now()`,
      }).onConflictDoUpdate({
        target: users.id,
        set: {
          email: data.user.email!,
          username: metadata.username || null,
        role: data.user.email === 'faran.aiki.business@gmail.com' ? 'ADMIN' : 'USER',
          registrationReason: metadata.registration_reason || 'VISITOR',
          updatedAt: sql`now()`,
        }
      });
    } catch (dbError) {
      console.error('Error syncing user on sign in:', dbError);
      // We don't necessarily want to fail the login if sync fails, 
      // but it might cause issues later.
    }
  }

  return { success: true };
}

export async function signUpAction(formData: FormData, captchaToken?: string) {
  if (!captchaToken) {
    return AppError.badRequest('Captcha_Required').toJSON();
  }
  const isCaptchaValid = await verifyRecaptcha(captchaToken);
  if (!isCaptchaValid) {
    return AppError.badRequest('Invalid_Captcha').toJSON();
  }

  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    username: formData.get('username') as string,
    reason: formData.get('reason') as string,
  };

  // Validate with TypeBox
  const validation = validateData(RegisterSchema, rawData);
  if (!validation.success) {
    return AppError.badRequest(validation.error  || 'Validation Error').toJSON();
  }

  const { email, password, username, reason } = validation.data;

  // Improve redirectTo for Vercel environments
  const host = (await headers()).get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const redirectTo = `${protocol}://${host}/api/auth/callback`;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
      data: {
        username: username,
        registration_reason: reason,
      }
    },
  });

  if (error) {
    return new AppError('APP_ERROR', 400, 'Auth_Error' ).toJSON();
  }

  return { success: true };
}
