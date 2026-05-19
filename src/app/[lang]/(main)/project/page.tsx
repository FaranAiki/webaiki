import type { Metadata } from "next";
import ExperiencesClient from '@/components/ExperienceDisplayer';
import "../../../globals.css"; 

import { getDictionary } from '@/components/Translator';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL("https://faranaiki.id"),
    title: `${dict.Project} | Faran Aiki`,
    description: dict.Make_Website_Description || "Faran Aiki's project history and others",
    openGraph: {
      title: `${dict.Project} | Faran Aiki`,
      description: dict.Make_Website_Description || "Faran Aiki's project history and others",
      url: `https://faranaiki.id/${lang}/project`,
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
    icons: { icon: "/icon.ico", shortcut: "/icon.ico", apple: "/icon.ico" },
    alternates: { 
      canonical: `/${lang}/project`,
      languages: {
        'id': '/id/project',
        'en': '/en/project',
        'zh': '/zh/project',
        'jp': '/jp/project',
      }
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  const projectExperiences = [
    {
      year: '2026',
      jobs: [
        {
          date: `${dict.May}`,
          title: dict.Lidia_Project,
          company: 'Python, Pandas, Gemini-CLI, Jupyter Notebook, ETL',
          description: dict.Lidia_Project_Description,
          url: 'https://github.com/FaranAiki/lidia',
          image: [
            '/documents/project/Lidia_0.png',
            '/documents/project/Lidia_1.png',
            '/documents/project/Lidia_2.png',
            '/documents/project/Lidia_3.png',
            '/documents/project/Lidia_4.png',
          ]
        },
        {
          date: `${dict.March}`,
          title: dict.ALTH_Project,
          company: 'Flutter, Dart, Burp Suite, Microsoft SSO',
          description: dict.ALTH_Project_Description,
          image: [
            '/documents/project/ALTH_0.jpg',
            '/documents/project/ALTH_1.jpg',
            '/documents/project/ALTH_2.png',
            '/documents/project/ALTH_3.png',
          ],
        },
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

  return (
    <main className="w-full">
      <ExperiencesClient experiences={projectExperiences} lang={lang} />
    </main>
  );
}
