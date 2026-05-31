import type { Metadata } from "next";
import "../../../globals.css";
import { getDictionary } from '@/components/Translator';
import ExperiencesClient from '@/components/ExperienceDisplayer';

import { getLanguageAlternates } from '@/lib/seo';

import { getAwardExperiences } from '@/lib/data';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL('https://faranaiki.id'),
    title: `${dict.Award} | Faran Aiki`,
    description: dict.SEO_Award_Description || "Faran Aiki's Awards and Scholarships",
    openGraph: {
      title: `${dict.Award} | Faran Aiki`,
      description: dict.SEO_Award_Description || "Faran Aiki's Awards and Scholarships",
      url: `https://faranaiki.id/${lang}/award`,
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
      canonical: `/${lang}/award`,
      languages: getLanguageAlternates('/award'),
    },
  };
}

export default async function AwardPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  const awards = getAwardExperiences(dict);

  return <ExperiencesClient 
    experiences={awards} 
    lang={lang} 
    layout="grid" 
    canChange={true} 
    original_text={dict.Original}
    timeline_text={dict.Timeline}
    grid_text={dict.Grid}
    bento_text={dict.Bento}
    smooth_text={dict.Smooth}
    click_to_close_text={dict.Click_To_Close}
  />;
}
