'use server';

import { Type } from '@sinclair/typebox';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { RegistrationReason } from '@/generated/prisma/client';
import { validateData } from '@/lib/validation';
import { headers } from 'next/headers';

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

export async function signInAction(formData: FormData) {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  // Validate with TypeBox
  const validation = validateData(LoginSchema, rawData);
  if (!validation.success) {
    return { error: validation.error };
  }

  const { email, password } = validation.data;

  // Check if email exists in our database
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: 'Email not found' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signUpAction(formData: FormData) {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    username: formData.get('username') as string,
    reason: formData.get('reason') as string,
  };

  // Validate with TypeBox
  const validation = validateData(RegisterSchema, rawData);
  if (!validation.success) {
    return { error: validation.error };
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
    return { error: error.message };
  }

  return { success: true };
}
