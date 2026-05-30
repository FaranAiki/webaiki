import 'server-only'; // Ensures this only runs on the server
import { cookies } from 'next/headers'; 

// Statically importing locales so they are available synchronously (like comptime/build-time)
import en from '../../public/locales/en.json';
import id from '../../public/locales/id.json';
import zh from '../../public/locales/zh.json';
import jp from '../../public/locales/jp.json';
import ru from '../../public/locales/ru.json';
import fr from '../../public/locales/fr.json';
import ar from '../../public/locales/ar.json';
import es from '../../public/locales/es.json';
import ko from '../../public/locales/ko.json';
import de from '../../public/locales/de.json';
import nl from '../../public/locales/nl.json';

const dictionaries = {
  en,
  id,
  zh,
  jp,
  ru,
  fr,
  ar,
  es,
  ko,
  de,
  nl,
};

// Now a synchronous function! No more await needed.
export const getDictionary = (locale: string): Record<string, string> => {
  if (locale in dictionaries) {
    return dictionaries[locale as keyof typeof dictionaries];
  }
  // Fallback to 'id' if the locale isn't found
  return dictionaries.id;
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
