"use client";

import React from 'react';

interface RecaptchaNoticeProps {
  dict: import('@/components/layout/Translator').TranslationDict;
  className?: string;
}

/**
 * A localized reCAPTCHA notice component.
 * Uses the following keys from the dictionary:
 * - Recaptcha_Protected: "Protected by reCAPTCHA. {privacy} & {terms} apply."
 * - Privacy: "Privacy"
 * - Terms: "Terms"
 */
export default function RecaptchaNotice({ dict, className = "" }: RecaptchaNoticeProps) {
  const baseText = dict.Recaptcha_Protected || "Protected by reCAPTCHA. {privacy} & {terms} apply.";
  
  // Create the localized links
  const privacyLink = (
    <a 
      key="privacy"
      href="https://policies.google.com/privacy" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="underline hover:text-theme-500 transition-colors"
    >
      {dict.Privacy || "Privacy"}
    </a>
  );
  
  const termsLink = (
    <a 
      key="terms"
      href="https://policies.google.com/terms" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="underline hover:text-theme-500 transition-colors"
    >
      {dict.Terms || "Terms"}
    </a>
  );

  // Split the base text by placeholders and map them to elements
  const parts = baseText.split(/(\{privacy\}|\{terms\})/);
  
  const content = parts.map((part) => {
    if (part === "{privacy}") return privacyLink;
    if (part === "{terms}") return termsLink;
    return part;
  });

  return (
    <p className={`text-[10px] text-center text-theme-muted font-medium ${className}`}>
      {content}
    </p>
  );
}
