import type { Metadata } from "next";
import React from 'react';
import AboutMe from '@/components/AboutMe';
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
  } catch (error) {
    return { items: [], error: "Cannot load playlist (Network Error)." };
  }
}

const SectionTitle = ({ title, icon }: { title: string, icon?: React.ReactNode }) => (
  <div className="flex items-center justify-center gap-4 mb-12 pt-24">
    <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent flex-1" />
    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase flex items-center gap-3">
      {icon}
      {title}
    </h2>
    <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent flex-1" />
  </div>
);

export default async function AllPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  
  // Data gathering
  const photos = getFaranAikiPhoto();
  const work = getWorkExperiences(dict);
  const projects = getProjectExperiences(dict);
  const orgs = getOrganizationExperiences(dict);
  const awards = getAwardExperiences(dict);
  const music = await getMusicData();
  const literature = getCollectionsDataSync(lang, 'literature');
  const college = getCollectionsDataSync(lang, 'college');
  const certificates = getCertificatesDataSync(lang);

  return (
    <main className="w-full pb-32">
      {/* 1. About Me */}
      <section id="about" className="container mx-auto px-4 md:px-8 pt-24">
        <AboutMe 
          carouselPhotos={photos} 
          faran_photo={dict.Faran_Photo}
          about_philosophy_title={dict.Faran_Philosophy_Title} 
          about_philosophy={dict.Faran_Philosophy}
          about_principle_title={dict.Faran_Principle_Title} 
          about_principle_1={dict.Faran_Principle_1}
          about_principle_2={dict.Faran_Principle_2}
          about_principle_3={dict.Faran_Principle_3} 
          about_vision_mission_title={dict.Faran_Vision_Mission_Title} 
          about_vision_mission_1={dict.Faran_Vision_Mission_1}
          about_vision_mission_2={dict.Faran_Vision_Mission_2}
          about_vision_mission_3={dict.Faran_Vision_Mission_3}
          about_title={dict.About_Me} 
          about_text_1={dict.Faran_About_1} 
          about_text_2={dict.Faran_About_2} 
          lang={lang}
        />
      </section>

      {/* 2. Work - Original Layout */}
      <section id="work">
        <SectionTitle title={dict.Work} />
        <ExperiencesClient experiences={work} lang={lang} layout="original" canChange={true} />
      </section>

      {/* 3. Projects - Modern Layout */}
      <section id="project">
        <SectionTitle title={dict.Project} />
        <ExperiencesClient experiences={projects} lang={lang} layout="modern" canChange={true} />
      </section>

      {/* 4. Organization - Original Layout */}
      <section id="organization">
        <SectionTitle title={dict.Organization} />
        <ExperiencesClient experiences={orgs} lang={lang} layout="original" canChange={true} />
      </section>

      {/* 5. Awards - Compact Layout */}
      <section id="award">
        <SectionTitle title={dict.Award} />
        <ExperiencesClient experiences={awards} lang={lang} layout="compact" canChange={true} />
      </section>

      {/* 6. Social */}
      <section id="social" className="min-h-screen">
        <SectionTitle title={dict.Social} />
        <SocialDisplay />
      </section>

      {/* 7. Certificates */}
      <section id="certificate" className="min-h-screen">
        <SectionTitle title={dict.Certificate} />
        <React.Suspense fallback={<h2 className="text-center">{dict.Loading_Certificate}</h2>}>
          <CertificateLoader certificates={certificates} allTranslation={dict.All} lang={lang} />
        </React.Suspense>
      </section>

      {/* 8. Music */}
      <section id="music" className="min-h-screen">
        <SectionTitle title={dict.Music} />
        <MusicDisplay youtubeItems={music.items} error={music.error} lang={lang} />
      </section>

      {/* 9. Literature */}
      <section id="literature" className="container mx-auto px-6">
        <SectionTitle title={dict.Literature} />
        <LiteratureLoader data={literature} force_click={true} lang={lang} />
      </section>

      {/* 10. College */}
      <section id="college" className="container mx-auto px-6">
        <SectionTitle title={dict.College} />
        <React.Suspense fallback={<h2 className="text-center">{dict.Loading_College}</h2>}>
          <CollegeLoader data={college} force_click={false} lang={lang} />
        </React.Suspense>
      </section>
    </main>
  );
}
