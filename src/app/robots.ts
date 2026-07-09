import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Global
        userAgent: '*',
        allow: '/',
      },
      {
        // Bot AI & Archiver
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'Anthropic-ai',
          'Claude-Web',
          'PerplexityBot',
          'Google-Extended',
          'bingbot',
          'DuckDuckBot',
          'archive.org_bot'
        ],
        allow: '/',
        disallow: ['/api/'], // No Global
      }
    ],
    sitemap: 'https://faranaiki.id/sitemap.xml',
    host: 'https://faranaiki.id',
  };
}
