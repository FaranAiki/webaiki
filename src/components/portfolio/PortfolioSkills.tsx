"use client";

import React from 'react';
import { useSettings } from '../providers/SettingsContext';
import { Wrench } from 'lucide-react';
import { SkillCategory } from '@/lib/data';

interface PortfolioSkillsProps {
  skills: SkillCategory[];
  title: string;
}

export default function PortfolioSkills({ skills, title }: PortfolioSkillsProps) {
  const { isAtsMode } = useSettings();

  if (isAtsMode) {
    return (
      <section className="mt-4 border-b border-theme-border pb-2 w-full portfolio-skills-section-ats">
        <div className="flex items-center gap-2 border-b border-theme-border/50 pb-0.5 mb-1.5">
          <h2 className="text-lg font-black nav-active-gacor tracking-wider text-theme-muted">
            {title}
          </h2>
        </div>
        <div className="flex flex-col gap-2 text-xs text-[var(--text-muted)] mt-1.5">
          {skills.map((cat, idx) => (
            <div key={idx} className="leading-relaxed">
              <div className="font-bold text-foreground">{cat.category}:</div>
              {cat.subcategories ? (
                <div className="pl-4 flex flex-col gap-0.5">
                  {cat.subcategories.map((sub, sIdx) => (
                    <div key={sIdx}>* {sub.title}: {sub.items.join(', ')}</div>
                  ))}
                </div>
              ) : (
                <div className="pl-4">* {cat.items?.join(', ')}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4 portfolio-skills-section mt-8">
      <div className="flex items-center gap-2 border-b border-theme-border/50 pb-1">
        <Wrench size={14} className="text-theme-500 shrink-0" />
        <h2 className="text-lg font-black nav-active-gacor tracking-wider text-theme-muted">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {skills.map((cat, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border border-theme-border bg-theme-surface/10 hover:border-theme-500/30 transition-all duration-300 ${cat.subcategories ? 'sm:col-span-2' : ''}`}
          >
            <h3 className="text-sm font-bold text-foreground mb-3">
              {cat.category}
            </h3>
            {cat.subcategories ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.subcategories.map((sub, sIdx) => (
                  <div key={sIdx}>
                    <h4 className="text-[12px] font-bold text-theme-muted tracking-wider mb-1.5">{sub.title}</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {sub.items.map((item, iIdx) => (
                        <span
                          key={iIdx}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-theme-surface-strong border border-theme-border text-[var(--text-muted)] hover:border-theme-500 hover:text-theme-500 hover:scale-105 transition-all duration-200 select-none cursor-default"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {cat.items?.map((item, iIdx) => (
                  <span
                    key={iIdx}
                    className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-theme-surface-strong border border-theme-border text-[var(--text-muted)] hover:border-theme-500 hover:text-theme-500 hover:scale-105 transition-all duration-200 select-none cursor-default"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
