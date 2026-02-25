import type { Metadata } from "next";
import "../globals.css";
import { t, from_to } from '@/components/Translator';
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

  icons: {
    icon: '/icon.ico',
    shortcut: '/icon.ico',
    apple: '/icon.ico',
  },
  
  alternates: {
    canonical: '/',
  },
};

// server component
export default async function WorkExperiencesPage() {
  // async as this is a server side
  const workExperiences = [
    {
      year: '2026',
      jobs: [
        {
          date: await from_to('February', 'Present'),
          title: await t('Education_Freelance'),
          company: 'Analitica',
          description: await t('Education_Freelance_Description'),
          image: [
          
          ]
        },
        {
          date: await from_to('February', 'Present'),
          title: await t('SAT_Tutor'),
          company: 'Kobi Education',
          description: await t('SAT_Tutor_Description'),
          image: [

          ]
        },
        {
          date: await from_to('January', 'Present'),
          title: await t('Compile_Module_Author'),
          company: 'STEI-K 2025',
          description: await t('Compile_Module_Author_Description'),
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
          date: await from_to('October', 'Present'),
          title: await t('Software_Engineer'),
          company: 'Analitica',
          description: await t('Software_Engineer_Description'),
          image: [
            '/documents/work/Analitica Software Engineer_0.png',
            '/documents/work/Analitica Software Engineer_1.png',
            '/documents/work/Analitica Software Engineer_2.png',
          ]
        },
        {
          date: await from_to('August', 'Present'),
          title: await t('Mathematics_Private_Tutor'),
          company: 'KPM-Nol Persen',
          description: await t('Mathematics_Private_Tutor_Description'),
          image: [
            '/documents/work/KPM-Nol Persen_0.png',
            '/documents/work/KPM-Nol Persen_1.jpg',
            '/documents/work/KPM-Nol Persen_2.jpg',
          ]
        },
        {
          date: await from_to('May', 'September'),
          title: await t('Education_Team'),
          company: 'Analitica',
          description: await t('Education_Team_Description'),
          image: [
            '/documents/work/Analitica Education Team_0.png',
            '/documents/work/Analitica Education Team_1.png',
            '/documents/work/Analitica Education Team_2.jpg',
          ]
        }
      ]
    }
  ];

  // use experiences client defined in the components 
  return <ExperiencesClient experiences={workExperiences} />;
}
