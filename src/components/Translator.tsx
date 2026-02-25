import 'server-only'; // Ensures this only runs on the server
import { cookies } from 'next/headers'; 

// Map your locales to dynamic imports so Webpack caches them
const dictionaries = {
  en: () => import('../../public/locales/en.json').then((module) => module.default),
  id: () => import('../../public/locales/id.json').then((module) => module.default),
  zh: () => import('../../public/locales/zh.json').then((module) => module.default),
  jp: () => import('../../public/locales/jp.json').then((module) => module.default),
  ru: () => import('../../public/locales/ru.json').then((module) => module.default),
  fr: () => import('../../public/locales/fr.json').then((module) => module.default),
  ar: () => import('../../public/locales/ar.json').then((module) => module.default),
};

// Fetch the entire dictionary once based on the locale
export const getDictionary = async (locale: string): Promise<Record<string, string>> => {
  if (locale in dictionaries) {
    return dictionaries[locale as keyof typeof dictionaries]();
  }
  // Fallback to 'id' if the locale isn't found
  return dictionaries.id();
};

// For pages like not-found.tsx that don't receive URL params
export async function getDictionaryFromCookie() {
  const cookieStore = await cookies();
  const language = cookieStore.get('language')?.value || 'id';
  return getDictionary(language);
}

// Keep this available if absolutely needed, though relying on URL params is better
export async function currentLanguage(): Promise<string> {
  const cookieStore = await cookies();
  const language = cookieStore.get('language')?.value || 'id';
  return language;
}
