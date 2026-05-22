import type { Metadata } from "next";
import "../../../globals.css";
import { getDictionary } from '@/components/Translator';
import ExperiencesClient from '@/components/ExperienceDisplayer';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL('https://faranaiki.id'),
    title: `${dict.Award} | Faran Aiki`,
    description: dict.Paragon_Scholarship_Desc || "Faran Aiki's award, like scholarships and others",
    openGraph: {
      title: `${dict.Award} | Faran Aiki`,
      description: dict.Paragon_Scholarship_Desc || "Faran Aiki's award, like scholarships and others",
      url: `https://faranaiki.id/${lang}/award`,
      siteName: "faranaiki.id",
      type: "website",
      images: [
        {
          url: '/images/photo_faran_aiki/1_fa_photo_linkedin.jpg',
          width: 1200,
          height: 630,
          alt: 'Faran Aiki',
        },
      ],
    },
    icons: { icon: '/icon.ico', shortcut: '/icon.ico', apple: '/icon.ico' },
    alternates: { 
      canonical: `/${lang}/award`,
      languages: {
        'id': '/id/award',
        'en': '/en/award',
        'zh': '/zh/award',
        'ja': '/jp/award',
      }
    },
  };
}

export default async function AwardsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  const awards = [{
      year: '2025',
      jobs: [
        {
          date: `${dict.November} — ${dict.Present}`,
          title: dict.Paragon_Scholarship_Title,
          company: dict.PT_Paragon || 'PT Paragon',
          description: dict.Paragon_Scholarship_Desc,
          image: [
            '/documents/award/paragon_scholarship.png',
          ]
        },
      ],
    },
  ];

  return <ExperiencesClient experiences={awards} lang={lang} />;
}
