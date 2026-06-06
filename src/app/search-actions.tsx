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
  score?: number;
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
  const queryTerms = lowercaseQuery.split(/\s+/).filter(term => term.length > 1);

  const results: SearchResult[] = [];

  const calculateScore = (text: string, terms: string[]) => {
    let score = 0;
    const lowerText = text.toLowerCase();
    terms.forEach(term => {
      if (lowerText.includes(term)) {
        score += 10;
        if (lowerText.startsWith(term)) score += 5;
      }
    });
    return score;
  };

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
    const titleScore = calculateScore(page.title, queryTerms);
    const descScore = calculateScore(page.description, queryTerms);
    if (titleScore > 0 || descScore > 0) {
      results.push({
        ...page,
        type: 'page',
        score: titleScore * 2 + descScore
      });
    }
  });

  // 2. Search Experience Data
  const searchInList = (list: YearGroup[], type: 'work' | 'project' | 'organization' | 'award') => {
    list.forEach(yearGroup => {
      yearGroup.jobs.forEach((job) => {
        const titleScore = calculateScore(job.title, queryTerms);
        const descScore = calculateScore(job.description, queryTerms);
        const companyScore = job.company ? calculateScore(job.company, queryTerms) : 0;
        const dateScore = calculateScore(job.date, queryTerms);
        const tagScore = job.tagLabel?.some(tag => calculateScore(tag, queryTerms) > 0) ? 10 : 0;

        const totalScore = titleScore * 3 + descScore + companyScore * 2 + dateScore + tagScore;

        if (totalScore > 0) {
          results.push({
            title: job.title,
            company: job.company,
            description: job.description,
            year: yearGroup.year,
            date: job.date,
            type: type,
            url: job.url || `/${lang}/${type}`,
            tags: job.tagLabel,
            score: totalScore
          });
        }
      });
    });
  };

  searchInList(getWorkExperiences(dict) as YearGroup[], 'work');
  searchInList(getProjectExperiences(dict) as YearGroup[], 'project');
  searchInList(getOrganizationExperiences(dict) as YearGroup[], 'organization');
  searchInList(getAwardExperiences(dict) as YearGroup[], 'award');

  // Deduplicate by URL and Title
  const uniqueResultsMap = new Map<string, SearchResult>();
  results.forEach(res => {
    const key = `${res.url}-${res.title}`;
    const existing = uniqueResultsMap.get(key);
    if (!existing || (res.score || 0) > (existing.score || 0)) {
      uniqueResultsMap.set(key, res);
    }
  });

  return Array.from(uniqueResultsMap.values()).sort((a, b) => {
    // 1. Pages always highly prioritized if they match well
    if (a.type === 'page' && b.type !== 'page' && (a.score || 0) > 5) return -1;
    if (b.type === 'page' && a.type !== 'page' && (b.score || 0) > 5) return 1;
    
    // 2. Sort by score
    return (b.score || 0) - (a.score || 0);
  });
}
