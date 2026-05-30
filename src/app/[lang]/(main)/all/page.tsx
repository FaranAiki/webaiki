import type { Metadata } from "next";
import React from 'react';
import { 
  AboutSection, 
  PhilosophySection, 
  PrinciplesSection, 
  VisionMissionSection 
} from '@/components/AboutMe';
import ExperiencesClient from '@/components/ExperienceDisplayer';
import MusicDisplay from '@/components/MusicDisplay';
import SocialDisplay from '@/components/SocialDisplay';
import CertificateLoader from '../certificate/certificate-loader';
import LiteratureLoader from '../literature/literature-loader';
import CollegeLoader from '../college/college-loader';

import { getDictionary } from '@/components/Translator';
import { 
  getFaranAikiPhoto, 
  getWorkExperiences, 
  getProjectExperiences, 
  getOrganizationExperiences, 
  getAwardExperiences,
  getCollectionsDataSync,
  getCertificatesDataSync
} from '@/lib/data';

import { getLanguageAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL('https://faranaiki.id'),
    title: `${dict.All || 'All'} | Faran Aiki`,
    description: "Faran Aiki's complete portfolio and collections",
    openGraph: {
      title: `${dict.All || 'All'} | Faran Aiki`,
      description: "Faran Aiki's complete portfolio and collections",
      url: `https://faranaiki.id/${lang}/all`,
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
      canonical: `/${lang}/all`,
      languages: getLanguageAlternates('/all'),
    },
  };
}

const YOUTUBE_PLAYLIST_ITEMS_API = "https://www.googleapis.com/youtube/v3/playlistItems";

async function getMusicData() {
  try {
    const res = await fetch(`${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=PLh4mbEw6q2QncQrgz5uaLYAcTA0MolCTe&key=${process.env.YOUTUBE_API_KEY}&maxResults=50`, { next: { revalidate: 3600 } });
    if (res.ok) {
        const youtubeData = await res.json();
        return { items: youtubeData.items || [], error: undefined };
    }
    return { items: [], error: "Cannot load playlist (API Error)." };
  } catch {
    return { items: [], error: "Cannot load playlist (Network Error)." };
  }
}

const SectionTitle = ({ title, icon }: { title: string, icon?: React.ReactNode }) => (
  <div className="flex items-center gap-4 mb-8 pt-12">
    <div className="h-8 w-1 bg-cyan-500 rounded-full" />
    <h2 className="text-xl md:text-2xl font-black tracking-tighter uppercase flex items-center gap-3">
      {icon}
      {title}
    </h2>
    <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1 ml-2" />
  </div>
);

export default async function AllPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  
  const photos = getFaranAikiPhoto();
  const work = getWorkExperiences(dict);
  const projects = getProjectExperiences(dict);
  const orgs = getOrganizationExperiences(dict);
  const awards = getAwardExperiences(dict);
  const music = await getMusicData();
  const literature = getCollectionsDataSync(lang, 'literature');
  const college = getCollectionsDataSync(lang, 'college');
  const certificates = getCertificatesDataSync(lang);

  const commonProps = {
    carouselPhotos: photos,
    faran_photo: dict.Faran_Photo,
    about_philosophy_title: dict.Faran_Philosophy_Title,
    about_philosophy: dict.Faran_Philosophy,
    about_principle_title: dict.Faran_Principle_Title,
    about_principle_1: dict.Faran_Principle_1,
    about_principle_2: dict.Faran_Principle_2,
    about_principle_3: dict.Faran_Principle_3,
    about_vision_mission_title: dict.Faran_Vision_Mission_Title,
    about_vision_mission_1: dict.Faran_Vision_Mission_1,
    about_vision_mission_2: dict.Faran_Vision_Mission_2,
    about_vision_mission_3: dict.Faran_Vision_Mission_3,
    about_title: dict.About_Me,
    about_text_1: dict.Faran_About_1,
    about_text_2: dict.Faran_About_2,
    lang,
    isCompact: true,
    titleClass: "text-black dark:text-white",
    textClass: "text-black dark:text-gray-200",
  };

  const commonExpProps = {
    lang,
    canChange: false,
    original_text: dict.Original,
    timeline_text: dict.Timeline,
    grid_text: dict.Grid
  };

  return (
    <main className="w-full flex flex-col items-center pb-32 bg-gray-50/30 dark:bg-black/20">
      
      <div className="w-full max-w-[1600px] px-4 md:px-8 xl:px-12 flex flex-col gap-16 pt-24">
        
        {/* --- PERSONAL BRANDING GROUP --- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-20">
          <section id="about">
            <AboutSection {...commonProps} />
          </section>
          <section id="philosophy">
            <PhilosophySection {...commonProps} />
          </section>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-20 border-t border-gray-100 dark:border-gray-900 pt-16">
          <section id="principles">
            <PrinciplesSection {...commonProps} />
          </section>
          <section id="vision">
            <VisionMissionSection {...commonProps} />
          </section>
        </div>

        {/* --- PROFESSIONAL CORE GROUP --- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 lg:gap-x-20 items-start border-t border-gray-100 dark:border-gray-900 pt-8">
          <section id="work" className="w-full">
            <SectionTitle title={dict.Work} />
            <ExperiencesClient experiences={work} layout="original" {...commonExpProps} />
          </section>

          <section id="project" className="w-full">
            <SectionTitle title={dict.Project} />
            <ExperiencesClient experiences={projects} layout="timeline" {...commonExpProps} />
          </section>
        </div>

        {/* --- ENGAGEMENT GROUP --- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 lg:gap-x-20 items-start border-t border-gray-100 dark:border-gray-900 pt-8">
          <section id="organization" className="w-full">
            <SectionTitle title={dict.Organization} />
            <ExperiencesClient experiences={orgs} layout="original" {...commonExpProps} />
          </section>

          <section id="award" className="w-full">
            <SectionTitle title={dict.Award} />
            <div className="px-4 md:px-12">
              <ExperiencesClient experiences={awards} layout="grid" {...commonExpProps} />
            </div>
          </section>
        </div>

        {/* --- SKILLS & OUTPUT GROUP --- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-20 items-start border-t border-gray-100 dark:border-gray-900 pt-8">
          <section id="certificate" className="w-full min-h-[40vh]">
            <SectionTitle title={dict.Certificate} />
            <React.Suspense fallback={<h2 className="text-center">{dict.Loading_Certificate}</h2>}>
              <CertificateLoader certificates={certificates} allTranslation={dict.All} lang={lang} />
            </React.Suspense>
          </section>

          <section id="literature" className="w-full">
            <SectionTitle title={dict.Literature} />
            <LiteratureLoader data={literature} force_click={true} lang={lang} />
          </section>
        </div>

        {/* --- PRESENCE & AUDIO GROUP --- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-20 items-start border-t border-gray-100 dark:border-gray-900 pt-8">
          <section id="social" className="w-full">
            <SectionTitle title={dict.Social} />
            <SocialDisplay />
          </section>

          <section id="music" className="w-full min-h-[40vh]">
            <SectionTitle title={dict.Music} />
            <MusicDisplay youtubeItems={music.items} error={music.error} lang={lang} />
          </section>
        </div>

        {/* --- ACADEMIC FOUNDATION --- */}
        <section id="college" className="w-full border-t border-gray-100 dark:border-gray-900 pt-8 pb-16">
          <SectionTitle title={dict.College} />
          <React.Suspense fallback={<h2 className="text-center">{dict.Loading_College}</h2>}>
            <CollegeLoader data={college} force_click={false} lang={lang} />
          </React.Suspense>
        </section>

      </div>
    </main>
  );
}
