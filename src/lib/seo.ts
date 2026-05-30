import { Metadata } from "next";

export const LOCALES = ['en', 'id', 'zh', 'jp', 'ru', 'fr', 'ar', 'es', 'ko'];

// Map locale codes to hreflang codes (Next.js Metadata alternates.languages keys)
// 'ja' is the standard code for Japanese, but our URL path uses 'jp'
export const HREFLANG_MAP: Record<string, string> = {
  id: 'id',
  en: 'en',
  zh: 'zh',
  jp: 'ja',
  ru: 'ru',
  fr: 'fr',
  ar: 'ar',
  es: 'es',
  ko: 'ko',
};

export function getLanguageAlternates(path: string) {
  const languages: Record<string, string> = {};
  
  LOCALES.forEach((loc) => {
    const hreflang = HREFLANG_MAP[loc] || loc;
    languages[hreflang] = `/${loc}${path}`;
  });

  // Add x-default pointing to the default language (Indonesian in this case)
  languages['x-default'] = `/id${path}`;

  return languages;
}

export function getBaseMetadata(): Partial<Metadata> {
  return {
    metadataBase: new URL('https://faranaiki.id'),
  };
}
