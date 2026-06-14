import { Metadata } from "next";

export const LOCALES = ['en', 'id', 'zh', 'jp', 'ru', 'fr', 'ar', 'es', 'ko', 'de', 'nl', 'ha', 'he', 'el', 'hi', 'pt', 'bn', 'vi'];

// Map locale codes to hreflang codes (Next.js Metadata alternates.languages keys)
// 'ja' is the standard code for Japanese, but our URL path uses 'jp'
export const HREFLANG_MAP: Record<string, string> = {
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
  const languages: Record<string, string> = {};
  
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

export function getBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: 'Muhammad Faran Aiki',
      template: '%s | Muhammad Faran Aiki',
    },
    description: "Official personal website of Muhammad Faran Aiki - Software Engineer, Computer Science Student at ITB, and SAT Tutor.",
    keywords: [
      "Muhammad Faran Aiki", "Faran Aiki", "Faran", "Aiki", "faranaiki",
      "Software Engineer", "Web Developer", "ITB Student", "STI ITB",
      "Bandung Institute of Technology", "Portfolio", "Indonesia"
    ],
    authors: [{ name: "Muhammad Faran Aiki", url: SITE_URL }],
    creator: "Muhammad Faran Aiki",
    publisher: "Muhammad Faran Aiki",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: '/',
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
      // Add other verifications if you have them (Bing, Yandex, etc)
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
          url: `${SITE_URL}/images/og-preview.jpg`,
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
      images: [`${SITE_URL}/images/og-preview.jpg`],
    },
    category: 'technology',
  };
}

export function getPersonSchema(lang: string, description?: string) {
  return {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    "name": "Muhammad Faran Aiki",
    "givenName": "Muhammad Faran",
    "familyName": "Aiki",
    "additionalName": ["Faran", "Aiki"],
    "url": SITE_URL,
    "image": `${SITE_URL}/images/og-preview.jpg`,
    "sameAs": [
      "https://github.com/faranaiki",
      "https://linkedin.com/in/faranaiki",
      "https://faranaiki.site"
    ],
    "jobTitle": "Software Engineer",
    "description": description || "Muhammad Faran Aiki is a Software Engineer and Computer Science Student at ITB, specializing in full-stack development and data analysis.",
    "knowsAbout": ["Software Engineering", "Mathematics", "Python", "React", "Next.js", "Flutter"],
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "Bandung Institute of Technology"
    }
  };
}

export function getWebsiteSchema(lang: string) {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    "url": SITE_URL,
    "name": "Muhammad Faran Aiki - Personal Website",
    "alternateName": ["Faran Aiki", "Faran", "Aiki"],
    "publisher": { "@id": `${SITE_URL}/#person` },
    "inLanguage": lang,
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
