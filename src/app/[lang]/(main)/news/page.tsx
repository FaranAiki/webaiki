import type { Metadata } from "next";
import { getDictionary } from '@/components/layout/Translator';
import NewsDisplay from '@/components/interactive/NewsDisplay';
import { getBaseMetadata, getLanguageAlternates , getBreadcrumbSchema } from '@/lib/seo';
import { getNews } from '@/app/actions';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','news']);
  
  const title = `${dict.News} - Muhammad Faran Aiki`;
  const description = dict.No_News || "Latest news and updates.";
  
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      url: `https://faranaiki.id/${lang}/news`,
      images: [
        {
          url: `https://faranaiki.id/og-default.png`,
          width: 1200,
          height: 630,
        }
      ]
    },
    alternates: {
      canonical: `/${lang}/news`,
      languages: getLanguageAlternates('/news'),
    },
  };
}

export default async function NewsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const [dict, news] = await Promise.all([
    getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','news']),
    getNews()
  ]);

  const newsDict = {
    News: dict.News,
    Post_News: dict.Post_News,
    Drop_Here: dict.Drop_Here,
    Title: dict.Title,
    Image_Optional: dict.Image_Optional,
    Upload_Photo: dict.Upload_Photo,
    Content: dict.Content,
    Waiting: dict.Waiting,
    Send: dict.Send,
    Delete: dict.Delete,
    News_Deleted: dict.News_Deleted,
    News_Submitted: dict.News_Submitted,
    Latest_News: dict.Latest_News,
    Search_News: dict.Search_News,
    No_News: dict.No_News,
    Read_More: dict.Read_More
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      getBreadcrumbSchema([
        { name: 'Home', item: `/${lang}` },
        { name: dict.News || 'News', item: `/${lang}/news` }
      ])
    ]
  };

  return (
    <main className="container mx-auto px-4 md:px-8 pt-32 pb-16 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsDisplay 
        dict={newsDict as import('@/components/layout/Translator').TranslationDict} 
        lang={lang} 
        isAdmin={false} 
        initialNews={JSON.parse(JSON.stringify(news))} 
      />
    </main>
  );
}
