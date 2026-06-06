import type { Metadata } from "next";
import { headers } from "next/headers";
import "../../../globals.css";
import { getDictionary } from '@/components/layout/Translator';
import ExperiencesClient from '@/components/portfolio/ExperienceDisplayer';

import { getLanguageAlternates, getBaseMetadata, SITE_URL, getBreadcrumbSchema } from '@/lib/seo';

import { getOrganizationExperiences } from '@/lib/data';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.Organization} | Faran Aiki`,
    description: dict.SEO_Organization_Description || "Faran Aiki's organization and activities",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.Organization} | Faran Aiki`,
      description: dict.SEO_Organization_Description || "Faran Aiki's organization and activities",
      url: `${SITE_URL}/${lang}/organization`,
    },
    alternates: { 
      canonical: `/${lang}/organization`,
      languages: getLanguageAlternates('/organization'),
    },
  };
}

export default async function OrganizationExperiencesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const nonce = (await headers()).get('x-nonce') || undefined;

  const organizationExperiences = getOrganizationExperiences(dict);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: dict.Home, item: `/${lang}` },
    { name: dict.Organization, item: `/${lang}/organization` },
  ]);

  return (
    <main className="w-full pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        nonce={nonce}
      />
      <ExperiencesClient 
        experiences={organizationExperiences} 
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
