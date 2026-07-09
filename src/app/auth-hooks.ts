'use client';

import { useRouter } from 'next/navigation';
import { signInAction, signUpAction, signOutAction } from './auth-actions';

export function useAuthActions(lang: string) {
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
    await signOutAction();
    router.push(`/${lang}`);
    router.refresh();
  };

  return { signIn, signUp, signOut };
}
