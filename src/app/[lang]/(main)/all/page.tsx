import type { Metadata } from "next";
import { Suspense } from "react";
import "../../../globals.css";
import { getDictionary } from '@/components/layout/Translator';
import type { Experience, Job } from '@/components/portfolio/ExperienceDisplayer';
import type { CertificateData } from '@/components/portfolio/CertificatesContext';
import type { CollectionsData } from '@/components/portfolio/InteractiveCollections';
import { PortfolioAboutHeader } from '@/components/portfolio/PortfolioAboutHeader';
import dynamic from 'next/dynamic';
import { Github, Linkedin, Instagram, Twitter, Youtube, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
const FAQ = dynamic(() => import('@/components/portfolio/FAQ'));
import type { SocialLink } from '@/components/portfolio/SocialDisplay';

import ExperiencesClient from '@/components/portfolio/ExperienceServerDisplayer';
const CertificatesDisplay = dynamic(() => import('@/components/portfolio/CertificatesDisplay'));
const InteractiveCollections = dynamic(() => import('@/components/portfolio/InteractiveCollections'));
const SocialDisplay = dynamic(() => import('@/components/portfolio/SocialDisplay'));

import { getLanguageAlternates, getBaseMetadata, getPersonSchema, getBreadcrumbSchema, getFaqSchema, SITE_URL } from '@/lib/seo';
import PageEntrance from "@/components/shared/PageEntrance";

import {
  getWorkExperiences,
  getProjectExperiences,
  getOrganizationExperiences,
  getAwardExperiences,
  getCertificatesData,
  getCollectionsData,
  getFaranAikiPhoto
} from '@/lib/data';

import { Briefcase, Code, Users, Trophy, FileCheck, Star } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.All || 'All'} | Faran Aiki`,
    description: dict.Portfolio_Description || "Explore the complete professional portfolio of Muhammad Faran Aiki. Discover a comprehensive showcase of software engineering projects, research papers, awards, and work experiences.",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.All || 'All'} | Faran Aiki`,
      description: dict.Portfolio_Description || "Explore the complete professional portfolio of Muhammad Faran Aiki. Discover a comprehensive showcase of software engineering projects, research papers, awards, and work experiences.",
      url: `${SITE_URL}/${lang}/all`,
    },
    alternates: {
      canonical: `/${lang}/all`,
      languages: getLanguageAlternates('/all'),
    },
  };
}


function AllContentSkeleton() {
  return (
    <div className="space-y-6 container mx-auto px-4 sm:px-8 mt-10">
      <div className="w-48 h-8 bg-black/10 dark:bg-white/10 rounded-lg animate-pulse mb-6"></div>
      <div className="w-full h-64 bg-black/5 dark:bg-white/5 rounded-2xl animate-pulse"></div>
      <div className="w-full h-64 bg-black/5 dark:bg-white/5 rounded-2xl animate-pulse mt-6"></div>
    </div>
  );
}

