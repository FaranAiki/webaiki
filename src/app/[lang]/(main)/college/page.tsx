import type { Metadata } from "next";
import "../../../globals.css";

import React from 'react';
import CollegeLoader from './college-loader';
import { getDictionary } from '@/components/Translator';
import { getCollectionsData } from '@/lib/data';
import { getLanguageAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL('https://faranaiki.id'),
    title: `${dict.College} | Faran Aiki`,
    description: dict.SEO_College_Description || "Faran Aiki's personal college collection and resources",
    openGraph: {
      title: `${dict.College} | Faran Aiki`,
      description: dict.SEO_College_Description || "Faran Aiki's personal college collection and resources",
      url: `https://faranaiki.id/${lang}/college`,
      siteName: "faranaiki.id",
      type: "website",
      images: [
        {
          url: '/images/photo_faran_aiki/1_fa_photo_linkedin.webp',
          width: 1200,
          height: 630,
          alt: 'Faran Aiki',
        },
      ],
    },
    icons: { icon: '/icon.ico', shortcut: '/icon.ico', apple: '/icon.ico' },
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

  return (
    <main className="container mx-auto pb-16 pt-16">
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
