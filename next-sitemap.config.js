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
    { href: 'https://faranaiki.id/ja', hreflang: 'ja' },
    { href: 'https://faranaiki.id/ru', hreflang: 'ru' },
    { href: 'https://faranaiki.id/fr', hreflang: 'fr' },
    { href: 'https://faranaiki.id/ar', hreflang: 'ar' },
    { href: 'https://faranaiki.id/es', hreflang: 'es' },
    { href: 'https://faranaiki.id/ko', hreflang: 'ko' },
    { href: 'https://faranaiki.id/de', hreflang: 'de' },
    { href: 'https://faranaiki.id/nl', hreflang: 'nl' },
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
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
