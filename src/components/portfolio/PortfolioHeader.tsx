"use client";

import React from 'react';
import { useSettings } from '../providers/SettingsContext';

interface SocialLink {
  icon: React.ReactNode;
  url: string;
  label: string;
}

interface PortfolioHeaderProps {
  title: string;
  resumeLabel: string;
  subtitle: string;
  about: string;
  socialLinks: SocialLink[];
}

const cleanText = (text: string) => {
  if (!text) return "";
  return text.replace(/\r?\n|\r|\t/g, ' ').replace(/\s+/g, ' ').trim();
};

export default function PortfolioHeader({ title, resumeLabel, subtitle, about, socialLinks }: PortfolioHeaderProps) {
  const { isAtsMode } = useSettings();

  const displaySubtitle = isAtsMode ? subtitle.replace('Muhammad Faran Aiki | ', '') : subtitle;

  // Group social links into pairs for ATS mode (2 per row)
  const groupedSocialLinks = [];
  for (let i = 0; i < socialLinks.length; i += 2) {
    groupedSocialLinks.push(socialLinks.slice(i, i + 2));
  }

  if (isAtsMode) {
    const cleanResumeLabel = cleanText(resumeLabel);
    const cleanSubtitle = cleanText(displaySubtitle);
    const cleanAbout = cleanText(about);

    return (
      <section className="flex flex-col items-center text-center gap-1 border-b border-theme-border pb-1 portfolio-header-section ats-header">
        <h1 className="text-3xl font-black tracking-tighter">
          {cleanResumeLabel}
        </h1>

        <div className="w-full border-t border-theme-border my-0.5"></div>

        <div className="portfolio-subtitle-container">
          <p className="text-sm font-bold text-foreground">
            {cleanSubtitle}
          </p>
          <p
            className="text-xs text-[var(--text-muted)] max-w-2xl leading-relaxed mt-1"
            dangerouslySetInnerHTML={{ __html: cleanAbout }}
          />
        </div>

        <div className="w-full border-t border-theme-border my-0.5"></div>

        <div className="flex flex-col items-center gap-1 w-full portfolio-social-links-ats">
          {groupedSocialLinks.map((group, idx) => (
            <div key={idx} className="flex justify-center items-center gap-6 w-full">
              {group.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  className="flex items-center gap-1.5 text-theme-600 font-bold underline text-[11px]"
                >
                  {link.label}: {link.url.replace('https://', '').replace('mailto:', '')}
                </a>
              ))}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-theme-border pb-3 portfolio-header-section">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter nav-active-gacor portfolio-title">
          {title}
        </h1>
        <div className="portfolio-subtitle-container">
          <p className="text-sm font-bold text-foreground opacity-80 portfolio-subtitle">
            {subtitle}
          </p>
          <p
            className="text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed portfolio-about mt-2"
            dangerouslySetInnerHTML={{ __html: about }}
          />
        </div>
      </div>

      {/* Social Links - Normal Mode */}
      <div className="flex gap-2 portfolio-social-links">
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
  );
}
