import { getNews } from '@/app/actions';
import { SITE_URL } from '@/lib/seo';

export async function GET() {
  const newsItems = await getNews();
  
  // Google News sitemap should only include articles published in the last 2 days.
  // However, for a portfolio/personal site, we might want to include all if they are few.
  // Let's filter for the last 48 hours for strict compliance, or just the latest 1000.
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  // We'll be slightly more lenient but follow the 1000 limit.
  const eligibleNews = newsItems.slice(0, 1000);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${eligibleNews.map((item) => `
  <url>
    <loc>${SITE_URL}/en/news/${item.id}</loc>
    <news:news>
      <news:publication>
        <news:name>Muhammad Faran Aiki</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(item.createdAt).toISOString()}</news:publication_date>
      <news:title>${item.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</news:title>
    </news:news>
  </url>
  `).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
    },
  });
}
