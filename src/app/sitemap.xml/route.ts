import { db } from '@/lib/db';
import { HREFLANG_MAP } from '@/lib/seo';

const SITE_URL = 'https://faranaiki.id';
const locales = ['en', 'id', 'zh', 'jp', 'ru', 'fr', 'ar', 'es', 'ko', 'de', 'nl', 'ha', 'he', 'el', 'hi', 'pt', 'bn', 'vi'];

export async function GET() {
  const routes = [
    '', '/portfolio', '/news', '/feedback', 
    '/all', '/timeline', '/work', '/college',
    '/project', '/organization', '/award', '/certificate',
    '/hire-me', '/identity', '/latest', '/literature', 
    '/music', '/social', '/website'
  ];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  // Static Routes
  for (const route of routes) {
    for (const locale of locales) {
      xml += `  <url>\n    <loc>${SITE_URL}/${locale}${route}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      xml += `    <changefreq>${route === '' ? 'monthly' : route === '/news' ? 'daily' : 'weekly'}</changefreq>\n`;
      xml += `    <priority>${route === '' ? 1 : 0.8}</priority>\n`;
      
      for (const altLocale of locales) {
        const hreflang = HREFLANG_MAP[altLocale] || altLocale;
        xml += `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${SITE_URL}/${altLocale}${route}" />\n`;
      }
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/id${route}" />\n`;
      xml += `  </url>\n`;
    }
  }

  // Dynamic News Routes
  try {
    const newsItems = await db.query.news.findMany({
      where: (news, { eq }) => eq(news.isPublic, true),
      columns: { id: true, updatedAt: true }
    });

    for (const item of newsItems) {
      for (const locale of locales) {
        xml += `  <url>\n    <loc>${SITE_URL}/${locale}/news/${item.id}</loc>\n`;
        xml += `    <lastmod>${new Date(item.updatedAt || new Date()).toISOString()}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.6</priority>\n`;
        
        for (const altLocale of locales) {
          const hreflang = HREFLANG_MAP[altLocale] || altLocale;
          xml += `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${SITE_URL}/${altLocale}/news/${item.id}" />\n`;
        }
        xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/id/news/${item.id}" />\n`;
        xml += `  </url>\n`;
      }
    }
  } catch (error) {
    console.error('Error fetching news for sitemap:', error);
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
    },
  });
}
