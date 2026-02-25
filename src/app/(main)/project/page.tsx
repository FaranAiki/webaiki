import type { Metadata } from "next";
import ExperiencesClient from '@/components/ExperienceDisplayer';
import "../globals.css"; 

import { t, from_to } from '@/components/Translator';

export const metadata: Metadata = {
  metadataBase: new URL("https://faranaiki.id/project"),

  title: "Faran Aiki's Project",
  description: "Faran Aiki's project history and others",

  openGraph: {
    title: "Faran Aiki's Project",
    description: "Faran Aiki's project history and others",
    url: "https://faranaiki.id/project",
    siteName: "Faran Aiki's Project",
    type: "website",
  },

  icons: {
    icon: "/icon.ico",
    shortcut: "/icon.ico",
    apple: "/icon.ico",
  },

  alternates: {
    canonical: "/",
  },
};

export default async function ProjectPage() {
  // async as this is a server side
  const projectExperiences = [
    {
      year: '2026',
      jobs: [
        {
          date: await from_to('February', 'Present'),
          title: await t('Alkyl_Compiler'),
          company: 'LLVM, C',
          description: await t('Alkyl_Compiler_Description'),
          image: [
            '/documents/project/Alkyl_0.png',
            '/documents/project/Alkyl_1.png',
            '/documents/project/Alkyl_2.png',
          ],
          url: 'https://github.com/FaranAiki/alkyl',
        },
      ]
    },
    {
      year: '2025',
      jobs: [
        {
          date: await from_to('November', 'Present'),
          title: await t('Make_Interactive_UAS'),
          company: 'Analitica',
          description: await t('Make_Interactive_UAS_Description'),
          image: [
            '/documents/project/UAS_0.png',
            '/documents/project/UAS_1.png',
            '/documents/project/UAS_2.png',
          ],
          url: 'https://faranaiki.id/project/uas_matematika_dasar',
        },
        {
          date: await from_to('October', 'Present'),
          title: await t('Make_Website'),
          company: 'faranaiki.id',
          description: await t('Make_Website_Description'),
          image: [
            '/documents/project/Web_0.png',
            '/documents/project/Web_1.png',
            '/documents/project/Web_2.png',
          ],
          url: 'https://faranaiki.id'
        }
      ]
    },
    {
      year: '2023',
      jobs: [
        {
          date: await from_to('November', 'Present'),
          title: await t('Make_Nihwm'),
          company: 'Linux',
          description: await t('Make_Nihwm_Description'),
          image: [
            '/documents/project/Nihwm_0.png',
          ],
          url: 'https://www.github.com/FaranAiki/nihwm',
        },
      ]
    },
  ];

  // use experiences client defined in the components 
  return <ExperiencesClient experiences={projectExperiences} />;
}
