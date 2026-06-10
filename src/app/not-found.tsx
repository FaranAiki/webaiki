import { getDictionaryFromCookie } from '@/components/layout/Translator';
import NotFoundClient from "./not-found-client";

/**
 * Root Not Found page.
 * Wrapped by RootLayout (src/app/layout.tsx), so it has access to Providers.
 */
export default async function NotFound() {
  const dict = await getDictionaryFromCookie();
  const cookieStore = (await import('next/headers')).cookies();
  const lang = (await cookieStore).get('language')?.value || 'id';

  return (
    <main className="container mx-auto px-4 md:px-8 pt-32 pb-16 min-h-[80vh] flex flex-col items-center justify-center text-center">
      <NotFoundClient dict={dict} lang={lang} />
    </main>
  );
}
