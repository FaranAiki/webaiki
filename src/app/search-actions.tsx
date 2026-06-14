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

export async function searchContent(query: string, lang: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const dict = await getDictionary(lang);
  const lowercaseQuery = query.toLowerCase().trim();
  const queryTerms = lowercaseQuery.split(/\s+/).filter(term => term.length > 1);

  const results: SearchResult[] = [];

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

  // 1. Search Static Pages
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
    const score = calculateScore(page, queryTerms);
    if (score > 0) {
      results.push({
        ...page,
        type: 'page',
        score: score * 1.5
      });
    }
  });

  // 2. Search Experience Data
  const searchInList = (list: YearGroup[], type: 'work' | 'project' | 'organization' | 'award') => {
    list.forEach(yearGroup => {
      yearGroup.jobs.forEach((job) => {
        const item: Partial<SearchResult> = {
          title: job.title,
          description: job.description,
          company: job.company,
          date: job.date,
          tags: job.tag,
        };

        const score = calculateScore(item, queryTerms);

        if (score > 0) {
          const anchor = `#exp-${job.title.toLowerCase().replace(/\s+/g, '-')}`;
          results.push({
            title: job.title,
            company: job.company,
            description: job.description,
            year: yearGroup.year,
            date: job.date,
            type: type,
            url: job.url ? job.url : `/${lang}/${type}${anchor}`,
            tags: job.tag,
            score: score,
            image: job.image && job.image.length > 0 ? job.image[0] : undefined
          });
        }
      });
    });
  };

  searchInList(getWorkExperiences(dict) as YearGroup[], 'work');
  searchInList(getProjectExperiences(dict) as YearGroup[], 'project');
  searchInList(getOrganizationExperiences(dict) as YearGroup[], 'organization');
  searchInList(getAwardExperiences(dict) as YearGroup[], 'award');

  // 3. Search Collections (College & Literature)
  const collections = ['college', 'literature'] as const;
  for (const type of collections) {
    const data = await getCollectionsData(lang, type);
    Object.entries(data).forEach(([category, subcategories]) => {
      Object.entries(subcategories).forEach(([subcategory, items]) => {
        Object.entries(items).forEach(([itemName, details]) => {
          const score = calculateScore({ title: itemName, company: `${category} - ${subcategory}` }, queryTerms);
          if (score > 0) {
            results.push({
              title: itemName,
              company: `${category} - ${subcategory}`,
              description: `${dict[type.charAt(0).toUpperCase() + type.slice(1)] || type} - ${category}`,
              type: type === 'college' ? 'page' : 'other', // Mapping to page or other
              url: details.path,
              score: score * 0.7
            });
          }
        });
      });
    });
  }

  // 4. Search Individual Certificates
  const certData = await getCertificatesData(lang);
  Object.entries(certData).forEach(([category, years]) => {
    Object.entries(years).forEach(([year, certificates]) => {
      Object.entries(certificates).forEach(([certName, details]) => {
        const score = calculateScore({ title: certName, company: category, date: year }, queryTerms);
        if (score > 0) {
          results.push({
            title: certName,
            company: category,
            description: `${category} - ${year}`,
            year: year,
            date: year,
            type: 'certificate',
            url: details.path,
            score: score * 0.8 // Slightly lower priority than main categories
          });
        }
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
        const score = calculateScore({ title: q, description: a }, queryTerms);
        if (score > 0) {
          results.push({
            title: q,
            description: a.replace(/<[^>]*>/g, ''), // Strip HTML
            company: cat.title,
            type: 'faq',
            url: cat.url,
            score: score * 1.2
          });
        }
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
      const score = calculateScore({ title: section.title, description: section.description }, queryTerms);
      if (score > 0) {
        results.push({
          title: section.title,
          description: section.description.replace(/<[^>]*>/g, ''), // Strip HTML
          type: 'other',
          url: section.url,
          score: score * 1.1
        });
      }
    }
  });

  // 6. Search About Me content
  const aboutMe = [
    { title: dict.About_Me || "About Me", description: dict.Faran_About_1, url: `/${lang}/identity#about` },
    { title: dict.About_Me || "About Me", description: dict.Faran_About_2, url: `/${lang}/identity#about` },
  ];

  aboutMe.forEach(item => {
    if (item.description) {
      const score = calculateScore({ title: item.title, description: item.description }, queryTerms);
      if (score > 0) {
        results.push({
          title: item.title,
          description: item.description.replace(/<[^>]*>/g, ''), // Strip HTML
          type: 'other',
          url: item.url,
          score: score * 1.0
        });
      }
    }
  });

  // 7. Search News content
  const newsItems = await getNews() as unknown as NewsItem[];
  newsItems.forEach(item => {
    const score = calculateScore({ title: item.title, description: item.content, company: item.author.name || "Admin" }, queryTerms);
    if (score > 0) {
      results.push({
        title: item.title,
        description: item.content,
        company: item.author.name || "Admin",
        type: 'news',
        url: `/${lang}/news`,
        image: item.image || undefined,
        score: score * 1.3
      });
    }
  });

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
    return (b.score || 0) - (a.score || 0);
  });
}
