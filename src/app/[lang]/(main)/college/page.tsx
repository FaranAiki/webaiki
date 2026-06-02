import type { Metadata } from "next";
import "../../../globals.css";

import React from 'react';
import CollegeLoader from './college-loader';
import { getDictionary } from '@/components/Translator';
import { getCollectionsData } from '@/lib/data';
import { getLanguageAlternates, getBaseMetadata, SITE_URL, getBreadcrumbSchema } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.College} | Faran Aiki`,
    description: dict.SEO_College_Description || "Faran Aiki's personal college collection and resources",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.College} | Faran Aiki`,
      description: dict.SEO_College_Description || "Faran Aiki's personal college collection and resources",
      url: `${SITE_URL}/${lang}/college`,
    },
    alternates: { 
      canonical: `/${lang}/college`,
      languages: getLanguageAlternates('/college'),
    },
  };
}

export default async function CollegePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const college_data = await getCollectionsData(lang, 'college');

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: dict.Home, item: `/${lang}` },
    { name: dict.College, item: `/${lang}/college` },
  ]);

  return (
    <main className="container mx-auto pb-16 pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <React.Suspense fallback={<h2 className="text-center">{dict.Loading_College}</h2>}>
        <CollegeLoader 
          data={college_data} 
          force_click={true} 
          lang={lang} 
          original_text={dict.Original}
          timeline_text={dict.Timeline}
          grid_text={dict.Grid}
        />
     </React.Suspense>
    </main>
  );
}
