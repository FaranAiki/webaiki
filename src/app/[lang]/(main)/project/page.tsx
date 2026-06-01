import type { Metadata } from "next";
import ExperiencesClient from '@/components/ExperienceDisplayer';
import "../../../globals.css"; 

import { getDictionary } from '@/components/Translator';

import { getLanguageAlternates } from '@/lib/seo';

import { getProjectExperiences } from '@/lib/data';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL("https://faranaiki.id"),
    title: `${dict.Project} | Faran Aiki`,
    description: dict.SEO_Project_Description || "Faran Aiki's project history and others",
    openGraph: {
      title: `${dict.Project} | Faran Aiki`,
      description: dict.SEO_Project_Description || "Faran Aiki's project history and others",
      url: `https://faranaiki.id/${lang}/project`,
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
    icons: { icon: "/icon.ico", shortcut: "/icon.ico", apple: "/icon.ico" },
    alternates: { 
      canonical: `/${lang}/project`,
      languages: getLanguageAlternates('/project'),
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const projectExperiences = getProjectExperiences(dict);

  return (
    <main className="w-full">
      <ExperiencesClient 
        experiences={projectExperiences} 
        lang={lang} 
        canChange={true} 
        original_text={dict.Original}
        timeline_text={dict.Timeline}
        grid_text={dict.Grid}
        bento_text={dict.Bento}
        smooth_text={dict.Smooth}
        click_to_close_text={dict.Click_To_Close}
        modern_text={dict.Presentation_Modern}
        cinematic_text={dict.Presentation_Cinematic}
        editorial_text={dict.Presentation_Editorial}
      />
    </main>
  );
}
