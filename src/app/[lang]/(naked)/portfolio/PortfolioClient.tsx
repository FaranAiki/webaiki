"use client";

import React from 'react';
import { 
  Mail, 
  Github, 
  Linkedin, 
  Globe, 
  Download, 
  ArrowLeft,
  MapPin,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Code2,
  Award,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface WorkHighlight {
  title: string;
  company: string;
  period: string;
  description: string;
  category: string;
}

interface ProjectHighlight {
  title: string;
  tech: string;
  description: string;
  link?: string;
  image?: string;
  category: string;
}

interface Skill {
  category: string;
  items: string[];
  type: string;
}

interface Education {
  degree: string;
  school: string;
  period: string;
  description: string;
}

interface PortfolioClientProps {
  lang: string;
  type?: string;
  dict: Record<string, string>;
  workHighlights: WorkHighlight[];
  projectHighlights: ProjectHighlight[];
  skills: Skill[];
  education: Education[];
}

export default function PortfolioClient({ 
  lang, 
  type, 
  dict, 
  workHighlights, 
  projectHighlights, 
  skills, 
  education
}: PortfolioClientProps) {
  const contactInfo = [
    { icon: <Mail size={16} />, text: 'faran.aiki.business@gmail.com', href: 'mailto:faran.aiki.business@gmail.com' },
    { icon: <Globe size={16} />, text: 'faranaiki.id', href: 'https://faranaiki.id' },
    { icon: <Github size={16} />, text: 'github.com/FaranAiki', href: 'https://github.com/FaranAiki' },
    { icon: <Linkedin size={16} />, text: 'linkedin.com/in/faran-aiki', href: 'https://www.linkedin.com/in/muhammad-faran-aiki-8a6305343/' },
    { icon: <MapPin size={16} />, text: 'Bandung, Indonesia', href: '#' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 print:bg-white print:text-slate-900">
      {/* Navigation / Actions - Hidden in Print */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4 print:hidden">
        <div className="container mx-auto flex justify-between items-center">
          <Link 
            href={`/${lang}`}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span>{dict.Back_to_Web}</span>
          </Link>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Download size={18} />
            <span>{dict.Download_PDF}</span>
          </button>
        </div>
      </nav>

      <main className="container mx-auto max-w-4xl p-8 md:p-12 space-y-12 print:p-0 print:max-w-none">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row gap-8 items-center md:items-start border-b border-slate-800 pb-12 print:border-slate-200">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Image 
              src="/images/photo_faran_aiki/1_fa_photo_linkedin.webp"
              alt="Muhammad Faran Aiki"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white print:text-slate-900">Muhammad Faran Aiki</h1>
              <p className="text-xl text-cyan-400 font-medium mt-2">
                {type === 'it' ? dict.Software_Engineer : 
                 type === 'tutor' ? dict.SAT_Tutor : 
                 `${dict.Software_Engineer} | ${dict.SAT_Tutor}`}
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-6 text-slate-400 text-sm print:text-slate-600">
              {contactInfo.map((item, idx) => (
                <a key={idx} href={item.href} className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                  {item.icon}
                  <span>{item.text}</span>
                </a>
              ))}
            </div>
          </div>
        </header>

        {/* About Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-white print:text-slate-900">
            <BookOpen className="text-cyan-500" />
            {dict.About_Me}
          </h2>
          <div 
            className="text-slate-300 leading-relaxed print:text-slate-700"
            dangerouslySetInnerHTML={{ __html: dict.Faran_About_1 + ' ' + dict.Faran_About_2 }}
          />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-12">
            {/* Experience */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-white print:text-slate-900">
                <Briefcase className="text-cyan-500" />
                {dict.Experience}
              </h2>
              <div className="space-y-8">
                {workHighlights.map((work, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-slate-800 print:border-slate-200">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 bg-cyan-500 rounded-full border-4 border-slate-950 print:border-white"></div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg text-slate-100 print:text-slate-900">{work.title}</h3>
                      <div className="flex justify-between text-sm">
                        <span className="text-cyan-400 font-medium">{work.company}</span>
                        <span className="text-slate-500">{work.period}</span>
                      </div>
                      <p className="text-slate-400 text-sm mt-2 leading-relaxed print:text-slate-600">{work.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-white print:text-slate-900">
                <GraduationCap className="text-cyan-500" />
                {dict.Education}
              </h2>
              <div className="space-y-6">
                {education.map((edu, idx) => (
                  <div key={idx} className="space-y-1">
                    <h3 className="font-bold text-lg text-slate-100 print:text-slate-900">{edu.degree}</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-cyan-400 font-medium">{edu.school}</span>
                      <span className="text-slate-500">{edu.period}</span>
                    </div>
                    <p className="text-slate-400 text-sm print:text-slate-600">{edu.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-12">
            {/* Projects */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-white print:text-slate-900">
                <Code2 className="text-cyan-500" />
                {dict.Project}
              </h2>
              <div className="space-y-8">
                {projectHighlights.map((project, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-slate-100 print:text-slate-900">{project.title}</h3>
                      {project.link && (
                        <a href={project.link} className="text-slate-500 hover:text-cyan-400 print:hidden">
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                    <p className="text-xs font-mono text-cyan-500/80 uppercase tracking-wider">{project.tech}</p>
                    <p className="text-slate-400 text-sm leading-relaxed print:text-slate-600">{project.description}</p>
                    {project.image && (
                      <div className="relative w-full h-32 mt-3 rounded-lg overflow-hidden border border-slate-800 print:border-slate-200">
                        <Image 
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-white print:text-slate-900">
                <Award className="text-cyan-500" />
                {dict.Skills}
              </h2>
              <div className="space-y-6">
                {skills.map((skillGroup, idx) => (
                  <div key={idx} className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{skillGroup.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((skill, sIdx) => (
                        <span 
                          key={sIdx}
                          className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-300 print:bg-slate-100 print:border-slate-200 print:text-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer for PDF */}
        <footer className="hidden print:block border-t border-slate-200 pt-8 mt-12 text-center text-slate-500 text-xs">
          <p>Generated from faranaiki.id/portfolio — {new Date().toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </footer>
      </main>

      <style jsx global>{`
        @media print {
          @page {
            margin: 2cm;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          /* Ensure backgrounds aren't stripped by some browsers */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
