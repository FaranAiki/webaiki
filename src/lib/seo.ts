import { Metadata } from "next";

export function extractKeywords(text: string, limit: number = 10): string[] {
  if (!text) return [];
  // Basic keyword extraction: remove common stop words and return most frequent words
  const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'to', 'in', 'for', 'of', 'with', 'that', 'this', 'it', 'as', 'by', 'are', 'be', 'or', 'from', 'can', 'we', 'you', 'your', 'our', 'all', 'any', 'have', 'has', 'was', 'were', 'been', 'will', 'would', 'should', 'could', 'but', 'not', 'if', 'then', 'than', 'more', 'less', 'about', 'some', 'many', 'much', 'very', 'how', 'what', 'when', 'where', 'who', 'why', 'there', 'their', 'they', 'them', 'these', 'those']);
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w));
  const counts = words.reduce((acc, w) => { acc[w] = (acc[w] || 0) + 1; return acc; }, {} as Record<string, number>);
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit).map(e => e[0]);
}

export function generateKeywordScrambles(phrase: string): string[] {
  const words = phrase.toLowerCase().split(' ').filter(Boolean);
  const results = new Set<string>();
  
  const permute = (arr: string[], m: string[] = []) => {
    if (arr.length === 0) {
      results.add(m.join(' '));
    } else {
      for (let i = 0; i < arr.length; i++) {
        const curr = arr.slice();
        const next = curr.splice(i, 1);
        permute(curr, m.concat(next));
      }
    }
  }
  
  permute(words);
  return Array.from(results);
}
export const LOCALES = ['en', 'id', 'zh', 'jp', 'ru', 'fr', 'ar', 'es', 'ko', 'de', 'nl', 'ha', 'he', 'el', 'hi', 'pt', 'bn', 'vi'];

// Map locale codes to hreflang codes (Next.js Metadata alternates.languages keys)
// 'ja' is the standard code for Japanese, but our URL path uses 'jp'
export const HREFLANG_MAP: import('@/components/layout/Translator').TranslationDict = {
  id: 'id',
  en: 'en',
  zh: 'zh',
  jp: 'ja',
  ru: 'ru',
  fr: 'fr',
  ar: 'ar',
  es: 'es',
  ko: 'ko',
  de: 'de',
  nl: 'nl',
  ha: 'ha',
  he: 'he',
  el: 'el',
  hi: 'hi',
  pt: 'pt',
  bn: 'bn',
  vi: 'vi',
};

export const SITE_URL = 'https://faranaiki.id';

export function getLanguageAlternates(path: string) {
  const languages: import('@/components/layout/Translator').TranslationDict = {};
  
  LOCALES.forEach((loc) => {
    const hreflang = HREFLANG_MAP[loc] || loc;
    languages[hreflang] = `${SITE_URL}/${loc}${path}`;
  });

  // Add x-default pointing to the default language (Indonesian in this case)
  languages['x-default'] = `${SITE_URL}/id${path}`;

  return languages;
}

export function getNewsArticleSchema(news: { title: string; image?: string | null; createdAt: Date; author: { name: string | null } }) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": news.title,
    "image": news.image ? [news.image] : [],
    "datePublished": new Date(news.createdAt).toISOString(),
    "dateModified": new Date(news.createdAt).toISOString(),
    "author": [{
      "@type": "Person",
      "name": news.author.name || "Muhammad Faran Aiki",
      "url": SITE_URL
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Muhammad Faran Aiki",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/images/og-preview.jpg`
      }
    }
  };
}

export function getBaseMetadata(dict: import('@/components/layout/Translator').TranslationDict = {}): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: 'Muhammad Faran Aiki (Faran)',
      template: '%s | Muhammad Faran Aiki',
    },
    description: dict.SEO_Description || "Official personal website of Muhammad Faran Aiki (also known as Faran Aiki or simply Faran) - Software Engineer, Computer Science Student at ITB, and SAT Tutor.",
    keywords: [
      "Muhammad Faran Aiki", "Faran Aiki", "Faran", "Aiki", "faranaiki",
      "muhammad faran", "muhammad aiki", "faran itb", "faran onmipa", "faran aiki itb", "muhammad faran itb",
      "software engineer faran", "faran software engineer", "matematika faran", "mtk faran", "faran mtk",
      "faran aiki olimpiade matematika", "muhammad faran olimpiade", "faran olimpiade matematika",
      "farhan aiki", "faran aik", "farhan aik", "farran aiki", "farhan aiky", "muhammad farhan aiki",
      "muhammad faran aik", "m faran aiki", "m farhan aiki", "farran", "aiky", "faran aiki portfolio",
      "tutor matematika faran", "sat tutor faran aiki", "guru privat matematika", "penulis modul utbk",
      "analitica software engineer", "gdg itb faran", "paragon scholarship faran", "alkyl compiler faran",
      "osn matematika faran", "faran osn", "hackerrank faran", "kmnr faran", "eduversal faran",
      "faran kangaroo math", "faran hackvidia", "kompetisi literasi numerasi faran", "sertifikat faran aiki",
      "webaiki", "web aiki", "webaiki faran aiki",
      "who is muhammad faran aiki", "faran aiki linkedin", "faran aiki github", "hire next.js developer indonesia",
      "Software Engineer", "Web Developer", "ITB Student", "STI ITB",
      "Bandung Institute of Technology", "Institut Teknologi Bandung", "Portfolio", "Indonesia",
      "Full Stack Developer", "Data Analyst", "SAT Tutor", "ONMIPA Matematika", "ONMIPA PT",
      "Next.js Developer", "React Developer", "TypeScript", "Hire Muhammad Faran Aiki", "Best Software Engineer Indonesia",
      dict.Software_Engineer || "Software Engineer", dict.Mathematics || "Mathematics",
      ...generateKeywordScrambles("Muhammad Faran Aiki"),
      ...generateKeywordScrambles("Software Engineer ITB")
    ],
    authors: [{ name: "Muhammad Faran Aiki", url: SITE_URL }],
    creator: "Muhammad Faran Aiki",
    publisher: "Muhammad Faran Aiki",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    manifest: '/manifest.json',
    alternates: {
      languages: getLanguageAlternates(''),
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'xZMulZsvn0xj7TrxhEN8O9KLWSmNIfx6tqFtOpbgOV4',
      yandex: '19e93e9065247166',
      yahoo: '', // Insert Yahoo site verification ID here if available
      other: {
        'msvalidate.01': '2EB0055DF3DBEDEFD420F081B721CF01',
        'bing-site-verification': '769fffac4599a44b95e49e6e0142599',
        'baidu-site-verification': '', // Insert Baidu site verification ID here if available
      },
    },
    openGraph: {
      type: 'profile',
      firstName: 'Muhammad Faran',
      lastName: 'Aiki',
      username: 'faranaiki',
      gender: 'male',
      siteName: 'Muhammad Faran Aiki',
      url: SITE_URL,
      images: [
        {
          url: `${SITE_URL}/api/og?title=Muhammad Faran Aiki`,
          width: 1200,
          height: 630,
          alt: 'Muhammad Faran Aiki - Software Engineer Portfolio',
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Muhammad Faran Aiki',
      description: 'Software Engineer and ITB Student Portfolio',
      creator: '@faranaiki',
      images: [`${SITE_URL}/api/og?title=Muhammad Faran Aiki`],
    },
    category: 'technology',

    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'Muhammad Faran Aiki',
    },
  };
}

