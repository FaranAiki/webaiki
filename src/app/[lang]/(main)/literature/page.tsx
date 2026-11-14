import type { Metadata } from "next";
import "../../../globals.css";

import LiteratureLoader from './literature-loader'
import { getDictionary } from '@/components/layout/Translator';
import { getCollectionsData } from '@/lib/data';
import { getLanguageAlternates, getBaseMetadata, SITE_URL, getBreadcrumbSchema, getPersonSchema } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','literature','seo']);
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

export default async function LiteraturePage({params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','literature','seo']);
  const literature_data = await getCollectionsData(lang, 'literature');
  
  const isLoggedIn = false;
  const bookmarkedItemIds: string[] = [];

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: dict.Home, item: `/${lang}` },
    { name: dict.Literature, item: `/${lang}/literature` },
  ]);

  const personSchema = getPersonSchema(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      personSchema,
      breadcrumbSchema,
    ],
  };

  return (
    <main className="container mx-auto pb-16 pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="px-4 sm:px-8 mb-8 mt-12 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{dict.Literature}</h1>
        {dict.SEO_Literature_Description && (
          <p className="text-base opacity-80 leading-relaxed">{dict.SEO_Literature_Description}</p>
        )}
      </header>
      <LiteratureLoader 
        data={literature_data} 
        force_click={true} 
        lang={lang} 
        original_text={dict.Original}
        timeline_text={dict.Timeline}
        grid_text={dict.Grid}
        dict={dict}
        isLoggedIn={isLoggedIn}
        bookmarkedItemIds={bookmarkedItemIds}
      />
    </main>
  );
}
