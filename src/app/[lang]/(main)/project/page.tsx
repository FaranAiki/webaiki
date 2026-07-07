import type { Metadata } from "next";

import ExperiencesClient from '@/components/portfolio/ExperienceDisplayer';
import "../../../globals.css"; 

import { getDictionary } from '@/components/layout/Translator';

import { getLanguageAlternates, getBaseMetadata, SITE_URL, getBreadcrumbSchema, getProjectSchema, getPersonSchema } from '@/lib/seo';

import { getProjectExperiences } from '@/lib/data';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.Project} | Faran Aiki`,
    description: dict.SEO_Project_Description || "Showcase of Faran Aiki's software projects and contributions",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.Project} | Faran Aiki`,
      description: dict.SEO_Project_Description || "Showcase of Faran Aiki's software projects and contributions",
      url: `${SITE_URL}/${lang}/project`,
    },
    alternates: { 
      canonical: `/${lang}/project`,
      languages: getLanguageAlternates('/project'),
    },
  };
  }

export default async function ProjectPage({params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const isLoggedIn = false;
  const experienceBookmarks: string[] = [];


  const projectExperiences = getProjectExperiences(dict);

  const personSchema = getPersonSchema(lang);
  const projectsSchema = getProjectSchema(projectExperiences);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: dict.Home, item: `/${lang}` },
    { name: dict.Project, item: `/${lang}/project` },
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      personSchema,
      ...projectsSchema,
      breadcrumbSchema,
    ],
  };

  return (
    <main className="w-full pt-16">
      <h1 className="sr-only">{dict.Project || 'Project'}</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="pt-[12px] w-full px-4 md:px-0">
        <ExperiencesClient 
        isLoggedIn={isLoggedIn}
        bookmarkedItemIds={experienceBookmarks}

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
            visit_external_link_text={dict.Visit_External_Link}
      />
      </div>
    </main>
  );
}
