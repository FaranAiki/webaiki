import type { Metadata } from "next";
import "../../../globals.css";

import React from 'react';
import CollegeLoader from './college-loader';
import { getDictionary } from '@/components/layout/Translator';
import { getCollectionsData } from '@/lib/data';
import { getLanguageAlternates, getBaseMetadata, SITE_URL, getBreadcrumbSchema } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','college','seo']);
  const baseMetadata = getBaseMetadata();

  const description = dict.SEO_College_Description || "Faran Aiki's personal college collection and resources";
  const title = `${dict.College} | Muhammad Faran Aiki`;

  return {
    ...baseMetadata,
    title,
    description,
    keywords: [
      'Muhammad Faran Aiki', 'Faran Aiki', 'ITB', 'STI ITB', 'STEI-K ITB',
      'college coursework', 'academic portfolio', 'computer science projects',
      'information systems and technology', 'university assignments', 'study notes',
      'Bandung Institute of Technology', 'coursework', 'college works'
    ],
    openGraph: {
      ...baseMetadata.openGraph,
      type: 'website',
      title,
      description,
      url: `${SITE_URL}/${lang}/college`,
      images: [
        {
          url: `${SITE_URL}/og-default.png`,
          width: 1200,
          height: 630,
          alt: `${dict.College} - Muhammad Faran Aiki`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/og-default.png`],
    },
    alternates: {
      canonical: `/${lang}/college`,
      languages: getLanguageAlternates('/college'),
    },
  };
}

export default async function CollegePage({params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','college','seo']);
  const college_data = await getCollectionsData(lang, 'college');

  const isLoggedIn = false;
  const bookmarkedItemIds: string[] = [];

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: dict.Home, item: `/${lang}` },
    { name: dict.College, item: `/${lang}/college` },
  ]);

  const listItems: { '@type': string; position: number; name: string; url?: string }[] = [];
  let pos = 1;
  for (const [semester, courses] of Object.entries(college_data)) {
    for (const [course, docs] of Object.entries(courses)) {
      for (const [docName, docData] of Object.entries(docs)) {
        const path = typeof docData === 'string' ? docData : docData.path;
        const absUrl = path && path.startsWith('http') ? path : path ? `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}` : undefined;
        listItems.push({
          '@type': 'ListItem',
          position: pos++,
          name: `${semester} — ${course}: ${docName}`,
          ...(absUrl ? { url: absUrl } : {}),
        });
      }
    }
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${dict.College} | Muhammad Faran Aiki`,
    description: dict.SEO_College_Description || "Faran Aiki's personal college collection and resources",
    url: `${SITE_URL}/${lang}/college`,
    inLanguage: lang,
    author: {
      '@type': 'Person',
      name: 'Muhammad Faran Aiki',
      url: SITE_URL,
    },
    about: {
      '@type': 'EducationalOrganization',
      name: 'Bandung Institute of Technology',
      alternateName: 'Institut Teknologi Bandung',
    },
    ...(listItems.length > 0 ? {
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: listItems.length,
        itemListElement: listItems,
      }
    } : {}),
  };

  return (
    <main className="container mx-auto pb-16 pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <header className="px-4 sm:px-8 mb-8 mt-12 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{dict.College}</h1>
        {dict.SEO_College_Description && (
          <p className="text-base opacity-80 leading-relaxed">{dict.SEO_College_Description}</p>
        )}
      </header>
      <React.Suspense fallback={<div className="text-center text-xl font-bold">{dict.Loading_College}</div>}>
        <CollegeLoader
          data={college_data}
          force_click={true}
          lang={lang}
          original_text={dict.Original}
          timeline_text={dict.Timeline}
          grid_text={dict.Grid}
          dict={dict}
          isLoggedIn={isLoggedIn}
          bookmarkedItemIds={bookmarkedItemIds}
        />
     </React.Suspense>
    </main>
  );
}
