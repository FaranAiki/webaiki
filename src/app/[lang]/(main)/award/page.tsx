import type { Metadata } from "next";
import "../globals.css";
import { getDictionary } from '@/components/Translator';
import ExperiencesClient from '@/components/ExperienceDisplayer';

export const metadata: Metadata = {
  metadataBase: new URL('https://faranaiki.id/award'),
  title: "Faran Aiki's Award",
  description: "Faran Aiki's award, like scholarships and others",
  openGraph: {
    title: "Faran Aiki's Award",
    description: "Faran Aiki's award, like scholarships and others",
    url: 'https://faranaiki.id/award',
    siteName: 'Faran Aiki\'s Award', 
    type: 'website',
  },
  icons: { icon: '/icon.ico', shortcut: '/icon.ico', apple: '/icon.ico' },
  alternates: { canonical: '/' },
};

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
