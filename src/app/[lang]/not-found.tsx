import { getDictionary } from '@/components/layout/Translator';
import NotFoundClient from "../not-found-client";

/**
 * Localized Not Found page.
 * Wrapped by localized layout (src/app/[lang]/layout.tsx), 
 * which is wrapped by RootLayout (src/app/layout.tsx).
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
