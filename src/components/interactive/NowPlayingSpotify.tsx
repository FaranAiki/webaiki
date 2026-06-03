"use client";

/*
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Define the structure of the data we expect from our API
interface NowPlayingData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

// Spotify Icon Component
function SpotifyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-[#1DB954]">
      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.184 13.918c-.203.326-.633.43-1.02.227-2.61-1.61-5.88-1.97-9.75-.953-.456.118-.86-.19-.978-.646-.118-.456.19-.86.645-.978 4.22-1.11 7.85-.71 10.73 1.09.39.202.493.63.228 1.02zm.87-2.316c-.255.405-.79.54-1.28.283-2.92-1.8-7.3-2.31-10.75-1.26-.54.16-1.05-.18-1.2-.71-.16-.54.18-1.05.71-1.2 3.82-1.15 8.68-.58 11.96 1.48.49.3.633.83.28 1.29zm.1-2.59c-.31.5-.94.66-1.52.35-3.37-2.07-8.8-2.55-12.44-1.4-.63.2-.1.3-.39-.83-.19-.63.39-1.3.83-1.09 4.1-1.27 9.98-.74 13.73 1.58.58.35.73 1.01.39 1.51z"></path>
    </svg>
  );
}

export default function NowPlaying() {
  const [data, setData] = useState<NowPlayingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('/api/now-playing');
        const nowPlayingData = await response.json();
        setData(nowPlayingData);
      } catch (error) {
        console.error("Failed to fetch now playing data:", error);
        setData({ isPlaying: false }); // Set a default state on error
      } finally {
        setLoading(false);
      }
    };

    fetchNowPlaying();

    // Poll every 10 seconds
    const interval = setInterval(fetchNowPlaying, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-theme-muted">
        <SpotifyIcon />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0">
      {data?.isPlaying && data.songUrl ? (
        <Link href={data.songUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center space-x-3">
          {data.albumImageUrl && (
            <div className="w-10 h-10 relative flex-shrink-0">
              <Image src={data.albumImageUrl} alt={data.title} fill className="rounded-md object-cover"/>
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-theme-400 truncate group-hover:text-theme-300 transition-colors">{data.title}</p>
            <p className="text-xs text-theme-muted/80 truncate group-hover:text-theme-muted transition-colors">{data.artist}</p>
          </div>
        </Link>
      ) : (
        <div className="flex items-center space-x-2 text-theme-muted">
          <SpotifyIcon />
          <span className="text-sm hidden md:inline">Not Playing</span>
        </div>
      )}
    </div>
  );
}
*/
