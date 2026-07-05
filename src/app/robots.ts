import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: ['bingbot', 'DuckDuckBot', 'archive.org_bot'],
        allow: '/',
      }
    ],
    sitemap: 'https://faranaiki.id/sitemap.xml',
  };
}
