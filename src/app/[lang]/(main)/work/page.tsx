import type { Metadata } from "next";
import "../../../globals.css";
import { getDictionary } from '@/components/Translator';
import ExperiencesClient from '@/components/ExperienceDisplayer';

import { getLanguageAlternates } from '@/lib/seo';

import { getWorkExperiences } from '@/lib/data';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL('https://faranaiki.id'),
    title: `${dict.Work} | Faran Aiki`,
    description: dict.SEO_Work_Description || "Faran Aiki's Work History and Internships",
    openGraph: {
      title: `${dict.Work} | Faran Aiki`,
      description: dict.SEO_Work_Description || "Faran Aiki's Work History and Internships",
      url: `https://faranaiki.id/${lang}/work`,
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
      canonical: `/${lang}/work`,
      languages: getLanguageAlternates('/work'),
    },
  };
}

export default async function WorkExperiencesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  const workExperiences = getWorkExperiences(dict);

  return (
    <main className="w-full">
      <ExperiencesClient 
        experiences={workExperiences} 
        lang={lang} 
        canChange={true} 
        original_text={dict.Original}
        timeline_text={dict.Timeline}
        grid_text={dict.Grid}
      />
    </main>
  );
}
