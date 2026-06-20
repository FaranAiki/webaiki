/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://faranaiki.id',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  priority: 0.7,
  changefreq: 'daily',
  exclude: ['/admin*', '/thank-you'],
  alternateRefs: [
    { href: 'https://faranaiki.id/en', hreflang: 'en' },
    { href: 'https://faranaiki.id/id', hreflang: 'id' },
    { href: 'https://faranaiki.id/zh', hreflang: 'zh' },
    { href: 'https://faranaiki.id/jp', hreflang: 'ja' },
    { href: 'https://faranaiki.id/ru', hreflang: 'ru' },
    { href: 'https://faranaiki.id/fr', hreflang: 'fr' },
    { href: 'https://faranaiki.id/ar', hreflang: 'ar' },
    { href: 'https://faranaiki.id/es', hreflang: 'es' },
    { href: 'https://faranaiki.id/ko', hreflang: 'ko' },
    { href: 'https://faranaiki.id/de', hreflang: 'de' },
    { href: 'https://faranaiki.id/nl', hreflang: 'nl' },
    { href: 'https://faranaiki.id/ha', hreflang: 'ha' },
    { href: 'https://faranaiki.id/he', hreflang: 'he' },
    { href: 'https://faranaiki.id/el', hreflang: 'el' },
    { href: 'https://faranaiki.id/hi', hreflang: 'hi' },
    { href: 'https://faranaiki.id/pt', hreflang: 'pt' },
    { href: 'https://faranaiki.id/bn', hreflang: 'bn' },
    { href: 'https://faranaiki.id/vi', hreflang: 'vi' },
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
      },
      {
        userAgent: 'Anthropic-ai',
        allow: '/',
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://faranaiki.id/sitemap-news.xml',
    ],
  },
  transform: async (config, path) => {
    // Custom logic for priority and changefreq based on path
    let priority = config.priority;
    if (path === '/' || path === '/id' || path === '/en') {
      priority = 1.0;
    } else if (path.includes('/work') || path.includes('/project')) {
      priority = 0.9;
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
