import type { Metadata } from "next";
import "../../../globals.css";
import dynamic from 'next/dynamic';
const MusicDisplay = dynamic(() => import('@/components/interactive/MusicDisplay'), { ssr: false });
import { getDictionary } from '@/components/layout/Translator';
import { getLanguageAlternates, getBaseMetadata, SITE_URL, getBreadcrumbSchema } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','music']);
  const baseMetadata = getBaseMetadata();

  return {
    ...baseMetadata,
    title: `${dict.Music} | Faran Aiki`,
    description: "Faran Aiki's music made using either LMMS or other DAW",
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${dict.Music} | Faran Aiki`,
      description: "Faran Aiki's music made using either LMMS or other DAW",
      url: `${SITE_URL}/${lang}/music`,
    },
    alternates: {
      canonical: `/${lang}/music`,
      languages: getLanguageAlternates('/music'),
    },
  };
}

const YOUTUBE_PLAYLIST_ITEMS_API = "https://www.googleapis.com/youtube/v3/playlistItems";

export default async function MusicPage({params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang, ['home','misc-1','misc-2','misc-3','website','navbar','music']);
  
  let youtubeItems = [];
  let errorString = undefined;

  try {
    // GTMetrix Optimization: Switched from `cache: 'no-store'` to ISR `revalidate: 3600`.
    // This allows the server to cache the API response for 1 hour, cutting down TTFB immensely.
    const res = await fetch(`${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=PLh4mbEw6q2QncQrgz5uaLYAcTA0MolCTe&key=${process.env.YOUTUBE_API_KEY}&maxResults=50`, { next: { revalidate: 3600 } });
    
    if (res.ok) {
        const youtubeData = await res.json();
        youtubeItems = youtubeData.items || [];
    } else {
        errorString = "Cannot load playlist (API Error or Account status).";
        console.error("YouTube API Error:", res.status, res.statusText);
    }
  } catch (error) {
    console.error("Failed to fetch YouTube data:", error);
    errorString = "Cannot load playlist (Network Error).";
    youtubeItems = []; 
  }

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: dict.Home, item: `/${lang}` },
    { name: dict.Music, item: `/${lang}/music` },
  ]);

  return (
    <main className="min-h-screen">
      <h1 className="sr-only">{dict.Music}</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MusicDisplay youtubeItems={youtubeItems} error={errorString} lang={lang} dict={dict} />
    </main>
  );
}
