import type { Metadata } from "next";
import "../../../globals.css";
import { getDictionary } from '@/components/Translator';
import ExperiencesClient from '@/components/ExperienceDisplayer';

import { getLanguageAlternates, getBaseMetadata, SITE_URL, getBreadcrumbSchema, getWorkSchema, getPersonSchema } from '@/lib/seo';

import { getWorkExperiences } from '@/lib/data';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.Work} | Faran Aiki`,
    description: dict.SEO_Work_Description || "Faran Aiki's Work History and Internships",
    openGraph: {
      title: `${dict.Work} | Faran Aiki`,
      description: dict.SEO_Work_Description || "Faran Aiki's Work History and Internships",
      url: `${SITE_URL}/${lang}/work`,
      siteName: "Faran Aiki",
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
    alternates: { 
      canonical: `/${lang}/work`,
      languages: getLanguageAlternates('/work'),
    },
  };
}

export default async function WorkExperiencesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const workExperiences = getWorkExperiences(dict);

  const personSchema = getPersonSchema(lang);
  const workSchema = getWorkSchema(workExperiences);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: dict.Home, item: `/${lang}` },
    { name: dict.Work, item: `/${lang}/work` },
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...personSchema,
        "hasOccupation": workSchema,
      },
      breadcrumbSchema,
    ],
  };

  return (
    <main className="w-full pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ExperiencesClient 
        experiences={workExperiences} 
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
