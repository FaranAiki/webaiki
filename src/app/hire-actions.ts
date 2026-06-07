'use server';

import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { WorkLocation, JobType } from '@/generated/prisma/client';
import { Type } from '@sinclair/typebox';
import { validateData } from '@/lib/validation';

const HireRequestSchema = Type.Object({
  company: Type.String({ minLength: 1 }),
  jobTitle: Type.Optional(Type.String()),
  reason: Type.String({ minLength: 1 }),
  salary: Type.Optional(Type.String()),
  location: Type.Enum(WorkLocation),
  jobType: Type.Enum(JobType),
});

async function verifyRecaptcha(token: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY is missing in environment variables");
    return true; 
  }

  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
    { method: 'POST' }
  );

  const data = await response.json();
  return data.success;
}

export async function submitHireRequest(formData: FormData, captchaToken: string) {
  const isCaptchaValid = await verifyRecaptcha(captchaToken);
  if (!isCaptchaValid) {
    return { error: 'Invalid captcha' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const rawData = {
    company: formData.get('company') as string,
    jobTitle: formData.get('jobTitle') as string || undefined,
    reason: formData.get('reason') as string,
    salary: formData.get('salary') as string || undefined,
    location: formData.get('location') as WorkLocation,
    jobType: formData.get('jobType') as JobType,
  };

  // Validate with TypeBox
  const validation = validateData(HireRequestSchema, rawData);
  if (!validation.success) {
    return { error: validation.error };
  }

  const validatedData = validation.data;

  try {
    // Ensure user exists in our prisma database
    await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email! },
      create: {
        id: user.id,
        email: user.email!,
      },
    });

    await prisma.hireRequest.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
    });

    revalidatePath('/hire-me');
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: 'Database error' };
  }
}
