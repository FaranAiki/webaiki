'use server';

import { db } from '@/lib/db';
import { users, hireRequests, WorkLocation, JobType } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { Type } from '@sinclair/typebox';
import { validateData } from '@/lib/validation';
import { AppError } from '@/lib/errors';

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
  // v3 returns a score (0.0 - 1.0). 0.5 is the recommended default threshold.
  return data.success && data.score >= 0.5;
}

export async function getExistingHireRequest() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return await db.query.hireRequests.findFirst({
    where: (hireRequests, { eq }) => eq(hireRequests.userId, user.id),
  });
}

export async function submitHireRequest(formData: FormData, captchaToken: string) {
  const isCaptchaValid = await verifyRecaptcha(captchaToken);
  if (!isCaptchaValid) {
    return AppError.badRequest('Invalid_Captcha').toJSON();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return AppError.unauthorized('Not_Authenticated').toJSON();
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
    return AppError.badRequest(validation.error  || 'Validation Error').toJSON();
  }

  const validatedData = validation.data;

  try {
    // Ensure user exists in our DB
    await db.insert(users).values({
      id: user.id,
      email: user.email!,
    }).onConflictDoUpdate({
      target: users.id,
      set: { email: user.email! }
    });

    const existingRequest = await db.query.hireRequests.findFirst({
      where: (hireRequests, { eq }) => eq(hireRequests.userId, user.id),
    });

    if (existingRequest) {
      await db.update(hireRequests).set({
        ...validatedData,
        updatedAt: new Date(),
      }).where(eq(hireRequests.id, existingRequest.id));
    } else {
      await db.insert(hireRequests).values({
        id: crypto.randomUUID(),
        ...validatedData,
        userId: user.id,
      });
    }

    revalidatePath('/hire-me');
    return { success: true };
  } catch (error) {
    console.error('Error submitting hire request:', error);
    return new AppError('APP_ERROR', 400, 'Failed to submit request' ).toJSON();
  }
}
