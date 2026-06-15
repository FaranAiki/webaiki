'use client';

import { ReactNode } from 'react';

/**
 * Global grecaptcha type for v3
 */
declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

interface CaptchaValidatorProps {
  onValidate: (token: string | null) => void;
  children: ReactNode;
  active?: boolean;
}

/**
 * v3 Implementation: This component now acts as a utility provider.
 * v3 is invisible, so we don't render a checkbox anymore.
 */
export default function CaptchaValidator({ children }: CaptchaValidatorProps) {
  // We keep the children but v3 doesn't need a visible container.
  return <>{children}</>;
}

/**
 * Utility to execute captcha right before form submission
 */
export async function executeCaptcha(action: string): Promise<string | null> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  
  if (!siteKey) {
    console.warn("reCAPTCHA site key is missing. Bypassing.");
    return "BYPASSED";
  }

  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(siteKey, { action })
          .then((token) => resolve(token))
          .catch((err) => {
            console.error("reCAPTCHA execution failed", err);
            resolve(null);
          });
      });
    } else {
      console.error("reCAPTCHA library not loaded");
      resolve(null);
    }
  });
}
