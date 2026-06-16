import type { Metadata } from "next";
import { headers } from "next/headers";
import "../../../globals.css";

import LiteratureLoader from './literature-loader'
import { getDictionary } from '@/components/layout/Translator';
import { getCollectionsData } from '@/lib/data';
import { getLanguageAlternates, getBaseMetadata, SITE_URL, getBreadcrumbSchema } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.Literature} | Faran Aiki`,
    description: dict.SEO_Literature_Description || "Faran Aiki's short stories, poems, and other literary works",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.Literature} | Faran Aiki`,
      description: dict.SEO_Literature_Description || "Faran Aiki's short stories, poems, and other literary works",
      url: `${SITE_URL}/${lang}/literature`,
    },
    alternates: { 
      canonical: `/${lang}/literature`,
      languages: getLanguageAlternates('/literature'),
    },
  };
}

export default async function LiteraturePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const nonce = (await headers()).get('x-nonce') || undefined;
  const literature_data = await getCollectionsData(lang, 'literature');

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: dict.Home, item: `/${lang}` },
    { name: dict.Literature, item: `/${lang}/literature` },
  ]);

  return (
    <main className="container mx-auto px-6 pb-16 pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        nonce={nonce}
      />
      <LiteratureLoader 
        data={literature_data} 
        force_click={true} 
        lang={lang} 
        original_text={dict.Original}
        timeline_text={dict.Timeline}
        grid_text={dict.Grid}
        dict={dict}
      />
    </main>
  );
}
