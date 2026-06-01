import type { Metadata } from "next";
import "../../../globals.css";

import LiteratureLoader from './literature-loader'
import { getDictionary } from '@/components/Translator';
import { getCollectionsData } from '@/lib/data';
import { getLanguageAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL('https://faranaiki.id'),
    title: `${dict.Literature} | Faran Aiki`,
    description: dict.SEO_Literature_Description || "Faran Aiki's short stories, poems, and other literary works",
    openGraph: {
      title: `${dict.Literature} | Faran Aiki`,
      description: dict.SEO_Literature_Description || "Faran Aiki's short stories, poems, and other literary works",
      url: `https://faranaiki.id/${lang}/literature`,
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
      canonical: `/${lang}/literature`,
      languages: getLanguageAlternates('/literature'),
    },
  };
}

export default async function LiteraturePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const literature_data = await getCollectionsData(lang, 'literature');

  return (
    <main className="container mx-auto px-6 pb-16 pt-24">
      <LiteratureLoader 
        data={literature_data} 
        force_click={true} 
        lang={lang} 
        original_text={dict.Original}
        timeline_text={dict.Timeline}
        grid_text={dict.Grid}
      />
    </main>
  );
}
