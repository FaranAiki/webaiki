"use server";

import {
  getWorkExperiences,
  getProjectExperiences,
  getOrganizationExperiences,
  getAwardExperiences,
  getCertificatesData,
  getCollectionsData
} from '@/lib/data';
import { getDictionary } from '@/components/layout/Translator';
import { getNews } from './actions';
import { NewsItem } from '@/lib/types';

export interface SearchResult {
  title: string;
  company?: string;
  description: string;
  year?: string;
  date?: string;
  type: 'work' | 'project' | 'organization' | 'award' | 'page' | 'certificate' | 'faq' | 'other' | 'news';
  url: string;
  tags?: string[];
  score?: number;
  keywords?: string[];
  image?: string;
}

interface ExperienceItem {
  title: string;
  company?: string;
  description: string;
  date: string;
  url?: string;
  tag?: string[];
  image?: string[];
}

interface YearGroup {
  year: string;
  jobs: ExperienceItem[];
}

export async function getSuggestions(lang: string, count: number = 5): Promise<SearchResult[]> {
  const dict = await getDictionary(lang);
  
  // Use a simple LCG for deterministic "randomness" based on date
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  
  let currentSeed = seed;
  const lcg = () => {
    currentSeed = (Math.imul(currentSeed, 1664525) + 1013904223) | 0;
    return currentSeed >>> 0;
  };

  // 1. Static pages as high-priority suggestions
  const basePages: SearchResult[] = [
    { title: dict.Identity || "Identity", description: dict.SEO_Home_Description || "About Faran Aiki", type: 'page', url: `/${lang}/identity` },
    { title: dict.Portfolio || "Portfolio", description: dict.Preparing_Portfolio || "Selected works", type: 'page', url: `/${lang}/portfolio` },
    { title: dict.Project || "Project", description: dict.Project || "Technical projects", type: 'page', url: `/${lang}/project` },
    { title: dict.College || "College", description: dict.SEO_College_Description || "Academic journey", type: 'page', url: `/${lang}/college` },
    { title: dict.News || "News", description: dict.Latest_News || "Latest news", type: 'page', url: `/${lang}/news` },
  ];

  // 2. Add some dynamic items from experiences if possible
  const dynamicPool: SearchResult[] = [];
  
  try {
    const work = getWorkExperiences(dict) as YearGroup[];
    work.forEach(y => y.jobs.forEach(j => dynamicPool.push({
      title: j.title, company: j.company, description: j.description, type: 'work', url: `/${lang}/work#exp-${j.title.toLowerCase().replace(/\s+/g, '-')}`
    })));

    const projects = getProjectExperiences(dict) as YearGroup[];
    projects.forEach(y => y.jobs.forEach(j => dynamicPool.push({
      title: j.title, company: j.company, description: j.description, type: 'project', url: `/${lang}/project#exp-${j.title.toLowerCase().replace(/\s+/g, '-')}`
    })));
  } catch {
    // Fallback if data fetching fails
  }

  const fullPool = [...basePages, ...dynamicPool];
  for (let i = fullPool.length - 1; i > 0; i--) {
    const j = lcg() % (i + 1);
    [fullPool[i], fullPool[j]] = [fullPool[j], fullPool[i]];
  }
  return fullPool.slice(0, count);
}

