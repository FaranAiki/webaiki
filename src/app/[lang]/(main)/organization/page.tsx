import type { Metadata } from "next";
import "../../../globals.css";
import { getDictionary } from '@/components/Translator';
import ExperiencesClient from '@/components/ExperienceDisplayer';

import { getLanguageAlternates } from '@/lib/seo';

import { getOrganizationExperiences } from '@/lib/data';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL('https://faranaiki.id'),
    title: `${dict.Organization} | Faran Aiki`,
    description: dict.SEO_Organization_Description || "Faran Aiki's organization and activities",
    openGraph: {
      title: `${dict.Organization} | Faran Aiki`,
      description: dict.SEO_Organization_Description || "Faran Aiki's organization and activities",
      url: `https://faranaiki.id/${lang}/organization`,
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
      canonical: `/${lang}/organization`,
      languages: getLanguageAlternates('/organization'),
    },
  };
}

export default async function OrganizationExperiencesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  const organizationExperiences = getOrganizationExperiences(dict);

  return (
    <main className="w-full">
      <ExperiencesClient 
        experiences={organizationExperiences} 
        lang={lang} 
        canChange={true} 
        original_text={dict.Original}
        timeline_text={dict.Timeline}
        grid_text={dict.Grid}
      />
    </main>
  );
}
