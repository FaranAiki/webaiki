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
  year?: string;
  date?: string;
  type: 'work' | 'project' | 'organization' | 'award' | 'page';
  url: string;
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
  const lowercaseQuery = query.toLowerCase().trim();

  const results: SearchResult[] = [];

  // 1. Search Static Pages
  const pages = [
    { title: dict.Home || "Home", description: dict.What_Do_You_Want_To_Base || "Main dashboard", url: `/${lang}` },
    { title: dict.Identity || "Identity", description: dict.SEO_Home_Description || "About and philosophy", url: `/${lang}/identity` },
    { title: dict.Website || "Website", description: dict.Website_Summary || "Technical info", url: `/${lang}/website` },
    { title: dict.Portfolio || "Portfolio", description: dict.Preparing_Portfolio || "Full collection", url: `/${lang}/portfolio` },
    { title: dict.College || "College", description: dict.SEO_College_Description || "Academic work", url: `/${lang}/college` },
    { title: dict.Work || "Work", description: dict.Work || "Experience", url: `/${lang}/work` },
    { title: dict.Project || "Project", description: dict.Project || "Projects", url: `/${lang}/project` },
    { title: dict.Organization || "Organization", description: dict.Organization || "Organizations", url: `/${lang}/organization` },
    { title: dict.Literature || "Literature", description: dict.Literature || "Writing", url: `/${lang}/literature` },
    { title: dict.Award || "Award", description: dict.Award || "Achievements", url: `/${lang}/award` },
    { title: dict.Social || "Social", description: dict.Social || "Contact", url: `/${lang}/social` },
    { title: dict.Music || "Music", description: dict.Music || "Playlist", url: `/${lang}/music` },
    { title: dict.Latest || "Latest", description: dict.Latest || "Updates", url: `/${lang}/latest` },
    { title: dict.Certificates || "Certificates", description: dict.Certificates || "Credentials", url: `/${lang}/certificate` },
    { title: dict.All || "All", description: dict.All || "Everything", url: `/${lang}/all` },
  ];

  pages.forEach(page => {
    const inTitle = page.title.toLowerCase().includes(lowercaseQuery);
    const inDesc = page.description.toLowerCase().includes(lowercaseQuery);
    if (inTitle || inDesc) {
      results.push({
        ...page,
        type: 'page',
      });
    }
  });

  // 2. Search Experience Data
  const searchInList = (list: YearGroup[], type: 'work' | 'project' | 'organization' | 'award') => {
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
            url: job.url || `/${lang}/${type}`,
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

  // Deduplicate and prioritize
  const uniqueResults = Array.from(new Map(results.map(item => [item.url + item.title, item])).values());

  return uniqueResults.sort((a, b) => {
    // Pages first
    if (a.type === 'page' && b.type !== 'page') return -1;
    if (a.type !== 'page' && b.type === 'page') return 1;
    return 0;
  });
}
