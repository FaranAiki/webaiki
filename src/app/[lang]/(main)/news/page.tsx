import { headers } from "next/headers";
import type { Metadata } from "next";
import { getDictionary } from '@/components/layout/Translator';
import NewsDisplay from '@/components/interactive/NewsDisplay';
import { getBaseMetadata, getLanguageAlternates } from '@/lib/seo';
import { getNews } from '@/app/actions';

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
    alternates: getLanguageAlternates('/news'),
  };
}

export default async function NewsPage({ params }: { params: Promise<{ lang: string }> }) {
  const nonce = (await headers()).get("x-nonce") || "";
  const { lang } = await params;
  const [dict, news] = await Promise.all([
    getDictionary(lang),
    getNews()
  ]);

  return (
    <main className="container mx-auto px-4 md:px-8 pt-32 pb-16 min-h-screen">
      <NewsDisplay 
        dict={dict} 
        lang={lang} 
        isAdmin={false} 
        initialNews={JSON.parse(JSON.stringify(news))} 
      />
    </main>
  );
}
