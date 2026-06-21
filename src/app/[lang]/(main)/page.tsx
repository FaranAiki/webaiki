import type { Metadata } from "next";
import { getDictionary } from '@/components/layout/Translator';
import { getLanguageAlternates, getBaseMetadata, SITE_URL, getPersonSchema, getWebsiteSchema } from '@/lib/seo';
import HomeClient from "./HomeClient";
import { headers } from 'next/headers';
import { getNews } from '@/app/actions';
import { NewsItem } from '@/lib/types';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseMetadata = getBaseMetadata();

  const title = `Muhammad Faran Aiki | ${dict.Software_Engineer || 'Software Engineer'} & ${dict.College || 'ITB Student'}`;
  const description = dict.SEO_Home_Description || `Portfolio of Muhammad Faran Aiki, a Software Engineer and student at Bandung Institute of Technology. Explore projects, work experience, and insights from Faran.`;

  return {
    ...baseMetadata,
    title,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      url: `${SITE_URL}/${lang}`,
    },
    alternates: {
      canonical: `/${lang}`,
      languages: getLanguageAlternates(''),
    },
  };
}

export default async function HomePage({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const nonce = (await headers()).get('x-nonce') || undefined;

  let news: NewsItem[] = [];
  try {
    news = await getNews() as unknown as NewsItem[];
  } catch (error) {
    console.error("Error fetching news in HomePage:", error);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      getPersonSchema(lang),
      getWebsiteSchema(lang)
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient lang={lang} dict={dict} initialNews={news} />
    </>
  );
}