const searchPoolCache = new Map<string, { pool: SearchResult[], timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function getFullSearchPool(lang: string): Promise<SearchResult[]> {
  const cached = searchPoolCache.get(lang);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.pool;
  }

  const dict = await getDictionary(lang);
  const pool: SearchResult[] = [];

  // 1. Static Pages
  const pages: (Omit<SearchResult, 'type' | 'score'> & { keywords: string[] })[] = [
    {
      title: dict.Home || "Home",
      description: dict.What_Do_You_Want_To_Base || "Main dashboard and navigation",
      url: `/${lang}`,
      keywords: ["beranda", "main", "start", "welcome", "dashboard", "home"]
    },
    {
      title: dict.Identity || "Identity",
      description: dict.SEO_Home_Description || "About Faran Aiki, philosophy, and background",
      url: `/${lang}/identity`,
      keywords: ["profile", "about", "bio", "faran", "aiki", "identity", "philosophy", "who am i", "personal", "biografi"]
    },
    {
      title: dict.Website || "Website",
      description: dict.Website_Summary || "Technical stack and performance details",
      url: `/${lang}/website`,
      keywords: ["tech", "stack", "performance", "lighthouse", "nextjs", "build", "coding", "website", "situs", "teknologi"]
    },
    {
      title: dict.Portfolio || "Portfolio",
      description: dict.Preparing_Portfolio || "Selected works and highlighted professional experience",
      url: `/${lang}/portfolio`,
      keywords: ["work", "projects", "showcase", "resume", "cv", "portfolio", "experience", "highlight", "best"]
    },
    {
      title: dict.College || "College",
      description: dict.SEO_College_Description || "Academic journey and study materials at ITB",
      url: `/${lang}/college`,
      keywords: ["itb", "study", "university", "academic", "courses", "notes", "education", "college", "kuliah", "mahasiswa", "sti"]
    },
    {
      title: dict.Work || "Work",
      description: dict.Work || "Professional employment history",
      url: `/${lang}/work`,
      keywords: ["job", "career", "employment", "professional", "company", "experience", "work", "kerja", "karir"]
    },
    {
      title: dict.Project || "Project",
      description: dict.Project || "Technical and personal projects",
      url: `/${lang}/project`,
      keywords: ["coding", "apps", "software", "development", "github", "build", "project", "proyek", "tugas"]
    },
    {
      title: dict.Organization || "Organization",
      description: dict.Organization || "Extracurricular and leadership activities",
      url: `/${lang}/organization`,
      keywords: ["leadership", "committee", "club", "team", "organization", "organisasi", "komunitas", "gdg", "stei"]
    },
    {
      title: dict.Literature || "Literature",
      description: dict.Literature || "Poems, essays, and creative writing",
      url: `/${lang}/literature`,
      keywords: ["writing", "poems", "essays", "creative", "stories", "literature", "sastra", "puisi", "tulisan"]
    },
    {
      title: dict.Award || "Award",
      description: dict.Award || "Honors, scholarships, and achievements",
      url: `/${lang}/award`,
      keywords: ["honor", "scholarship", "competition", "achievement", "award", "penghargaan", "prestasi", "beasiswa"]
    },
    {
      title: dict.Social || "Social",
      description: dict.Social || "Social media and contact information",
      url: `/${lang}/social`,
      keywords: ["contact", "instagram", "linkedin", "github", "twitter", "email", "links", "social", "sosial", "kontak"]
    },
    {
      title: dict.Music || "Music",
      description: dict.Music || "Musical interests and playlists",
      url: `/${lang}/music`,
      keywords: ["spotify", "playlist", "songs", "hobby", "music", "musik", "lagu"]
    },
    {
      title: dict.Latest || "Latest",
      description: dict.Latest || "Recent updates and newly added content",
      url: `/${lang}/latest`,
      keywords: ["new", "recent", "updates", "fresh", "latest", "terbaru", "update"]
    },
    {
      title: dict.Certificates || "Certificates",
      description: dict.Certificates || "Professional and academic certifications",
      url: `/${lang}/certificate`,
      keywords: ["certification", "course", "diploma", "verified", "skill", "certificate", "sertifikat", "kursus"]
    },
    {
      title: dict.All || "All",
      description: dict.All || "Comprehensive view of all content",
      url: `/${lang}/all`,
      keywords: ["everything", "complete", "full", "all", "semua", "seluruh"]
    },
    {
      title: dict.News || "News",
      description: dict.Latest_News || "Latest news and updates",
      url: `/${lang}/news`,
      keywords: ["berita", "news", "updates", "latest", "activity", "informasi"]
    },
  ];

  pages.forEach(page => {
    pool.push({
      ...page,
      type: 'page',
      score: 1.5 // Default score multiplier
    });
  });

  // 2. Search Experience Data
  const searchInList = (list: YearGroup[], type: 'work' | 'project' | 'organization' | 'award') => {
    list.forEach(yearGroup => {
      yearGroup.jobs.forEach((job) => {


        const anchor = `#exp-${job.title.toLowerCase().replace(/\s+/g, '-')}`;
        pool.push({
          title: job.title,
          company: job.company,
          description: job.description,
          year: yearGroup.year,
          date: job.date,
          type: type,
          url: job.url ? job.url : `/${lang}/${type}${anchor}`,
          tags: job.tag,
          score: 1.0,
          image: job.image && job.image.length > 0 ? job.image[0] : undefined
        });
      });
    });
  };

  searchInList(getWorkExperiences(dict) as YearGroup[], 'work');
  searchInList(getProjectExperiences(dict) as YearGroup[], 'project');
  searchInList(getOrganizationExperiences(dict) as YearGroup[], 'organization');
  searchInList(getAwardExperiences(dict) as YearGroup[], 'award');

  // Fetch collections and certificates concurrently
  const [collegeData, literatureData, certData] = await Promise.all([
    getCollectionsData(lang, 'college'),
    getCollectionsData(lang, 'literature'),
    getCertificatesData(lang)
  ]);

  const collectionsDataMap = [
    { type: 'college' as const, data: collegeData },
    { type: 'literature' as const, data: literatureData }
  ];

  for (const { type, data } of collectionsDataMap) {
    Object.entries(data).forEach(([category, subcategories]) => {
      Object.entries(subcategories).forEach(([subcategory, items]) => {
        Object.entries(items).forEach(([itemName, details]) => {
          pool.push({
            title: itemName,
            company: `${category} - ${subcategory}`,
            description: `${dict[type.charAt(0).toUpperCase() + type.slice(1)] || type} - ${category}`,
            type: type === 'college' ? 'page' : 'other',
            url: details.path,
            score: 0.7
          });
        });
      });
    });
  }

  // 4. Search Individual Certificates
  Object.entries(certData).forEach(([category, years]) => {
    Object.entries(years).forEach(([year, certificates]) => {
      Object.entries(certificates).forEach(([certName, details]) => {
        pool.push({
          title: certName,
          company: category,
          description: `${category} - ${year}`,
          year: year,
          date: year,
          type: 'certificate',
          url: details.path,
          score: 0.8
        });
      });
    });
  });

  // 4. Search FAQs
  const faqCategories = [
    { title: dict.FAQ_Faran_Title, prefix: 'FAQ_Faran_', url: `/${lang}/identity#faq-faran` },
    { title: dict.FAQ_Website_Title, prefix: 'FAQ_Website_', url: `/${lang}/website#faq-website` }
  ];

  faqCategories.forEach(cat => {
    for (let i = 1; i <= 10; i++) {
      const q = dict[`${cat.prefix}Q${i}`];
      const a = dict[`${cat.prefix}A${i}`];
      if (q && a) {
        pool.push({
          title: q,
          description: a.replace(/<[^>]*>/g, ''), // Strip HTML
          company: cat.title,
          type: 'faq',
          url: cat.url,
          score: 1.2
        });
      }
    }
  });

  // 5. Search Personal Context (Others)
  const otherSections = [
    { title: dict.Faran_Philosophy_Title, description: dict.Faran_Philosophy, url: `/${lang}/identity#philosophy` },
    { title: dict.Faran_Principle_Title, description: [dict.Faran_Principle_1, dict.Faran_Principle_2, dict.Faran_Principle_3].join(' '), url: `/${lang}/identity#principles` },
    { title: dict.Faran_Vision_Mission_Title, description: [dict.Faran_Vision_Mission_1, dict.Faran_Vision_Mission_2, dict.Faran_Vision_Mission_3].join(' '), url: `/${lang}/identity#vision-mission` },
  ];

  otherSections.forEach(section => {
    if (section.title && section.description) {
      pool.push({
        title: section.title,
        description: section.description.replace(/<[^>]*>/g, ''), // Strip HTML
        type: 'other',
        url: section.url,
        score: 1.1
      });
    }
  });

  // 6. Search About Me content
  const aboutMe = [
    { title: dict.About_Me || "About Me", description: dict.Faran_About_1, url: `/${lang}/identity#about` },
    { title: dict.About_Me || "About Me", description: dict.Faran_About_2, url: `/${lang}/identity#about` },
  ];

  aboutMe.forEach(item => {
    if (item.description) {
      pool.push({
        title: item.title,
        description: item.description.replace(/<[^>]*>/g, ''), // Strip HTML
        type: 'other',
        url: item.url,
        score: 1.0
      });
    }
  });

  // 7. Search News content
  const newsItems = await getNews().catch(err => {
    console.error("Error fetching news in searchContent:", err);
    return [];
  }) as unknown as NewsItem[];
  
  newsItems.forEach(item => {
    pool.push({
      title: item.title,
      description: item.content,
      company: item.author.name || "Admin",
      type: 'news',
      url: `/${lang}/news`,
      image: item.image || undefined,
      score: 1.3
    });
  });

  // Deduplicate by URL and Title
  const uniquePoolMap = new Map<string, SearchResult>();
  pool.forEach(res => {
    const key = `${res.url}-${res.title}`;
    uniquePoolMap.set(key, res);
  });

  const finalPool = Array.from(uniquePoolMap.values());
  searchPoolCache.set(lang, { pool: finalPool, timestamp: Date.now() });
  return finalPool;
}

