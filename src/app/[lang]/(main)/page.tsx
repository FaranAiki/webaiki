import type { Metadata } from "next";
import AboutMe from '@/components/AboutMe';
import FAQ from '@/components/FAQ';
import { getDictionary } from '@/components/Translator';
import { cache } from 'react';
import fs from 'fs';
import path from 'path';

export const getFaranAikiPhoto = cache(() => {
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
    title: `${dict.About_Me} | Faran Aiki`,
    description: dict.SEO_Home_Description || "Muhammad Faran Aiki's personal files, portfolio, and others",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.About_Me} | Faran Aiki`,
      description: dict.SEO_Home_Description || "Muhammad Faran Aiki's personal files, portfolio, and others",
      url: `${SITE_URL}/${lang}`,
    },
    alternates: {
      canonical: `/${lang}`,
      languages: getLanguageAlternates(''),
    },
  };
}

export default async function HomePage({ 
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

  const websiteFaqs = [
    { question: dict.FAQ_Website_Q1, answer: dict.FAQ_Website_A1 },
    { question: dict.FAQ_Website_Q2, answer: dict.FAQ_Website_A2 },
    { question: dict.FAQ_Website_Q3, answer: dict.FAQ_Website_A3 },
    { question: dict.FAQ_Website_Q4, answer: dict.FAQ_Website_A4 },
    { question: dict.FAQ_Website_Q5, answer: dict.FAQ_Website_A5 },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      getPersonSchema(lang, dict.Faran_About_1?.replace(/<[^>]*>/g, '')),
      getWebsiteSchema(lang),
      getFaqSchema([...faranFaqs, ...websiteFaqs]),
    ]
  };

  return (
    <main className="container mx-auto px-4 md:px-8 pt-24 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-32 md:mt-48">
        <FAQ id="faq-faran" title={dict.FAQ_Faran_Title} items={faranFaqs} />
        <FAQ id="faq-website" title={dict.FAQ_Website_Title} items={websiteFaqs} />
      </div>
    </main>
  );
}
