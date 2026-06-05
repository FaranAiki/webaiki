import type { Metadata } from "next";
import { getDictionary } from '@/components/layout/Translator';
import { getLanguageAlternates, getBaseMetadata, SITE_URL } from '@/lib/seo';
import HomeClient from "./HomeClient";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.Home || 'Home'} | Faran Aiki`,
    description: dict.SEO_Home_Description || "Welcome to Muhammad Faran Aiki's personal website.",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.Home || 'Home'} | Faran Aiki`,
      description: dict.SEO_Home_Description || "Welcome to Muhammad Faran Aiki's personal website.",
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

  return <HomeClient lang={lang} dict={dict} />;
}