async function SuspendedAllContent({ lang, dict }: { lang: string, dict: Record<string, string> }) {
  const workExp = getWorkExperiences(dict);
  const projectExp = getProjectExperiences(dict);
  const orgExp = getOrganizationExperiences(dict);
  const awardExp = getAwardExperiences(dict);
  const certificatesData = await getCertificatesData(lang);
  const collegeData = await getCollectionsData(lang, 'college');
  const literatureData = await getCollectionsData(lang, 'literature');

  const isLoggedIn = false;
  const experienceBookmarks: string[] = [];
  const certificateBookmarks: string[] = [];
  const collectionBookmarks: string[] = [];
  
  // Filtering function for Experience structure (Point >= 80)
  const filterImportantExp = (exps: Experience[]): Experience[] => {
    return exps.map(yearGroup => ({
      ...yearGroup,
      jobs: yearGroup.jobs.filter((job: Job) => (job.point || 0) >= 80)
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
          if ((data[cat][year][file].point || 0) >= 80) {
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
          if ((data[h1][h2][file].point || 0) >= 80) {
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

  const importantSocialLinks: SocialLink[] = [
    {
      name: "GitHub",
      username: "FaranAiki",
      url: "https://github.com/FaranAiki",
      icon: <Github size={32} />,
      color: "hover:border-theme-border"
    },
    {
      name: "LinkedIn",
      username: "Muhammad Faran Aiki",
      url: "https://www.linkedin.com/in/faranaiki/",
      icon: <Linkedin size={32} className="text-theme-500" />,
      color: "hover:border-theme-500"
    },
    {
      name: "Instagram",
      username: "@mfaranaiki",
      url: "https://www.instagram.com/mfaranaiki/",
      icon: <Instagram size={32} className="text-pink-500" />,
      color: "hover:border-pink-500"
    },
    {
      name: "Twitter / X",
      username: "@FaranAiki",
      url: "https://x.com/FaranAiki",
      icon: <Twitter size={32} className="text-sky-500" />,
      color: "hover:border-sky-500"
    },
    {
      name: "Link Tree",
      username: "Faran Aiki",
      url: "https://linktr.ee/FaranAiki",
      icon: <Image alt="LinkTree Muhammad Faran Aiki Social Link" width="32" height="32" src="/images/social/linktree.webp" className="brightness-0 invert-[0.5] sepia-[1] hue-rotate-[70deg] saturate-[3]" />,
      color: "hover:border-green-200"
    },
    {
      name: "YouTube",
      username: "Muhammad Faran Aiki",
      url: "https://www.youtube.com/@FaranAiki",
      icon: <Youtube size={32} className="text-red-600" />,
      color: "hover:border-red-600"
    },
  ];

  const faranFaqs = [
    { question: dict.FAQ_Faran_Q1, answer: dict.FAQ_Faran_A1 },
    { question: dict.FAQ_Faran_Q2, answer: dict.FAQ_Faran_A2 },
    { question: dict.FAQ_Faran_Q3, answer: dict.FAQ_Faran_A3 },
    { question: dict.FAQ_Faran_Q4, answer: dict.FAQ_Faran_A4 },
    { question: dict.FAQ_Faran_Q5, answer: dict.FAQ_Faran_A5 },
    { question: dict.FAQ_Faran_Q6, answer: dict.FAQ_Faran_A6 },
  ];

  return (
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
              priorityImages={true}
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

      {/* Social Media Section */}
      <section id="social" className="space-y-4 container mx-auto px-4 sm:px-8 pb-12">
          <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-1.5">
              <Share2 size={18} className="text-theme-500" />
              <h2 className="text-lg md:text-xl font-bold tracking-tight text-black dark:text-white">{dict.Social}</h2>
          </div>
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden">
              <SocialDisplay customLinks={importantSocialLinks} hidePresentation={true} dict={dict} />
          </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 sm:px-8 pb-20">
          <FAQ title={dict.FAQ_Faran_Title} items={faranFaqs} />
      </section>
    </div>
  );
}

export default async function AllHighlightsPage({params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const faranPhotos = await getFaranAikiPhoto();
  
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
        <section id="about" className="container mx-auto px-4 sm:px-8">
          <div className="flex justify-end mb-4">
              <Link 
                  href={`/${lang}/portfolio`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-theme-surface-strong border border-theme-border hover:border-theme-500 transition-all font-bold text-xs text-[var(--text-muted)] hover:text-theme-500 group"
              >
                  <Star size={14} className="group-hover:animate-spin-slow" />
                  {dict.Summary || 'Summary'}
              </Link>
          </div>
          <PortfolioAboutHeader
            lang={lang}
            carouselPhotos={faranPhotos}
            faran_photo={dict.Faran_Photo}
            about_philosophy_title={dict.Faran_Philosophy_Title}
            about_philosophy={dict.Faran_Philosophy}
            about_principle_title={dict.Faran_Principle_Title}
            about_principle_1={dict.Faran_Principle_1}
            about_principle_2={dict.Faran_Principle_2}
            about_principle_3=""
            about_vision_mission_title={dict.Faran_Vision_Mission_Title}
            about_vision_mission_1={dict.Faran_Vision_Mission_1}
            about_vision_mission_2={dict.Faran_Vision_Mission_2}
            about_vision_mission_3={dict.Faran_Vision_Mission_3}
            about_title={dict.About_Me}
            about_text_1={dict.Faran_About_1}
            about_text_2={dict.Faran_About_2}
          />
        </section>

        {/* Streaming Data Section via Suspense */}
        <Suspense fallback={<AllContentSkeleton />}>
          <SuspendedAllContent lang={lang} dict={dict} />
        </Suspense>
      </PageEntrance>
    </main>
  );
}
