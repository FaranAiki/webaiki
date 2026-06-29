import 'server-only';
import { cookies } from 'next/headers'; 
import { getDictionary } from './Translator';

export async function getDictionaryFromCookie() {
  const cookieStore = await cookies();
  const language = cookieStore.get('language')?.value || 'id';
  return await getDictionary(language);
}

export async function currentLanguage(): Promise<string> {
  const cookieStore = await cookies();
  const language = cookieStore.get('language')?.value || 'id';
  return language;
}
