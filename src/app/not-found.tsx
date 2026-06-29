import { getDictionary } from '@/components/layout/Translator';
import NotFoundClient from "./not-found-client";

/**
 * Root Not Found page.
 * Wrapped by RootLayout (src/app/layout.tsx), so it has access to Providers.
 */
export default async function NotFound() {
  const lang = 'en';
  const dict = await getDictionary(lang);

  return (
    <main className="container mx-auto px-4 md:px-8 pt-32 pb-16 min-h-[80vh] flex flex-col items-center justify-center text-center">
      <NotFoundClient dict={dict} lang={lang} />
    </main>
  );
}
