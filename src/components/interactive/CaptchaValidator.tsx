'use client';

import { ReactNode, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTheme } from 'next-themes';

interface CaptchaValidatorProps {
  onValidate: (token: string | null) => void;
  children: ReactNode;
  active?: boolean;
}

/**
 * Modular Captcha Validator using Google reCAPTCHA v2
 */
export default function CaptchaValidator({ onValidate, children, active = true }: CaptchaValidatorProps) {
  const { resolvedTheme } = useTheme();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!active) return <>{children}</>;

  if (!siteKey) {
    console.warn("reCAPTCHA site key is missing. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in your .env");
    return <>{children}</>;
  }

  const onChange = (token: string | null) => {
    onValidate(token);
  };

  return (
    <div className="space-y-4">
      {children}
      
      <div className="flex justify-center p-4 bg-theme-surface-strong rounded-xl border border-theme-border overflow-hidden">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={siteKey}
          onChange={onChange}
          theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        />
      </div>
    </div>
  );
}
