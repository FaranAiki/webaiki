import type { Metadata } from "next";

import "../../../globals.css";
import { Suspense } from "react";
import { getDictionary } from '@/components/layout/Translator';
import ExperiencesClient, { Experience, Job } from '@/components/portfolio/ExperienceDisplayer';
import { ExperienceTimelineServer } from '@/components/portfolio/server/ExperienceTimelineServer';

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
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','timeline']);
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

function TimelineSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-10">
      <div className="w-full h-[80vh] bg-black/5 dark:bg-white/5 rounded-2xl animate-pulse"></div>
    </div>
  );
}

async function SuspendedTimelineContent({ lang, dict }: { lang: string, dict: Record<string, string> }) {
  const isLoggedIn = false;
  const experienceBookmarks: string[] = [];

  const work = getWorkExperiences(dict);
  const edu = getEducationExperiences(dict);
  const proj = getProjectExperiences(dict);
  const org = getOrganizationExperiences(dict);
  const award = getAwardExperiences(dict);

  const mergedMap = new Map<string, Job[]>();
  const addJobs = (experiences: Experience[]) => {
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
    Object.entries(years as Record<string, Record<string, { path: string, point?: number }>>).forEach(([year, files]) => {
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

  return (
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
        timelineLayout={
          <ExperienceTimelineServer 
            experiences={allExperiences} 
            isLoggedIn={isLoggedIn} 
            bookmarkedItemIds={experienceBookmarks} 
          />
        }
      />
      </div>
  );
}

export default async function TimelinePage({params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','timeline']);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<TimelineSkeleton />}>
        <SuspendedTimelineContent lang={lang} dict={dict} />
      </Suspense>
    </main>
  );
}
