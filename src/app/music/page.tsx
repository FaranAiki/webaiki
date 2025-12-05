import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";
import MusicDisplay from '@/components/MusicDisplay';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://faranaiki.id/music'),
  title: "Faran Aiki's Music",
  description: "Faran Aiki's music made using either LMMS or other DAW",
  openGraph: {
    title: "Faran Aiki's Music",
    description: "Faran Aiki's music made using either LMMS or other DAW",
    url: 'https://faranaiki.id/music',
    siteName: 'Faran Aiki\'s Music', 
    type: 'website',
  },
  icons: {
    icon: '/icon.ico',
    shortcut: '/icon.ico',
    apple: '/icon.ico',
  },
  alternates: {
    canonical: '/',
  },
};

const YOUTUBE_PLAYLIST_ITEMS_API = "https://www.googleapis.com/youtube/v3/playlistItems";

export default async function MusicPage() {
  // CRITICAL FIX: Initialize as empty array
  let youtubeItems = [];
  let errorString = undefined;

  try {
    const res = await fetch(`${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&playlistId=PLh4mbEw6q2QncQrgz5uaLYAcTA0MolCTe&key=${process.env.YOUTUBE_API_KEY}&maxResults=50`, { cache: 'no-store' });
    
    if (res.ok) {
        const youtubeData = await res.json();
        // Safe access with fallback
        youtubeItems = youtubeData.items || [];
    } else {
        errorString = "Cannot load playlist (API Error or Account status).";
        console.error("YouTube API Error:", res.status, res.statusText);
    }
  } catch (error) {
    console.error("Failed to fetch YouTube data:", error);
    errorString = "Cannot load playlist (Network Error).";
    youtubeItems = []; // Ensure it remains an array on error
  }

  return (
    <main className={`${inter.className} min-h-screen`}>
      <MusicDisplay youtubeItems={youtubeItems} error={errorString} />
    </main>
  );
}
