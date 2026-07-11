import type { Metadata } from "next";
import "../../../globals.css";
import { getDictionary } from '@/components/layout/Translator';
import type { Experience, Job } from '@/components/portfolio/ExperienceDisplayer';
import type { CertificateData } from '@/components/portfolio/CertificatesContext';
import type { CollectionsData } from '@/components/portfolio/InteractiveCollections';
import { redirect } from 'next/navigation';

import dynamic from 'next/dynamic';

const ExperiencesClient = dynamic(() => import('@/components/portfolio/ExperienceServerDisplayer'));
const CertificatesDisplay = dynamic(() => import('@/components/portfolio/CertificatesDisplay'));
const InteractiveCollections = dynamic(() => import('@/components/portfolio/InteractiveCollections'));

import { getLanguageAlternates, getBaseMetadata, getPersonSchema, getBreadcrumbSchema, getFaqSchema, SITE_URL } from '@/lib/seo';
import PageEntrance from "@/components/shared/PageEntrance";

import {
  getWorkExperiences,
  getProjectExperiences,
  getOrganizationExperiences,
  getAwardExperiences,
  getCertificatesData,
  getCollectionsData
} from '@/lib/data';

import { Briefcase, Code, Users, Trophy, FileCheck, Star } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { getBookmarks } from '@/app/bookmark-actions';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.My_Bookmarks || 'My Bookmarks'} | Faran Aiki`,
    description: dict.Portfolio_Description || "Full professional portfolio and highlights of Muhammad Faran Aiki",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.My_Bookmarks || 'My Bookmarks'} | Faran Aiki`,
      description: dict.Portfolio_Description || "Full professional portfolio and highlights of Muhammad Faran Aiki",
      url: `${SITE_URL}/${lang}/all`,
    },
    alternates: {
      canonical: `/${lang}/bookmarks`,
      languages: getLanguageAlternates('/bookmarks'),
    },
  };
}

