import type { Metadata } from "next";
import { headers } from "next/headers";
import { createClient } from '@/utils/supabase/server';
import { getBookmarks } from '@/app/bookmark-actions';

import "../../../globals.css";
import { getDictionary } from '@/components/layout/Translator';
import ExperiencesClient from '@/components/portfolio/ExperienceDisplayer';

import { getLanguageAlternates, getBaseMetadata, SITE_URL, getBreadcrumbSchema, getPersonSchema } from '@/lib/seo';

import { 
  getWorkExperiences, 
  getEducationExperiences, 
  getProjectExperiences, 
  getOrganizationExperiences, 
  getAwardExperiences,
  getCertificatesData
} from '@/lib/data';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.Timeline} | Faran Aiki`,
    description: dict.SEO_Timeline_Description || "Faran Aiki's Complete Timeline",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.Timeline} | Faran Aiki`,
      description: dict.SEO_Timeline_Description || "Faran Aiki's Complete Timeline",
      url: `${SITE_URL}/${lang}/timeline`,
    },
    alternates: { 
      canonical: `/${lang}/timeline`,
      languages: getLanguageAlternates('/timeline'),
    },
  };
}

export default async function TimelinePage({params }: { params: Promise<{ lang: string }> }) {
  const nonce = (await headers()).get("x-nonce") || "";
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;
  const bookmarks = isLoggedIn ? await getBookmarks(user.id) : [];
  const experienceBookmarks = bookmarks.filter(b => b.itemType === 'experience').map(b => b.itemId);

  const work = getWorkExperiences(dict);
  const edu = getEducationExperiences(dict);
  const proj = getProjectExperiences(dict);
  const org = getOrganizationExperiences(dict);
  const award = getAwardExperiences(dict);

  // Merge all experiences by year
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mergedMap = new Map<string, any[]>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addJobs = (experiences: any[]) => {
    experiences.forEach(exp => {
      const year = exp.year;
      if (!mergedMap.has(year)) mergedMap.set(year, []);
      mergedMap.get(year)!.push(...exp.jobs);
    });
  };

  addJobs(work);
  addJobs(edu);
  addJobs(proj);
  addJobs(org);
  addJobs(award);

  const certs = await getCertificatesData(lang);
  Object.entries(certs).forEach(([category, years]) => {
    Object.entries(years).forEach(([year, files]) => {
      if (!mergedMap.has(year)) mergedMap.set(year, []);
      const jobs = Object.entries(files).map(([fileName, data]) => ({
        date: year,
        title: fileName,
        company: dict.Certificate || 'Certificate',
        description: category,
        point: data.point || 60,
        image: [data.path],
        url: data.path,
        tag: [dict.Certificate || 'Certificate']
      }));
      mergedMap.get(year)!.push(...jobs);
    });
  });

  const allExperiences = Array.from(mergedMap.entries())
    .map(([year, jobs]) => ({
      year,
      // Sort jobs within a year by point descending (most impactful first)
      jobs: jobs.sort((a, b) => (b.point || 0) - (a.point || 0))
    }))
    .sort((a, b) => parseInt(b.year) - parseInt(a.year)); // Sort years descending

  const personSchema = getPersonSchema(lang);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: dict.Home, item: `/${lang}` },
    { name: dict.Timeline, item: `/${lang}/timeline` },
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
      <script nonce={nonce}         type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="pt-[12px] w-full px-4 md:px-0">
        <ExperiencesClient 
        isLoggedIn={isLoggedIn}
        bookmarkedItemIds={experienceBookmarks}
        layout="timeline"
        experiences={allExperiences} 
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
