import type { Metadata } from "next";
import { headers } from "next/headers";
import "../../../globals.css";
import { getDictionary } from '@/components/layout/Translator';
import { SITE_URL, getBaseMetadata, getLanguageAlternates } from '@/lib/seo';
import FAQ from '@/components/portfolio/FAQ';
import {
  getWorkExperiences,
  getProjectExperiences,
  getOrganizationExperiences,
  getAwardExperiences,
  getSkills,
  getEducationExperiences
} from '@/lib/data';
import { Github, Linkedin, Instagram, Twitter, Star, Briefcase, Mail } from 'lucide-react';
import Link from 'next/link';
import PortfolioHeader from '@/components/portfolio/PortfolioHeader';
import PortfolioClientWrapper from '@/components/portfolio/PortfolioClientWrapper';
import PortfolioExperienceList from '@/components/portfolio/PortfolioExperienceList';
import PortfolioSkills from '@/components/portfolio/PortfolioSkills';
import PortfolioEducation from '@/components/portfolio/PortfolioEducation';

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
  const nonce = (await headers()).get('x-nonce') || undefined;

  const workExp = getWorkExperiences(dict).flatMap(y => y.jobs);
  const projectExp = getProjectExperiences(dict).flatMap(y => y.jobs);
  const orgExp = getOrganizationExperiences(dict).flatMap(y => y.jobs);
  const awardExp = getAwardExperiences(dict).flatMap(y => y.jobs);
  const skills = getSkills(dict);
  const education = getEducationExperiences(dict).flatMap(y => y.jobs);

  const socialLinks = [
    { icon: <Mail size={18} />, url: "mailto:faran.aiki.business@gmail.com", label: "Email" },
    { icon: <Github size={18} />, url: "https://github.com/FaranAiki", label: "GitHub" },
    { icon: <Linkedin size={18} />, url: "https://www.linkedin.com/in/faranaiki/", label: "LinkedIn" },
    { icon: <Instagram size={18} />, url: "https://www.instagram.com/mfaranaiki/", label: "Instagram" },
    { icon: <Twitter size={18} />, url: "https://x.com/FaranAiki", label: "Twitter" },
  ];

  const faranFaqs = [
    { question: dict.FAQ_Faran_Q1, answer: dict.FAQ_Faran_A1 },
    { question: dict.FAQ_Faran_Q2, answer: dict.FAQ_Faran_A2 },
    { question: dict.FAQ_Faran_Q3, answer: dict.FAQ_Faran_A3 },
    { question: dict.FAQ_Faran_Q4, answer: dict.FAQ_Faran_A4 },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Muhammad Faran Aiki",
    "url": `${SITE_URL}/${lang}/portfolio`,
    "jobTitle": dict.STI,
    "worksFor": {
      "@type": "Organization",
      "name": dict.ITB
    },
    "description": dict.Portfolio_Summary_Description,
    "knowsAbout": ["Mathematics", "Computer Science", "Software Engineering", "Game Development"],
    "hasCredential": awardExp.map(a => ({
      "@type": "EducationalOccupationalCredential",
      "name": a.title,
      "recognizedBy": {
        "@type": "Organization",
        "name": a.company
      }
    }))
  };

  return (
    <main className="container mx-auto px-4 md:px-6 pt-24 pb-12 max-w-4xl portfolio-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        nonce={nonce}
      />
      <PortfolioClientWrapper>
        <div className="space-y-6 portfolio-content-wrapper">
          <PortfolioHeader 
            title={dict.Portfolio || 'Portfolio'}
            resumeLabel={`${dict.Resume || 'Resume'} Muhammad Faran Aiki`}
            subtitle={`Muhammad Faran Aiki | ${dict.STI}, ${dict.ITB}, ${dict.Indonesia}`}
            about={dict.Faran_About_2}
            socialLinks={socialLinks}
          />

          {/* Education Section */}
          <PortfolioEducation education={education} title={dict.Education || 'Education'} />

          {/* Experience Sections */}
          <PortfolioExperienceList 
            workExperiences={workExp}
            projectExperiences={projectExp}
            organizationExperiences={orgExp}
            awardExperiences={awardExp}
            labels={{
              Work: dict.Work,
              Project: dict.Project,
              Organization: dict.Organization,
              Award: dict.Award,
              Education: dict.Education,
              Data: dict.Data,
              Human: dict.Human,
              Technology: dict.Technology,
              Math: dict.Math,
              Management: dict.Management,
              Arts: dict.Arts,
              Achievement: dict.Achievement,
              Language: dict.Language,
              User: dict.User,
              Filter_Top: dict.Filter_Top
            }}
          />

          {/* Skills Section */}
          <PortfolioSkills skills={skills} title={dict['03Skill'] || 'Skills'} />

          {/* Professional Pitch / Sales Closing (Strategy #13) */}
          <section className="bg-theme-surface/30 border border-theme-border rounded-2xl p-6 md:p-8 mt-12 mb-8 relative overflow-hidden group no-print">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Briefcase size={80} />
              </div>
              <h3 className="text-xl font-black mb-4 nav-active-gacor">{dict.Professional_Pitch_Title}</h3>
              <p className="text-sm md:text-base text-[var(--text-muted)] leading-relaxed font-medium">
                  {dict.Professional_Pitch_Text}
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                  <Link 
                      href={`/${lang}/hire-me`}
                      className="px-6 py-2 rounded-xl bg-theme-500 text-white font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-theme-500/20"
                  >
                      {dict.Hire_Me}
                  </Link>
                  <Link 
                      href={`/${lang}/social`}
                      className="px-6 py-2 rounded-xl bg-theme-surface-strong border border-theme-border font-bold text-sm hover:bg-theme-surface transition-colors"
                  >
                      {dict.Social}
                  </Link>
              </div>
          </section>

          {/* Footer Actions */}
          <div className="pt-4 space-y-6 no-print">
              <div className="flex justify-center">
                  <Link
                      href={`/${lang}/all`}
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-theme-surface-strong border border-theme-border hover:border-theme-500 transition-all font-bold text-xs text-[var(--text-muted)] hover:text-theme-500 group tracking-widest"
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
      </PortfolioClientWrapper>
    </main>
  );
}