export default async function BookmarksPage({params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const workExp = getWorkExperiences(dict);
  const projectExp = getProjectExperiences(dict);
  const orgExp = getOrganizationExperiences(dict);
  const awardExp = getAwardExperiences(dict);
  const certificatesData = await getCertificatesData(lang);
  const collegeData = await getCollectionsData(lang, 'college');
  const literatureData = await getCollectionsData(lang, 'literature');

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;
  
  if (!isLoggedIn) {
      redirect(`/${lang}/login?next=/${lang}/bookmarks`);
  }

  const bookmarks = isLoggedIn ? await getBookmarks(user.id) : [];
  const certificateBookmarks = bookmarks.filter(b => b.itemType === 'certificate').map(b => b.itemId);
  const experienceBookmarks = bookmarks.filter(b => b.itemType === 'experience').map(b => b.itemId);
  const collectionBookmarks = bookmarks.filter(b => b.itemType === 'collection').map(b => b.itemId);


  // Filtering function for Experience structure (Point >= 80)
  const filterImportantExp = (exps: Experience[]): Experience[] => {
    return exps.map(yearGroup => ({
      ...yearGroup,
      jobs: yearGroup.jobs.filter((job: Job) => bookmarks.some(b => b.itemType === 'experience' && b.itemId === (job.image?.[0] ?? job.url ?? job.company ?? job.title)))
    })).filter(yearGroup => yearGroup.jobs.length > 0);
  };

  const importantWork = filterImportantExp(workExp);
  const importantProjects = filterImportantExp(projectExp);
  const importantOrg = filterImportantExp(orgExp);
  const importantAwards = filterImportantExp(awardExp);

  // Filter Certificates (Point >= 80)
  const filterImportantCerts = (data: CertificateData): CertificateData => {
    const filtered: CertificateData = {};
    for (const cat in data) {
      for (const year in data[cat]) {
        for (const file in data[cat][year]) {
          if (bookmarks.some(b => b.itemType === 'certificate' && b.itemId === file)) {
            if (!filtered[cat]) filtered[cat] = {};
            if (!filtered[cat][year]) filtered[cat][year] = {};
            filtered[cat][year][file] = data[cat][year][file];
          }
        }
      }
    }
    return filtered;
  };

  const importantCerts = filterImportantCerts(certificatesData);

  // Filter Collections (Point >= 80)
  const filterImportantCollections = (data: CollectionsData): CollectionsData => {
    const filtered: CollectionsData = {};
    for (const h1 in data) {
      for (const h2 in data[h1]) {
        for (const file in data[h1][h2]) {
          if (bookmarks.some(b => b.itemType === 'collection' && b.itemId === file)) {
            if (!filtered[h1]) filtered[h1] = {};
            if (!filtered[h1][h2]) filtered[h1][h2] = {};
            filtered[h1][h2][file] = data[h1][h2][file];
          }
        }
      }
    }
    return filtered;
  };

  const importantCollege = filterImportantCollections(collegeData);
  const importantLiterature = filterImportantCollections(literatureData);


  const faranFaqs = [
    { question: dict.FAQ_Faran_Q1, answer: dict.FAQ_Faran_A1 },
    { question: dict.FAQ_Faran_Q2, answer: dict.FAQ_Faran_A2 },
    { question: dict.FAQ_Faran_Q3, answer: dict.FAQ_Faran_A3 },
    { question: dict.FAQ_Faran_Q4, answer: dict.FAQ_Faran_A4 },
    { question: dict.FAQ_Faran_Q5, answer: dict.FAQ_Faran_A5 },
    { question: dict.FAQ_Faran_Q6, answer: dict.FAQ_Faran_A6 },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      getPersonSchema(lang, dict.Faran_About_1?.replace(/<[^>]*>/g, '')),
      getBreadcrumbSchema([
        { name: dict.Home, item: `/${lang}` },
        { name: dict.All || 'All', item: `/${lang}/all` },
      ]),
      getFaqSchema(faranFaqs),
    ]
  };

  return (
    <main className="w-full pt-20 pb-20 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageEntrance className="space-y-6">
        {/* Refined Portfolio Header */}
        <section className="container mx-auto px-4 sm:px-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4 nav-active-gacor flex items-center gap-4">
            <Star size={40} className="text-theme-500" />
            {dict.My_Bookmarks || 'My Bookmarks'}
          </h1>
          <p className="text-theme-muted font-bold max-w-2xl text-lg">
            {dict.Bookmarks_Description || 'Here are all the items you have bookmarked.'}
          </p>
        </section>

        {/* Professional Content - High Point Highlights */}
        <div className="space-y-6">
          {/* Work & Projects - High Impact Full Width */}
          {importantWork.length > 0 && (
            <section id="work" className="space-y-2">
              <div className="container mx-auto px-4 sm:px-8">
                  <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-1.5">
                      <Briefcase size={18} className="text-theme-500" />
                      <h2 className="text-lg md:text-xl font-bold tracking-tight text-black dark:text-white">{dict.Work}</h2>
                  </div>
              </div>
              <div className="pt-[12px] w-full px-4 md:px-0">
        <ExperiencesClient
                experiences={importantWork}
                lang={lang}
                layout="bento"
                canChange={false}
                click_to_close_text={dict.Click_To_Close}
                modern_text={dict.Presentation_Modern}
                cinematic_text={dict.Presentation_Cinematic}
                editorial_text={dict.Presentation_Editorial}
            visit_external_link_text={dict.Visit_External_Link}
            hover_to_preview_text={dict.Hover_To_Preview}
            hover_an_experience_text={dict.Hover_An_Experience}
            visit_project_text={dict.Visit_Project}
                isLoggedIn={isLoggedIn}
                bookmarkedItemIds={experienceBookmarks}
              />
      </div>
            </section>
          )}

          {importantProjects.length > 0 && (
            <section id="projects" className="space-y-2">
              <div className="container mx-auto px-4 sm:px-8">
                  <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-1.5">
                      <Code size={18} className="text-theme-500" />
                      <h2 className="text-lg md:text-xl font-bold tracking-tight text-black dark:text-white">{dict.Project}</h2>
                  </div>
              </div>
              <div className="pt-[12px] w-full px-4 md:px-0">
        <ExperiencesClient
                experiences={importantProjects}
                lang={lang}
                layout="original"
                canChange={false}
                click_to_close_text={dict.Click_To_Close}
                modern_text={dict.Presentation_Modern}
                cinematic_text={dict.Presentation_Cinematic}
                editorial_text={dict.Presentation_Editorial}
            visit_external_link_text={dict.Visit_External_Link}
            hover_to_preview_text={dict.Hover_To_Preview}
            hover_an_experience_text={dict.Hover_An_Experience}
            visit_project_text={dict.Visit_Project}
                isLoggedIn={isLoggedIn}
                bookmarkedItemIds={experienceBookmarks}
              />
      </div>
            </section>
          )}

          {/* Side-by-Side Organizations and Awards on Desktop */}
          {(importantOrg.length > 0 || importantAwards.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 container mx-auto px-4 sm:px-8">
              {importantOrg.length > 0 && (
                <section id="organizations" className="space-y-2">
                  <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-1.5">
                      <Users size={18} className="text-theme-500" />
                      <h2 className="text-lg md:text-xl font-bold tracking-tight text-black dark:text-white">{dict.Organization}</h2>
                  </div>
                  <div className="lg:contents">
                    <div className="pt-[12px] w-full px-4 md:px-0">
        <ExperiencesClient
                      experiences={importantOrg}
                      lang={lang}
                      layout="timeline"
                      canChange={false}
                      click_to_close_text={dict.Click_To_Close}
                      modern_text={dict.Presentation_Modern}
                      cinematic_text={dict.Presentation_Cinematic}
                      editorial_text={dict.Presentation_Editorial}
            visit_external_link_text={dict.Visit_External_Link}
            hover_to_preview_text={dict.Hover_To_Preview}
            hover_an_experience_text={dict.Hover_An_Experience}
            visit_project_text={dict.Visit_Project}
                      isLoggedIn={isLoggedIn}
                      bookmarkedItemIds={experienceBookmarks}
                    />
      </div>
                  </div>
                </section>
              )}

              {importantAwards.length > 0 && (
                <section id="awards" className="space-y-2">
                  <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-1.5">
                      <Trophy size={18} className="text-theme-500" />
                      <h2 className="text-lg md:text-xl font-bold tracking-tight text-black dark:text-white">{dict.Award}</h2>
                  </div>
                  <div className="lg:contents">
                    <div className="pt-[12px] w-full px-4 md:px-0">
        <ExperiencesClient
                      experiences={importantAwards}
                      lang={lang}
                      layout="timeline"
                      canChange={false}
                      click_to_close_text={dict.Click_To_Close}
                      modern_text={dict.Presentation_Modern}
                      cinematic_text={dict.Presentation_Cinematic}
                      editorial_text={dict.Presentation_Editorial}
            visit_external_link_text={dict.Visit_External_Link}
            hover_to_preview_text={dict.Hover_To_Preview}
            hover_an_experience_text={dict.Hover_An_Experience}
            visit_project_text={dict.Visit_Project}
                      isLoggedIn={isLoggedIn}
                      bookmarkedItemIds={experienceBookmarks}
                    />
      </div>
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Certificates - Visual Grid */}
          {Object.keys(importantCerts).length > 0 && (
            <section id="certificates" className="space-y-4">
              <div className="container mx-auto px-4 sm:px-8">
                  <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-1.5">
                      <FileCheck size={18} className="text-theme-500" />
                      <h2 className="text-lg md:text-xl font-bold tracking-tight text-black dark:text-white">{dict.Certificate}</h2>
                  </div>
              </div>
              <CertificatesDisplay certificates={importantCerts} lang={lang} allTranslation={dict.All} click_to_close_text={dict.Click_To_Close} isLoggedIn={isLoggedIn} bookmarkedItemIds={certificateBookmarks} />
            </section>
          )}

          {/* Highlighted Materials - Side-by-Side on Desktop */}
          {(Object.keys(importantCollege).length > 0 || Object.keys(importantLiterature).length > 0) && (
            <section id="highlights" className="space-y-4 container mx-auto px-4 sm:px-8">
              <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-1.5">
                  <Star size={18} className="text-theme-500" />
                  <h2 className="text-lg md:text-xl font-bold tracking-tight text-black dark:text-white">{dict.Important_Highlights}</h2>
              </div>            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {Object.keys(importantCollege).length > 0 && (
                      <InteractiveCollections data={importantCollege} lang={lang} force_click={true} isLoggedIn={isLoggedIn} bookmarkedItemIds={collectionBookmarks} />
                  )}
                  {Object.keys(importantLiterature).length > 0 && (
                      <InteractiveCollections data={importantLiterature} lang={lang} force_click={true} isLoggedIn={isLoggedIn} bookmarkedItemIds={collectionBookmarks} />
                  )}
              </div>
            </section>
          )}


          </div>
          </PageEntrance>
          </main>
          );
          }
