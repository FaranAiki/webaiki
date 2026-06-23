'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { signInAction, signUpAction } from './auth-actions';

export function useAuthActions(lang: string) {
  const supabase = createClient();
  const router = useRouter();

  const signIn = async (formData: FormData) => {
    const result = await signInAction(formData);

    if (result && 'error' in result) {
      return { error: result.error };
    }

    router.push(`/${lang}`);
    router.refresh();
    return { success: true };
  };

  const signUp = async (formData: FormData, captchaToken?: string) => {
    const result = await signUpAction(formData, captchaToken);
    
    if (result && 'error' in result) {
      return { error: result.error };
    }

    return { success: true };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push(`/${lang}`);
    router.refresh();
  };

  return { signIn, signUp, signOut };
}
