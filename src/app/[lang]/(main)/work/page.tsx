import type { Metadata } from "next";
import "../../../globals.css";
import { getDictionary } from '@/components/Translator';
import ExperiencesClient from '@/components/ExperienceDisplayer';

import { getLanguageAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL('https://faranaiki.id'),
    title: `${dict.Work} | Faran Aiki`,
    description: dict.Software_Engineer_Description || "Faran Aiki's Work History and Internships",
    openGraph: {
      title: `${dict.Work} | Faran Aiki`,
      description: dict.Software_Engineer_Description || "Faran Aiki's Work History and Internships",
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

  const workExperiences = [
    {
      year: '2026',
      jobs: [
        {
          date: `${dict.April} — ${dict.May}`,
          title: dict.Impact_Module_Author,
          company: 'STEI-K 2025',
          description: dict.Impact_Module_Author_Description,
          image: [
            '/documents/organization/Impact_Module_0.webp',
            '/documents/organization/Impact_Module_1.webp',
          ]
        },
        {
          date: `${dict.February} — ${dict.Present}`,
          title: dict.SAT_Tutor,
          company: 'Kobi Education',
          description: dict.SAT_Tutor_Description,
          image: [
            '/documents/work/SAT_Tutor_0.webp',
            '/documents/work/SAT_Tutor_1.webp',
          ]
        },
        {
          date: `${dict.January} — ${dict.Present}`,
          title: dict.Compile_Module_Author,
          company: 'STEI-K 2025',
          description: dict.Compile_Module_Author_Description,
          image: [
            '/documents/work/COMPILE_UTBK_0.webp',
            '/documents/work/COMPILE_UTBK_1.webp',
          ]
        },
      ],
    },
    {
      year: '2025',
      jobs: [
        {
          date: `${dict.October} — ${dict.Present}`,
          title: dict.Software_Engineer,
          company: 'Analitica',
          description: dict.Software_Engineer_Description,
          image: [
            '/documents/work/Analitica Software Engineer_0.webp',
            '/documents/work/Analitica Software Engineer_1.webp',
            '/documents/work/Analitica Software Engineer_2.webp',
          ]
        },
        {
          date: `${dict.August} — ${dict.Present}`,
          title: dict.Mathematics_Private_Tutor,
          company: 'KPM-Nol Persen',
          description: dict.Mathematics_Private_Tutor_Description,
          image: [
            '/documents/work/KPM-Nol Persen_0.webp',
            '/documents/work/KPM-Nol Persen_1.webp',
            '/documents/work/KPM-Nol Persen_2.webp',
          ]
        },
        {
          date: `${dict.May} — ${dict.September}`,
          title: dict.Education_Team,
          company: 'Analitica',
          description: dict.Education_Team_Description,
          image: [
            '/documents/work/Analitica Education Team_0.webp',
            '/documents/work/Analitica Education Team_1.webp',
            '/documents/work/Analitica Education Team_2.webp',
          ]
        }
      ]
    }
  ];

  return (
    <main className="w-full">
      <ExperiencesClient experiences={workExperiences} lang={lang} />
    </main>
  );
}
