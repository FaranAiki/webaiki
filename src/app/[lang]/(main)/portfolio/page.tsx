import type { Metadata } from "next";
import "../../../globals.css";
import { getDictionary } from '@/components/Translator';
import { SITE_URL, getBaseMetadata, getLanguageAlternates } from '@/lib/seo';
import FAQ from '@/components/FAQ';
import {
  getWorkExperiences,
  getProjectExperiences,
  getOrganizationExperiences,
  getAwardExperiences
} from '@/lib/data';
import { Briefcase, Code, Users, Trophy, Github, Linkedin, Instagram, Twitter, Star } from 'lucide-react';
import Link from 'next/link';
import PortfolioSummaryItem from '@/components/PortfolioSummaryItem';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.Portfolio || 'Portfolio'} | Faran Aiki`,
    description: dict.Portfolio_Summary_Description || "Compact summary of Muhammad Faran Aiki's professional experiences and highlights",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.Portfolio || 'Portfolio'} | Faran Aiki`,
      description: dict.Portfolio_Summary_Description || "Compact summary of Muhammad Faran Aiki's professional experiences and highlights",
      url: `${SITE_URL}/${lang}/portfolio`,
    },
    alternates: {
      canonical: `/${lang}/portfolio`,
      languages: getLanguageAlternates('/portfolio'),
    },
  };
}

export default async function PortfolioSummaryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const workExp = getWorkExperiences(dict).flatMap(y => y.jobs).filter(j => (j.point || 0) >= 80).sort((a, b) => (b.point || 0) - (a.point || 0));
  const projectExp = getProjectExperiences(dict).flatMap(y => y.jobs).filter(j => (j.point || 0) >= 80).sort((a, b) => (b.point || 0) - (a.point || 0));
  const orgExp = getOrganizationExperiences(dict).flatMap(y => y.jobs).filter(j => (j.point || 0) >= 80).sort((a, b) => (b.point || 0) - (a.point || 0));
  const awardExp = getAwardExperiences(dict).flatMap(y => y.jobs).filter(j => (j.point || 0) >= 80).sort((a, b) => (b.point || 0) - (a.point || 0));

  const socialLinks = [
    { icon: <Github size={18} />, url: "https://github.com/FaranAiki", label: "GitHub" },
    { icon: <Linkedin size={18} />, url: "https://www.linkedin.com/in/muhammad-faran-aiki-8a6305343/", label: "LinkedIn" },
    { icon: <Instagram size={18} />, url: "https://www.instagram.com/mfaranaiki/", label: "Instagram" },
    { icon: <Twitter size={18} />, url: "https://x.com/FaranAiki", label: "Twitter" },
  ];

  const faranFaqs = [
    { question: dict.FAQ_Faran_Q1, answer: dict.FAQ_Faran_A1 },
    { question: dict.FAQ_Faran_Q2, answer: dict.FAQ_Faran_A2 },
    { question: dict.FAQ_Faran_Q3, answer: dict.FAQ_Faran_A3 },
    { question: dict.FAQ_Faran_Q4, answer: dict.FAQ_Faran_A4 },
  ];

  return (
    <main className="container mx-auto px-4 md:px-6 pt-24 pb-12 max-w-4xl">
      <div className="space-y-6">
        {/* Compact Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-theme-border pb-3">
          <div className="space-y-0.5">
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter nav-active-gacor">
              {dict.Portfolio || 'Portfolio'}
            </h1>
            <p className="text-base font-bold text-foreground opacity-80 tracking-widest">
              Muhammad Faran Aiki
            </p>
          </div>

          {/* Compact Social */}
          <div className="flex gap-2">
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-theme-surface-strong border border-theme-border text-theme-muted hover:text-theme-500 hover:border-theme-500 transition-all hover:scale-105"
                title={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </section>

        {/* Experience Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">

          {/* Work Summary */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 border-b border-theme-border/50 pb-0.5">
              <Briefcase size={12} className="text-theme-500" />
              <h2 className="text-lg font-black nav-active-gacor tracking-[0.2em] text-theme-muted">{dict.Work}</h2>
            </div>
            <div className="space-y-1">
              {workExp.map((job, i) => (
                <PortfolioSummaryItem
                  key={i}
                  title={job.title}
                  company={job.company}
                  date={job.date}
                  description={job.description}
                />
              ))}
            </div>
          </section>

          {/* Project Summary */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 border-b border-theme-border/50 pb-0.5">
              <Code size={12} className="text-theme-500" />
              <h2 className="text-lg font-black nav-active-gacor tracking-[0.2em] text-theme-muted">{dict.Project}</h2>
            </div>
            <div className="space-y-1">
              {projectExp.map((job, i) => (
                <PortfolioSummaryItem
                  key={i}
                  title={job.title}
                  company={job.company}
                  date={job.date}
                  description={job.description}
                  url={job.url}
                />
              ))}
            </div>
          </section>

          {/* Organization Summary */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 border-b border-theme-border/50 pb-0.5">
              <Users size={12} className="text-theme-500" />
              <h2 className="text-lg font-black nav-active-gacor tracking-[0.2em] text-theme-muted">{dict.Organization}</h2>
            </div>
            <div className="space-y-1">
              {orgExp.map((job, i) => (
                <PortfolioSummaryItem
                  key={i}
                  title={job.title}
                  company={job.company}
                  date={job.date}
                  description={job.description}
                />
              ))}
            </div>
          </section>

          {/* Award Summary */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 border-b border-theme-border/50 pb-0.5">
              <Trophy size={12} className="text-theme-500" />
              <h2 className="text-lg font-black nav-active-gacor tracking-[0.2em] text-theme-muted">{dict.Award}</h2>
            </div>
            <div className="space-y-1">
              {awardExp.map((job, i) => (
                <PortfolioSummaryItem
                  key={i}
                  title={job.title}
                  company={job.company}
                  date={job.date}
                  description={job.description}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 space-y-6">
            <div className="flex justify-center">
                <Link
                    href={`/${lang}/all`}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-theme-surface-strong border border-theme-border hover:border-theme-500 transition-all font-bold text-[10px] text-[var(--text-muted)] hover:text-theme-500 group tracking-widest"
                >
                    <Star size={12} className="group-hover:animate-spin-slow" />
                    {dict.Full_Portfolio || 'Full Portfolio'}
                </Link>
            </div>

            {/* Compact FAQ Section */}
            <section className="border-t border-theme-border pt-6">
                <FAQ title={dict.FAQ_Faran_Title} items={faranFaqs} />
            </section>
        </div>
      </div>
    </main>
  );
}
