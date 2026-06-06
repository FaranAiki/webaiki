"use server";

import { 
  getWorkExperiences, 
  getProjectExperiences, 
  getOrganizationExperiences, 
  getAwardExperiences 
} from '@/lib/data';
import { getDictionary } from '@/components/layout/Translator';

export interface SearchResult {
  title: string;
  company?: string;
  description: string;
  year: string;
  date: string;
  type: 'work' | 'project' | 'organization' | 'award';
  url?: string;
  tags?: string[];
}

interface ExperienceItem {
  title: string;
  company?: string;
  description: string;
  date: string;
  url?: string;
  tagLabel?: string[];
}

interface YearGroup {
  year: string;
  jobs: ExperienceItem[];
}

export async function searchContent(query: string, lang: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const dict = await getDictionary(lang);
  const lowercaseQuery = query.toLowerCase();

  const results: SearchResult[] = [];

  // Helper to search in experience arrays
  const searchInList = (list: YearGroup[], type: SearchResult['type']) => {
    list.forEach(yearGroup => {
      yearGroup.jobs.forEach((job) => {
        const inTitle = job.title.toLowerCase().includes(lowercaseQuery);
        const inDescription = job.description.toLowerCase().includes(lowercaseQuery);
        const inCompany = job.company?.toLowerCase().includes(lowercaseQuery);
        const inDate = job.date.toLowerCase().includes(lowercaseQuery);
        const inTags = job.tagLabel?.some(tag => tag.toLowerCase().includes(lowercaseQuery));

        if (inTitle || inDescription || inCompany || inDate || inTags) {
          results.push({
            title: job.title,
            company: job.company,
            description: job.description,
            year: yearGroup.year,
            date: job.date,
            type: type,
            url: job.url,
            tags: job.tagLabel
          });
        }
      });
    });
  };

  searchInList(getWorkExperiences(dict) as YearGroup[], 'work');
  searchInList(getProjectExperiences(dict) as YearGroup[], 'project');
  searchInList(getOrganizationExperiences(dict) as YearGroup[], 'organization');
  searchInList(getAwardExperiences(dict) as YearGroup[], 'award');

  return results;
}