export function getPersonSchema(lang: string, description?: string) {
  return {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    "name": "Muhammad Faran Aiki",
    "givenName": "Muhammad Faran",
    "familyName": "Aiki",
    "additionalName": ["Faran", "Aiki", "Muhammad Aiki"],
    "alternateName": ["Faran Aiki", "FaranAiki", "Faran ITB", "Faran ONMIPA", "mfaranaiki"],
    "url": SITE_URL,
    "image": `${SITE_URL}/images/og-preview.jpg`,
    "sameAs": [
      "https://github.com/FaranAiki",
      "https://medium.com/@18225122",
      "https://tlx.toki.id/profiles/FaranAiki",
      "https://www.shazam.com/artist/muhammad-faran-aiki/1597498603",
      "https://www.linkedin.com/in/faranaiki/",
      "https://www.instagram.com/mfaranaiki/",
      "https://x.com/FaranAiki",
      "https://linktr.ee/FaranAiki",
      "https://www.youtube.com/@FaranAiki",
      "https://myanimelist.net/profile/FaranAiki"
    ],
    "jobTitle": "Software Engineer & ITB Student",
    "description": description || "Muhammad Faran Aiki is a Software Engineer, Mathematics Enthusiast, ONMIPA Medalist, and Computer Science Student at ITB (Institut Teknologi Bandung). He specializes in full-stack web development and data analysis.",
    "knowsAbout": ["Software Engineering", "Mathematics", "ONMIPA", "Python", "React", "Next.js", "Flutter", "Web Development"],
    "alumniOf": [
      {
        "@type": "CollegeOrUniversity",
        "name": "Bandung Institute of Technology",
        "alternateName": ["ITB", "Institut Teknologi Bandung"]
      }
    ],
    "award": [
      "ONMIPA Matematika Medalist"
    ]
  };
}

export function getWebsiteSchema(lang: string) {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    "url": SITE_URL,
    "name": "Muhammad Faran Aiki - Personal Website",
    "alternateName": ["Faran Aiki", "Faran", "Aiki", "webaiki", "web aiki"],
    "publisher": { "@id": `${SITE_URL}/#person` },
    "inLanguage": lang,
  };
}

export function getProfilePageSchema(_lang: string) {
  return {
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profilepage`,
    "url": SITE_URL,
    "name": "Muhammad Faran Aiki (Faran Aiki) - Software Engineer Portfolio",
    "description": "Muhammad Faran Aiki, often known as Faran Aiki or just Faran, is a Software Engineer, Mathematics Enthusiast, ONMIPA Medalist, and Computer Science Student at ITB.",
    "mainEntity": { "@id": `${SITE_URL}/#person` },
  };
}

export function getBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item.startsWith('http') ? item.item : `${SITE_URL}${item.item}`,
    })),
  };
}

export function getWorkSchema(experiences: { jobs: { title: string; company: string; description: string }[] }[]) {
  return experiences.flatMap(yearGroup => 
    yearGroup.jobs.map((job) => ({
      "@type": "OrganizationRole",
      "roleName": job.title,
      "memberOf": {
        "@type": "Organization",
        "name": job.company,
      },
      "description": job.description,
    }))
  );
}

export function getProjectSchema(experiences: { jobs: { title: string; link?: string; url?: string; description: string; company: string }[] }[]) {
  return experiences.flatMap(yearGroup =>
    yearGroup.jobs.map((proj) => ({
      "@type": "CreativeWork",
      "name": proj.title,
      "description": proj.description,
      "url": proj.link || proj.url,
      "keywords": proj.company,
    }))
  );
}

export function getFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}
