import type { Metadata } from "next";

import "../../../globals.css";
import { getDictionary } from '@/components/layout/Translator';
import ExperiencesClient from '@/components/portfolio/ExperienceServerDisplayer';

import { getLanguageAlternates, getBaseMetadata, SITE_URL, getBreadcrumbSchema, getPersonSchema } from '@/lib/seo';

import { getAwardExperiences } from '@/lib/data';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','award','seo']);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.Award} | Faran Aiki`,
    description: dict.SEO_Award_Description || "Faran Aiki's Awards and Scholarships",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.Award} | Faran Aiki`,
      description: dict.SEO_Award_Description || "Faran Aiki's Awards and Scholarships",
      url: `${SITE_URL}/${lang}/award`,
    },
    alternates: {
      canonical: `/${lang}/award`,
      languages: getLanguageAlternates('/award'),
    },
  };
}


export default async function AwardPage({params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','award','seo']);

  const isLoggedIn = false;
  const experienceBookmarks: string[] = [];

  const awards = getAwardExperiences(dict);

  const personSchema = getPersonSchema(lang);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: dict.Home, item: `/${lang}` },
    { name: dict.Award, item: `/${lang}/award` },
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      personSchema,
      breadcrumbSchema,
    ],
  };

  return (
    <main className="w-full pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="px-4 sm:px-8 mb-8 mt-12 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{dict.Award}</h1>
        {dict.SEO_Award_Description && (
          <p className="text-base opacity-80 leading-relaxed">{dict.SEO_Award_Description}</p>
        )}
      </header>
      <div className="pt-[12px] w-full px-4 md:px-0">
        <ExperiencesClient
        isLoggedIn={isLoggedIn}
        bookmarkedItemIds={experienceBookmarks}

        experiences={awards}
        lang={lang}
        layout="original"
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
            visit_external_link_text={dict.Visit_External_Link}
            hover_to_preview_text={dict.Hover_To_Preview}
            hover_an_experience_text={dict.Hover_An_Experience}
            visit_project_text={dict.Visit_Project}
            priorityImages={true}
      />
      </div>
    </main>
  );
}
