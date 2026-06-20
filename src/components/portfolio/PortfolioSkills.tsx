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
          <Wrench size={10} className="text-theme-500 shrink-0" />
          <h2 className="text-xs font-bold tracking-wider text-theme-muted">
            {title}
          </h2>
        </div>
        <div className="flex flex-col gap-1 text-[11px] text-[var(--text-muted)]">
          {skills.map((cat, idx) => (
            <div key={idx} className="leading-relaxed">
              <span className="font-bold text-foreground">{cat.category}: </span>
              <span>{cat.items.join(', ')}</span>
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
            className="p-4 rounded-xl border border-theme-border bg-theme-surface/10 hover:border-theme-500/30 transition-all duration-300"
          >
            <h3 className="text-sm font-bold text-foreground mb-2.5">
              {cat.category}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {cat.items.map((item, iIdx) => (
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
    </section>
  );
}
