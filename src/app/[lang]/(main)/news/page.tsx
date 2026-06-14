import type { Metadata } from "next";
import { getDictionary } from '@/components/layout/Translator';
import NewsDisplay from '@/components/interactive/NewsDisplay';
import { getBaseMetadata, getLanguageAlternates, SITE_URL } from '@/lib/seo';
import { createClient } from '@/utils/supabase/server';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  const title = `${dict.News} - Muhammad Faran Aiki`;
  const description = dict.No_News || "Latest news and updates.";
  
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title,
    description,
    alternates: getLanguageAlternates(`${SITE_URL}/${lang}/news`),
  };
}

export default async function NewsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isAdmin = user?.email === 'faran.aiki.business@gmail.com';

  return (
    <main className="container mx-auto px-4 md:px-8 pt-32 pb-16 min-h-screen">
      <NewsDisplay dict={dict} lang={lang} isAdmin={isAdmin} />
    </main>
  );
}
