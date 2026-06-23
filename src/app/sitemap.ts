import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

const SITE_URL = 'https://faranaiki.id';
const locales = ['en', 'id', 'zh', 'jp', 'ru', 'fr', 'ar', 'es', 'ko', 'de', 'nl', 'ha', 'he', 'el', 'hi', 'pt', 'bn', 'vi'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['', '/portfolio', '/news', '/feedback'];
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static Routes
  for (const route of routes) {
    const alternates: Record<string, string> = {};
    for (const locale of locales) {
      alternates[locale] = `${SITE_URL}/${locale}${route}`;
    }

    for (const locale of locales) {
      sitemapEntries.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'monthly' : route === '/news' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
        alternates: {
          languages: alternates
        }
      });
    }
  }

  // Dynamic News Routes
  try {
    const newsItems = await db.query.news.findMany({
      where: (news, { eq }) => eq(news.isPublic, true),
      columns: { id: true, updatedAt: true }
    });

    for (const item of newsItems) {
      const alternates: Record<string, string> = {};
      for (const locale of locales) {
        alternates[locale] = `${SITE_URL}/${locale}/news/${item.id}`;
      }

      for (const locale of locales) {
        sitemapEntries.push({
          url: `${SITE_URL}/${locale}/news/${item.id}`,
          lastModified: item.updatedAt || new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
          alternates: {
            languages: alternates
          }
        });
      }
    }
  } catch (error) {
    console.error('Error fetching news for sitemap:', error);
  }

  return sitemapEntries;
}
