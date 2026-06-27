import type { Metadata } from "next";
import "../../../globals.css";

import React from 'react';
import CollegeLoader from './college-loader';
import { getDictionary } from '@/components/layout/Translator';
import { getCollectionsData } from '@/lib/data';
import { getLanguageAlternates, getBaseMetadata, SITE_URL, getBreadcrumbSchema } from '@/lib/seo';
import { createClient } from '@/utils/supabase/server';
import { getBookmarks } from '@/app/bookmark-actions';

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
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;
  const bookmarks = isLoggedIn ? await getBookmarks(user.id) : [];
  const bookmarkedItemIds = bookmarks.filter(b => b.itemType === 'collection').map(b => b.itemId);

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
      <h1 className="sr-only">{dict.College}</h1>
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
