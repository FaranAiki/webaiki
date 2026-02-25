import type { Metadata } from "next";
import "../globals.css";
import { getDictionary } from '@/components/Translator';
import ExperiencesClient from '@/components/ExperienceDisplayer';

export const metadata: Metadata = {
  metadataBase: new URL('https://faranaiki.id/work'),
  title: "Faran Aiki's Work History",
  description: "Faran Aiki's Work History and Internships",
  openGraph: {
    title: "Faran Aiki's Work History",
    description: "Faran Aiki's Work History and Internships",
    url: 'https://faranaiki.id/work',
    siteName: 'Faran Aiki\'s Work History', 
    type: 'website',
  },
  icons: { icon: '/icon.ico', shortcut: '/icon.ico', apple: '/icon.ico' },
  alternates: { canonical: '/' },
};

export default async function WorkExperiencesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const workExperiences = [
    {
      year: '2026',
      jobs: [
        {
          date: `${dict.February} — ${dict.Present}`,
          title: dict.Education_Freelance,
          company: 'Analitica',
          description: dict.Education_Freelance_Description,
          image: []
        },
        {
          date: `${dict.February} — ${dict.Present}`,
          title: dict.SAT_Tutor,
          company: 'Kobi Education',
          description: dict.SAT_Tutor_Description,
          image: []
        },
        {
          date: `${dict.January} — ${dict.Present}`,
          title: dict.Compile_Module_Author,
          company: 'STEI-K 2025',
          description: dict.Compile_Module_Author_Description,
          image: [
            '/documents/work/COMPILE_UTBK_0.png',
            '/documents/work/COMPILE_UTBK_1.png',
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
            '/documents/work/Analitica Software Engineer_0.png',
            '/documents/work/Analitica Software Engineer_1.png',
            '/documents/work/Analitica Software Engineer_2.png',
          ]
        },
        {
          date: `${dict.August} — ${dict.Present}`,
          title: dict.Mathematics_Private_Tutor,
          company: 'KPM-Nol Persen',
          description: dict.Mathematics_Private_Tutor_Description,
          image: [
            '/documents/work/KPM-Nol Persen_0.png',
            '/documents/work/KPM-Nol Persen_1.jpg',
            '/documents/work/KPM-Nol Persen_2.jpg',
          ]
        },
        {
          date: `${dict.May} — ${dict.September}`,
          title: dict.Education_Team,
          company: 'Analitica',
          description: dict.Education_Team_Description,
          image: [
            '/documents/work/Analitica Education Team_0.png',
            '/documents/work/Analitica Education Team_1.png',
            '/documents/work/Analitica Education Team_2.jpg',
          ]
        }
      ]
    }
  ];

  return <ExperiencesClient experiences={workExperiences} />;
}