export async function searchContent(query: string, lang: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const lowercaseQuery = query.toLowerCase().trim();
  const queryTerms = lowercaseQuery.split(/\s+/).filter(term => term.length > 1);

  const pool = await getFullSearchPool(lang);
  
  const calculateScore = (item: Partial<SearchResult>, terms: string[]) => {
    let score = 0;
    const fieldsToSearch = [
      { text: item.title || "", weight: 10 },
      { text: item.description || "", weight: 3 },
      { text: item.company || "", weight: 5 },
      { text: item.date || "", weight: 2 },
      { text: (item.tags || []).join(" "), weight: 4 },
      { text: (item.keywords || []).join(" "), weight: 8 }
    ];

    terms.forEach(term => {
      fieldsToSearch.forEach(field => {
        const lowerText = field.text.toLowerCase();
        if (lowerText.includes(term)) {
          score += field.weight;
          if (lowerText.startsWith(term)) score += field.weight * 0.5;
          if (lowerText === term) score += field.weight * 2;
        }
      });
    });
    return score;
  };

  const results: SearchResult[] = [];
  
  pool.forEach(item => {
    const baseScoreMultiplier = item.score || 1.0;
    const matchScore = calculateScore(item, queryTerms);
    if (matchScore > 0) {
      results.push({
        ...item,
        score: matchScore * baseScoreMultiplier
      });
    }
  });

  return results.sort((a, b) => {
    return (b.score || 0) - (a.score || 0);
  });
}
