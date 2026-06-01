import React from 'react';
import { getDictionary } from '@/components/Translator';
import PortfolioClient from './PortfolioClient';

import { getLanguageAlternates } from '@/lib/seo';

export async function generateMetadata({ 
  params,
  searchParams 
}: { 
  params: Promise<{ lang: string }>,
  searchParams: Promise<{ type?: string }>
}) {
  const { lang } = await params;
  const { type } = await searchParams;
  const dict = await getDictionary(lang);

  const title = type === 'it' ? dict.Portfolio_IT : 
                type === 'tutor' ? dict.Portfolio_Tutor : 
                dict.Portfolio_Summary;

  const query = type ? `?type=${type}` : '';

  return {
    metadataBase: new URL('https://faranaiki.id'),
    title: `${title} | Faran Aiki`,
    description: `Professional Portfolio of Muhammad Faran Aiki - ${dict.Software_Engineer} & ${dict.SAT_Tutor}`,
    openGraph: {
      title: `${title} | Faran Aiki`,
      description: `Professional Portfolio of Muhammad Faran Aiki - ${dict.Software_Engineer} & ${dict.SAT_Tutor}`,
      url: `https://faranaiki.id/${lang}/portfolio${query}`,
      siteName: "faranaiki.id",
      type: "website",
      images: [
        {
          url: '/images/photo_faran_aiki/1_fa_photo_linkedin.webp',
          width: 1200,
          height: 630,
          alt: 'Faran Aiki Portfolio',
        },
      ],
    },
    alternates: {
      canonical: `/${lang}/portfolio${query}`,
      languages: getLanguageAlternates(`/portfolio${query}`),
    }
  };
}

export default async function PortfolioPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ lang: string }>,
  searchParams: Promise<{ type?: string }>
}) {
  const { lang } = await params;
  const { type } = await searchParams;
  const dict = await getDictionary(lang);

  const education = [
    {
      degree: dict['STEI-K'],
      school: dict['ITB'],
      period: `2025 — ${dict.Present}`,
      description: 'School of Electrical Engineering and Informatics - Computation'
    }
  ];

  const workHighlights = [
    {
      title: dict.SAT_Tutor,
      company: 'Kobi Education',
      period: `${dict.February} 2026 — ${dict.Present}`,
      description: dict.SAT_Tutor_Description,
      category: 'tutor'
    },
    {
      title: dict.Software_Engineer,
      company: 'Analitica',
      period: `${dict.October} 2025 — ${dict.Present}`,
      description: dict.Software_Engineer_Description,
      category: 'it'
    },
    {
      title: dict.Education_Team,
      company: 'Analitica',
      period: `${dict.May} 2025 — ${dict.September} 2025`,
      description: dict.Education_Team_Description,
      category: 'it'
    }
  ].filter(item => (!type) || (type === item.category));

  const projectHighlights = [
    {
      title: dict.Lidia_Project,
      tech: 'Python, Pandas, ETL, Data Analysis',
      description: dict.Lidia_Project_Description,
      link: 'https://github.com/FaranAiki/lidia',
      image: '/documents/project/Lidia_0.webp',
      category: 'it'
    },
    {
      title: dict.Alkyl_Compiler,
      tech: 'C, LLVM-IR, Compiler Design',
      description: dict.Alkyl_Compiler_Description,
      link: 'https://github.com/FaranAiki/alkyl',
      image: '/documents/project/Alkyl_0.webp',
      category: 'it'
    },
    {
      title: dict.ALTH_Project,
      tech: 'Flutter, Dart, Microsoft SSO',
      description: dict.ALTH_Project_Description,
      image: '/documents/project/ALTH_0.webp',
      category: 'it'
    },
    {
      title: dict.Make_Website,
      tech: 'Next.js, TypeScript, TailwindCSS',
      description: dict.Make_Website_Description,
      link: 'https://faranaiki.id',
      image: '/documents/project/Web_0.webp',
      category: 'it'
    }
  ].filter(item => (!type) || (type === item.category));

  const skills = [
    { category: 'Frontend', items: ['React', 'Next.js', 'Flutter', 'TailwindCSS', 'TypeScript'], type: 'it' },
    { category: 'Tools & Systems', items: ['Python', 'Pandas', 'C', 'LLVM', 'Linux (Arch)'], type: 'it' },
    { category: 'Education', items: ['SAT (Math & Verbal)', 'Data Analysis', 'Educational Content'], type: 'tutor' }
  ].filter(item => (!type) || (type === item.type));

  return (
    <PortfolioClient 
      lang={lang}
      type={type}
      dict={dict}
      workHighlights={workHighlights}
      projectHighlights={projectHighlights}
      skills={skills}
      education={education}
    />
  );
}
