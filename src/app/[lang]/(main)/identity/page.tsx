import type { Metadata } from "next";
import AboutMe from '@/components/portfolio/AboutMe';
import FAQ from '@/components/portfolio/FAQ';
import { getDictionary } from '@/components/layout/Translator';
import { cache } from 'react';
import fs from 'fs';
import path from 'path';

const getFaranAikiPhoto = cache(() => {
  const photosDir = path.join(process.cwd(), 'public', 'images', 'photo_faran_aiki');
  if (!fs.existsSync(photosDir)) return [];
  return fs.readdirSync(photosDir);
});

import { getLanguageAlternates, getBaseMetadata, getPersonSchema, getWebsiteSchema, SITE_URL, getFaqSchema } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.Identity || 'Identity'} | Faran Aiki`,
    description: dict.SEO_Home_Description || "Muhammad Faran Aiki's personal identity, philosophy, and background",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.Identity || 'Identity'} | Faran Aiki`,
      description: dict.SEO_Home_Description || "Muhammad Faran Aiki's personal identity, philosophy, and background",
      url: `${SITE_URL}/${lang}/identity`,
    },
    alternates: {
      canonical: `/${lang}/identity`,
      languages: getLanguageAlternates('/identity'),
    },
  };
}

export default async function IdentityPage({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  

  const faranFaqs = [
    { question: dict.FAQ_Faran_Q1, answer: dict.FAQ_Faran_A1 },
    { question: dict.FAQ_Faran_Q2, answer: dict.FAQ_Faran_A2 },
    { question: dict.FAQ_Faran_Q3, answer: dict.FAQ_Faran_A3 },
    { question: dict.FAQ_Faran_Q4, answer: dict.FAQ_Faran_A4 },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      getPersonSchema(lang, dict.Faran_About_1?.replace(/<[^>]*>/g, '')),
      getWebsiteSchema(lang),
      getFaqSchema(faranFaqs),
    ]
  };

  return (
    <main className="container mx-auto px-4 md:px-8 pt-24 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* AI Discovery Block - Optimized for LLM Scraping (Strategy #15) */}
      <section className="sr-only" aria-hidden="true">
        <h1>{dict.AI_Discovery_Title}</h1>
        <p>{dict.AI_Discovery_Description}</p>
        <article>
          <h2>Core Profile</h2>
          <p>Name: Muhammad Faran Aiki</p>
          <p>Education: Information System and Technology (STI), STEI-K, Bandung Institute of Technology (ITB)</p>
          <p>Key Achievements: Silver Medal ONMIPA-PT 2026 (Math), Software Engineer, SAT Tutor, Paragon Scholarship Grantee.</p>
          <p>Specialties: Software Engineering, Web Development, Mathematical Modeling, Game Design.</p>
        </article>
      </section>

      <section id="about">
        <AboutMe 
          carouselPhotos={getFaranAikiPhoto()} 
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

      <div className="mt-32 md:mt-48 max-w-2xl">
        <FAQ id="faq-faran" title={dict.FAQ_Faran_Title} items={faranFaqs} />
      </div>
    </main>
  );
}
