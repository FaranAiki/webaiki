import type { Metadata } from "next";
import ExperiencesClient from '@/components/ExperienceDisplayer';
import "../globals.css"; 

import { getDictionary } from '@/components/Translator';

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
  icons: { icon: "/icon.ico", shortcut: "/icon.ico", apple: "/icon.ico" },
  alternates: { canonical: "/" },
};

export default async function ProjectPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const projectExperiences = [
    {
      year: '2026',
      jobs: [
        {
          date: `${dict.February} — ${dict.Present}`,
          title: dict.Alkyl_Compiler,
          company: 'LLVM, C',
          description: dict.Alkyl_Compiler_Description,
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
          date: `${dict.November} — ${dict.Present}`,
          title: dict.Make_Interactive_UAS,
          company: 'Analitica',
          description: dict.Make_Interactive_UAS_Description,
          image: [
            '/documents/project/UAS_0.png',
            '/documents/project/UAS_1.png',
            '/documents/project/UAS_2.png',
          ],
          url: 'https://faranaiki.id/project/uas_matematika_dasar',
        },
        {
          date: `${dict.October} — ${dict.Present}`,
          title: dict.Make_Website,
          company: 'faranaiki.id',
          description: dict.Make_Website_Description,
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
          date: `${dict.November} — ${dict.Present}`,
          title: dict.Make_Nihwm,
          company: 'Linux',
          description: dict.Make_Nihwm_Description,
          image: [
            '/documents/project/Nihwm_0.png',
          ],
          url: 'https://www.github.com/FaranAiki/nihwm',
        },
      ]
    },
  ];

  return <ExperiencesClient experiences={projectExperiences} />;
}
