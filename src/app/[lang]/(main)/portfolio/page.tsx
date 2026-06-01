import type { Metadata } from "next";
import "../../../globals.css";
import { getDictionary } from '@/components/Translator';
import ExperiencesClient, { Experience, Job } from '@/components/ExperienceDisplayer';
import CertificatesDisplay, { CertificateData } from '@/components/CertificatesDisplay';
import InteractiveCollections, { CollectionsData } from '@/components/InteractiveCollections';
import { PortfolioAboutHeader } from '@/components/AboutMe';

import { getLanguageAlternates } from '@/lib/seo';

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

  return {
    metadataBase: new URL('https://faranaiki.id'),
    title: `${dict.Portfolio} | Faran Aiki`,
    description: "Full professional portfolio and highlights of Muhammad Faran Aiki",
    openGraph: {
      title: `${dict.Portfolio} | Faran Aiki`,
      description: "Full professional portfolio and highlights of Muhammad Faran Aiki",
      url: `https://faranaiki.id/${lang}/portfolio`,
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
    icons: { icon: '/icon.ico', shortcut: '/icon.ico', apple: '/icon.ico' },
    alternates: {
      canonical: `/${lang}/portfolio`,
      languages: getLanguageAlternates('/portfolio'),
    },
  };
}

export default async function PortfolioHighlightsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const faranPhotos = await getFaranAikiPhoto();

  const workExp = getWorkExperiences(dict);
  const projectExp = getProjectExperiences(dict);
  const orgExp = getOrganizationExperiences(dict);
  const awardExp = getAwardExperiences(dict);
  const certificatesData = await getCertificatesData(lang);
  const collegeData = await getCollectionsData(lang, 'college');
  const literatureData = await getCollectionsData(lang, 'literature');

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

  return (
    <main className="w-full pt-20 pb-20 space-y-6">
      {/* Refined Portfolio Header */}
      <section className="container mx-auto px-4 sm:px-8">
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

      {/* Professional Content - High Point Highlights */}
      <div className="space-y-6">
        {/* Work & Projects - High Impact Full Width */}
        {importantWork.length > 0 && (
          <section className="space-y-2">
            <div className="container mx-auto px-4 sm:px-8">
                <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-1.5">
                    <Briefcase size={18} className="text-cyan-500" />
                    <h2 className="text-lg md:text-xl font-bold tracking-tight text-black dark:text-white">{dict.Work}</h2>
                </div>
            </div>
            <ExperiencesClient
              experiences={importantWork}
              lang={lang}
              layout="bento"
              canChange={false}
              click_to_close_text={dict.Click_To_Close}
              modern_text={dict.Presentation_Modern}
              cinematic_text={dict.Presentation_Cinematic}
              editorial_text={dict.Presentation_Editorial}
            />
          </section>
        )}

        {importantProjects.length > 0 && (
          <section className="space-y-2">
            <div className="container mx-auto px-4 sm:px-8">
                <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-1.5">
                    <Code size={18} className="text-purple-500" />
                    <h2 className="text-lg md:text-xl font-bold tracking-tight text-black dark:text-white">{dict.Project}</h2>
                </div>
            </div>
            <ExperiencesClient
              experiences={importantProjects}
              lang={lang}
              layout="original"
              canChange={false}
              click_to_close_text={dict.Click_To_Close}
              modern_text={dict.Presentation_Modern}
              cinematic_text={dict.Presentation_Cinematic}
              editorial_text={dict.Presentation_Editorial}
            />
          </section>
        )}

        {/* Side-by-Side Organizations and Awards on Desktop */}
        {(importantOrg.length > 0 || importantAwards.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 container mx-auto px-4 sm:px-8">
            {importantOrg.length > 0 && (
              <section className="space-y-2">
                <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-1.5">
                    <Users size={18} className="text-blue-500" />
                    <h2 className="text-lg md:text-xl font-bold tracking-tight text-black dark:text-white">{dict.Organization}</h2>
                </div>
                <div className="lg:contents">
                   <ExperiencesClient
                     experiences={importantOrg}
                     lang={lang}
                     layout="timeline"
                     canChange={false}
                     click_to_close_text={dict.Click_To_Close}
                     modern_text={dict.Presentation_Modern}
                     cinematic_text={dict.Presentation_Cinematic}
                     editorial_text={dict.Presentation_Editorial}
                   />
                </div>
              </section>
            )}

            {importantAwards.length > 0 && (
              <section className="space-y-2">
                <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-1.5">
                    <Trophy size={18} className="text-yellow-500" />
                    <h2 className="text-lg md:text-xl font-bold tracking-tight text-black dark:text-white">{dict.Award}</h2>
                </div>
                <div className="lg:contents">
                  <ExperiencesClient
                    experiences={importantAwards}
                    lang={lang}
                    layout="timeline"
                    canChange={false}
                    click_to_close_text={dict.Click_To_Close}
                    modern_text={dict.Presentation_Modern}
                    cinematic_text={dict.Presentation_Cinematic}
                    editorial_text={dict.Presentation_Editorial}
                  />
                </div>
              </section>
            )}
          </div>
        )}

        {/* Certificates - Visual Grid */}
        {Object.keys(importantCerts).length > 0 && (
          <section className="space-y-4">
            <div className="container mx-auto px-4 sm:px-8">
                <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-1.5">
                    <FileCheck size={18} className="text-emerald-500" />
                    <h2 className="text-lg md:text-xl font-bold tracking-tight text-black dark:text-white">{dict.Certificate}</h2>
                </div>
            </div>
            <CertificatesDisplay certificates={importantCerts} lang={lang} allTranslation={dict.All} click_to_close_text={dict.Click_To_Close} />
          </section>
        )}

        {/* Highlighted Materials - Side-by-Side on Desktop */}
        {(Object.keys(importantCollege).length > 0 || Object.keys(importantLiterature).length > 0) && (
          <section className="space-y-4 container mx-auto px-4 sm:px-8">
            <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-1.5">
                <Star size={18} className="text-rose-500" />
                <h2 className="text-lg md:text-xl font-bold tracking-tight text-black dark:text-white">{dict.Important_Highlights}</h2>
            </div>            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Object.keys(importantCollege).length > 0 && (
                    <InteractiveCollections data={importantCollege} lang={lang} force_click={true} />
                )}
                {Object.keys(importantLiterature).length > 0 && (
                    <InteractiveCollections data={importantLiterature} lang={lang} force_click={true} />
                )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
