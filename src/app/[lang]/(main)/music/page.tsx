import type { Metadata } from "next";
import "../../../globals.css";
import { Inter } from "next/font/google";
import MusicDisplay from '@/components/MusicDisplay';
import { getDictionary } from '@/components/Translator';

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return {
    metadataBase: new URL('https://faranaiki.id'),
    title: `${dict.Music} | Faran Aiki`,
    description: "Faran Aiki's music made using either LMMS or other DAW",
    openGraph: {
      title: `${dict.Music} | Faran Aiki`,
      description: "Faran Aiki's music made using either LMMS or other DAW",
      url: `https://faranaiki.id/${lang}/music`,
      siteName: "faranaiki.id",
      type: "website",
      images: [
        {
          url: '/images/photo_faran_aiki/1_fa_photo_linkedin.jpg',
          width: 1200,
          height: 630,
          alt: 'Faran Aiki',
        },
      ],
    },
    icons: {
      icon: '/icon.ico',
      shortcut: '/icon.ico',
      apple: '/icon.ico',
    },
    alternates: {
      canonical: `/${lang}/music`,
      languages: {
        'id': '/id/music',
        'en': '/en/music',
        'zh': '/zh/music',
        'jp': '/jp/music',
      }
    },
  };
}

const YOUTUBE_PLAYLIST_ITEMS_API = "https://www.googleapis.com/youtube/v3/playlistItems";

export default async function MusicPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
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

  return (
    <main className={`${inter.className} min-h-screen`}>
      <MusicDisplay youtubeItems={youtubeItems} error={errorString} lang={lang} />
    </main>
  );
}
