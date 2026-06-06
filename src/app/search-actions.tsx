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
  type: 'work' | 'project' | 'organization' | 'award';
  url?: string;
}

export async function searchContent(query: string, lang: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const dict = await getDictionary(lang);
  const lowercaseQuery = query.toLowerCase();

  const results: SearchResult[] = [];

  // Helper to search in experience arrays
  const searchInList = (list: any[], type: SearchResult['type']) => {
    list.forEach(yearGroup => {
      yearGroup.jobs.forEach((job: any) => {
        const inTitle = job.title.toLowerCase().includes(lowercaseQuery);
        const inDescription = job.description.toLowerCase().includes(lowercaseQuery);
        const inCompany = job.company?.toLowerCase().includes(lowercaseQuery);

        if (inTitle || inDescription || inCompany) {
          results.push({
            title: job.title,
            company: job.company,
            description: job.description,
            year: yearGroup.year,
            type: type,
            url: job.url
          });
        }
      });
    });
  };

  searchInList(getWorkExperiences(dict), 'work');
  searchInList(getProjectExperiences(dict), 'project');
  searchInList(getOrganizationExperiences(dict), 'organization');
  searchInList(getAwardExperiences(dict), 'award');

  return results;
}
