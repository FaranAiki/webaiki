"use client";

import React, { useState } from 'react';
import { useSettings } from '../providers/SettingsContext';
import { GraduationCap, Trash2 } from 'lucide-react';

interface EducationJob {
  title: string;
  company: string;
  date: string;
  description: string;
  brief?: string;
  url?: string;
}

interface PortfolioEducationProps {
  education: EducationJob[];
  title: string;
}

const cleanText = (text: string) => {
  if (!text) return "";
  return text.replace(/\r?\n|\r|\t/g, ' ').replace(/\s+/g, ' ').trim();
};

export default function PortfolioEducation({ education, title }: PortfolioEducationProps) {
  const { isAtsMode, isFullDescription } = useSettings();
  const [removedKeys, setRemovedKeys] = useState<string[]>([]);

  const visibleEducation = education.filter(
    (edu) => !removedKeys.includes(`${edu.title}-${edu.company}-${edu.date}`)
  );

  if (isAtsMode) {
    if (visibleEducation.length === 0) return null;
    return (
      <section className="mt-4 border-b border-theme-border pb-2 w-full portfolio-education-section-ats">
        <div className="flex items-center gap-2 border-b border-theme-border/50 pb-0.5 mb-1.5 w-full">
          <h2 className="text-lg font-black nav-active-gacor tracking-wider text-theme-muted">
            {title}
          </h2>
        </div>
        <div className="space-y-1 w-full">
          {visibleEducation.map((edu) => {
            const cleanTitle = cleanText(edu.title);
            const cleanCompany = cleanText(edu.company);
            const cleanDate = cleanText(edu.date);
            const cleanDescription = cleanText(isFullDescription ? edu.description : (edu.brief || edu.description));

            return (
              <div key={`${edu.title}-${edu.company}-${edu.date}`} className="portfolio-summary-item py-0 relative group">
                <div className="flex flex-wrap items-baseline gap-x-1 portfolio-item-header">
                  <h3 className="font-bold text-foreground text-xs portfolio-item-title m-0">
                    {edu.url ? (
                      <a
                        href={edu.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-foreground"
                      >
                        {cleanTitle}
                      </a>
                    ) : (
                      cleanTitle
                    )}
                  </h3>
                  <span className="text-[var(--text-muted)] text-[11px] select-none">|</span>
                  <span className="text-foreground text-[11px] font-medium tracking-tight portfolio-item-company">{cleanCompany}</span>
                  <span className="text-[var(--text-muted)] text-[11px] select-none">|</span>
                  <span className="text-[var(--text-muted)] text-[11px] font-medium tracking-tight portfolio-item-date">{cleanDate}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setRemovedKeys((prev) => [...prev, `${edu.title}-${edu.company}-${edu.date}`]);
                    }}
                    className="ml-auto p-1 hover:bg-red-500/10 rounded-md transition-colors text-theme-muted hover:text-red-500 no-print cursor-pointer opacity-0 group-hover:opacity-100 align-middle self-center"
                    title="Remove entry"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                {cleanDescription && (
                  <div className="pt-0.5 pb-0">
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {cleanDescription}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4 portfolio-education-section mt-8">
      <div className="flex items-center gap-2 border-b border-theme-border/50 pb-1">
        <GraduationCap size={14} className="text-theme-500 shrink-0" />
        <h2 className="text-lg font-black nav-active-gacor tracking-wider text-theme-muted">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {education.map((edu, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-theme-border bg-theme-surface/10 hover:border-theme-500/30 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start gap-2 mb-1.5">
                <h3 className="text-sm font-bold text-foreground leading-snug">
                  {edu.title}
                </h3>
                <span className="text-[10px] font-medium text-theme-500 bg-theme-500/10 px-2 py-0.5 rounded-full shrink-0">
                  {edu.date.split(' ').pop()}
                </span>
              </div>
              <p className="text-xs font-semibold text-theme-600 mb-1">{edu.company}</p>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{edu.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
