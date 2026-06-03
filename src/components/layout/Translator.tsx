import 'server-only'; // Ensures this only runs on the server
import { cookies } from 'next/headers'; 

const dictionaries: Record<string, () => Promise<Record<string, string>>> = {
  en: () => import('../../../public/locales/en.json').then((module) => module.default),
  id: () => import('../../../public/locales/id.json').then((module) => module.default),
  zh: () => import('../../../public/locales/zh.json').then((module) => module.default),
  jp: () => import('../../../public/locales/jp.json').then((module) => module.default),
  ru: () => import('../../../public/locales/ru.json').then((module) => module.default),
  fr: () => import('../../../public/locales/fr.json').then((module) => module.default),
  ar: () => import('../../../public/locales/ar.json').then((module) => module.default),
  es: () => import('../../../public/locales/es.json').then((module) => module.default),
  ko: () => import('../../../public/locales/ko.json').then((module) => module.default),
  de: () => import('../../../public/locales/de.json').then((module) => module.default),
  nl: () => import('../../../public/locales/nl.json').then((module) => module.default),
  ha: () => import('../../../public/locales/ha.json').then((module) => module.default),
  he: () => import('../../../public/locales/he.json').then((module) => module.default),
  el: () => import('../../../public/locales/el.json').then((module) => module.default),
};

export const getDictionary = async (locale: string): Promise<Record<string, string>> => {
  const loader = dictionaries[locale] || dictionaries.en;
  return loader();
};

// For pages like not-found.tsx that don't receive URL params
export async function getDictionaryFromCookie() {
  const cookieStore = await cookies();
  const language = cookieStore.get('language')?.value || 'id';
  return await getDictionary(language);
}

// Keep this available if absolutely needed, though relying on URL params is better
export async function currentLanguage(): Promise<string> {
  const cookieStore = await cookies();
  const language = cookieStore.get('language')?.value || 'id';
  return language;
}
