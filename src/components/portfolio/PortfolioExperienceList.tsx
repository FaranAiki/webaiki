"use client";

import React, { useMemo, useCallback } from 'react';
import { useSettings } from '../providers/SettingsContext';
import { Briefcase, Code, Users, Trophy } from 'lucide-react';
import PortfolioSummaryItem from './PortfolioSummaryItem';

import { ExperienceTag } from '@/lib/types';

interface Job {
  title: string;
  company: string;
  date: string;
  description: string;
  point?: number;
  url?: string;
  tag?: string[];
}

const CATEGORY_ORDER: Record<string, number> = {
  [ExperienceTag.Education]: 1,
  [ExperienceTag.Data]: 2,
  [ExperienceTag.Human]: 3,
  [ExperienceTag.Technology]: 4,
  [ExperienceTag.Math]: 5,
  [ExperienceTag.Management]: 6,
  [ExperienceTag.Arts]: 7,
  [ExperienceTag.Achievement]: 8,
  [ExperienceTag.Language]: 9,
  [ExperienceTag.User]: 10,
};

interface PortfolioExperienceListProps {
  workExperiences: Job[];
  projectExperiences: Job[];
  organizationExperiences: Job[];
  awardExperiences: Job[];
  labels: {
    Work: string;
    Project: string;
    Organization: string;
    Award: string;
    // Tags
    Education: string;
    Data: string;
    Human: string;
    Technology: string;
    Math: string;
    Management: string;
    Arts: string;
    Achievement: string;
    Language: string;
    User: string;
    Filter_Top: string;
  };
}

export default function PortfolioExperienceList({
  workExperiences,
  projectExperiences,
  organizationExperiences,
  awardExperiences,
  labels
}: PortfolioExperienceListProps) {
  const { portfolioFilter } = useSettings();

  const filterJobs = useCallback((jobs: Job[]) => {
    let filtered = jobs;
    
    if (portfolioFilter === 'top') {
      filtered = jobs.filter(j => (j.point || 0) >= 80);
    } else if (portfolioFilter !== 'all') {
      // Filter by tag - comparing untranslated enum key to translated tag strings in the data
      const targetLabel = labels[portfolioFilter as keyof typeof labels];
      filtered = jobs.filter(j => j.tag?.includes(targetLabel));
    }
    
    return filtered.sort((a, b) => {
      // For sorting, we still use the enum-based CATEGORY_ORDER
      // We need to find which enum key corresponds to the translated string
      const findEnumKey = (translatedTag?: string) => {
        if (!translatedTag) return '';
        const entry = Object.entries(labels).find(([, val]) => val === translatedTag);
        return entry ? entry[0] : '';
      };

      const keyA = findEnumKey(a.tag?.[0]);
      const keyB = findEnumKey(b.tag?.[0]);
      
      const orderA = CATEGORY_ORDER[keyA] || 999;
      const orderB = CATEGORY_ORDER[keyB] || 999;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      return (b.point || 0) - (a.point || 0);
    });
  }, [portfolioFilter, labels]);

  const filteredWork = useMemo(() => filterJobs(workExperiences), [workExperiences, filterJobs]);
  const filteredProject = useMemo(() => filterJobs(projectExperiences), [projectExperiences, filterJobs]);
  const filteredOrg = useMemo(() => filterJobs(organizationExperiences), [organizationExperiences, filterJobs]);
  const filteredAward = useMemo(() => filterJobs(awardExperiences), [awardExperiences, filterJobs]);

  const hasAnyExperience = filteredWork.length > 0 || filteredProject.length > 0 || filteredOrg.length > 0 || filteredAward.length > 0;

  if (!hasAnyExperience) {
      return (
          <div className="py-12 text-center text-theme-muted italic">
              No Experiences Found For This Filter.
          </div>
      );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 portfolio-grid">
      {/* Work Summary */}
      {filteredWork.length > 0 && (
        <section className="space-y-1">
          <div className="flex items-center gap-2 border-b border-theme-border/50 pb-0.5">
            <Briefcase size={12} className="text-theme-500" />
            <h2 className="text-lg font-black nav-active-gacor tracking-wider text-theme-muted">{labels.Work}</h2>
          </div>
          <div className="space-y-1">
            {filteredWork.map((job, i) => (
              <PortfolioSummaryItem
                key={i}
                title={`${i + 1}. ${job.title}`}
                company={job.company}
                date={job.date}
                description={job.description}
              />
            ))}
          </div>
        </section>
      )}

      {/* Project Summary */}
      {filteredProject.length > 0 && (
        <section className="space-y-1">
          <div className="flex items-center gap-2 border-b border-theme-border/50 pb-0.5">
            <Code size={12} className="text-theme-500" />
            <h2 className="text-lg font-black nav-active-gacor tracking-wider text-theme-muted">{labels.Project}</h2>
          </div>
          <div className="space-y-1">
            {filteredProject.map((job, i) => (
              <PortfolioSummaryItem
                key={i}
                title={`${i + 1}. ${job.title}`}
                company={job.company}
                date={job.date}
                description={job.description}
                url={job.url}
              />
            ))}
          </div>
        </section>
      )}

      {/* Organization Summary */}
      {filteredOrg.length > 0 && (
        <section className="space-y-1">
          <div className="flex items-center gap-2 border-b border-theme-border/50 pb-0.5">
            <Users size={12} className="text-theme-500" />
            <h2 className="text-lg font-black nav-active-gacor tracking-wider text-theme-muted">{labels.Organization}</h2>
          </div>
          <div className="space-y-1">
            {filteredOrg.map((job, i) => (
              <PortfolioSummaryItem
                key={i}
                title={`${i + 1}. ${job.title}`}
                company={job.company}
                date={job.date}
                description={job.description}
              />
            ))}
          </div>
        </section>
      )}

      {/* Award Summary */}
      {filteredAward.length > 0 && (
        <section className="space-y-1">
          <div className="flex items-center gap-2 border-b border-theme-border/50 pb-0.5">
            <Trophy size={12} className="text-theme-500" />
            <h2 className="text-lg font-black nav-active-gacor tracking-wider text-theme-muted">{labels.Award}</h2>
          </div>
          <div className="space-y-1">
            {filteredAward.map((job, i) => (
              <PortfolioSummaryItem
                key={i}
                title={`${i + 1}. ${job.title}`}
                company={job.company}
                date={job.date}
                description={job.description}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
