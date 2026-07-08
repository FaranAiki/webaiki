"use client";

import React, { useState } from 'react';
import { useSettings } from '../providers/SettingsContext';
import { GraduationCap, Trash2 } from 'lucide-react';

interface EducationJob {
  title: string;
  company: string;
  date: string;
  description: string | string[];
  brief?: string | string[];
  url?: string;
}

interface PortfolioEducationProps {
  education: EducationJob[];
  title: string;
}

const cleanText = <T extends string | string[] | undefined | null>(text: T): T => {
  if (!text) return "" as T;
  if (Array.isArray(text)) {
    return text.map(t => typeof t === 'string' ? t.replace(/\r?\n|\r|\t/g, ' ').replace(/\s+/g, ' ').trim() : t) as T;
  }
  if (typeof text === 'string') {
    return text.replace(/\r?\n|\r|\t/g, ' ').replace(/\s+/g, ' ').trim() as T;
  }
  return text;
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

            const renderBoldText = (text: string) => {
              // Match anything in parentheses that ends with a GPA number format (e.g., "(IPK: 3.94 / 4.00)" or "(Средний Балл: 3.94 / 4.00)")
              const parts = text.split(/(\(.*?\s*[\d.]+\s*\/\s*[\d.]+\))/i);
              if (parts.length === 1) return text;
              return parts.map((part, idx) => {
                if (/^\(.*?\s*[\d.]+\s*\/\s*[\d.]+\)$/i.test(part)) {
                  // Keep the parentheses normal but bold the inside text
                  const inner = part.slice(1, -1);
                  return <React.Fragment key={idx}>(<strong className="font-bold text-theme-800 dark:text-theme-200">{inner}</strong>)</React.Fragment>;
                }
                return <span key={idx}>{part}</span>;
              });
            };

            return (
              <div key={`${edu.title}-${edu.company}-${edu.date}`} className="portfolio-summary-item py-0 relative group">
                <div className="portfolio-item-header leading-tight">
                  <h3 className="font-bold text-foreground text-xs portfolio-item-title m-0 inline">
                    {edu.url ? (
                      <a
                        href={edu.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-foreground inline"
                      >
                        {cleanTitle}
                      </a>
                    ) : (
                      cleanTitle
                    )}
                  </h3>
                  <span className="text-[var(--text-muted)] text-[11px] select-none mx-1">|</span>
                  <span className="text-foreground text-[11px] font-medium tracking-tight portfolio-item-company inline">{renderBoldText(cleanCompany)}</span>
                  <span className="text-[var(--text-muted)] text-[11px] select-none mx-1">|</span>
                  <span className="text-[var(--text-muted)] text-[11px] font-medium tracking-tight portfolio-item-date inline">{cleanDate}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setRemovedKeys((prev) => [...prev, `${edu.title}-${edu.company}-${edu.date}`]);
                    }}
                    className="ml-2 inline-flex items-center justify-center p-0.5 text-[var(--text-muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity no-print"
                    title="Remove entry"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
                {cleanDescription && (
                  <div className="pt-0.5 pb-0">
                    {Array.isArray(cleanDescription) ? (
                      <ul className="list-none space-y-0.5 mt-1 text-xs text-[var(--text-muted)] leading-relaxed">
                        {cleanDescription.map((desc, i) => (
                          <li key={i}>• {renderBoldText(desc)}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                        {renderBoldText(cleanDescription)}
                      </p>
                    )}
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
                <span className="text-[10px] font-bold text-theme-700 dark:text-theme-300 bg-theme-500/15 px-2 py-0.5 rounded-full shrink-0">
                  {edu.date.split(' ').pop()}
                </span>
              </div>
              <p className="text-xs font-semibold text-theme-700 dark:text-theme-300 mb-1">{edu.company}</p>
              {Array.isArray(edu.description) ? (
                <ul className="list-disc list-outside ml-3 space-y-1 text-xs text-[var(--text-muted)] leading-relaxed">
                  {edu.description.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{edu.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
