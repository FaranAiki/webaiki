'use server';

import { Type, Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { RegistrationReason } from '@/generated/prisma/client';

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
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Validate with TypeBox
  const data = { email, password };
  if (!Value.Check(LoginSchema, data)) {
    return { error: 'Invalid input data' };
  }

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

export async function signUpAction(formData: FormData, origin: string) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;
  const reason = formData.get('reason') as string;

  // Validate with TypeBox
  const data = { email, password, username, reason };
  if (!Value.Check(RegisterSchema, data)) {
    return { error: 'Invalid input data' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/api/auth/callback`,
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
