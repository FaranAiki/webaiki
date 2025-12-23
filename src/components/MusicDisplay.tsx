"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Image from 'next/image';

import FadeInSection from '@/components/FadeInSection';
import PopRotateSection from '@/components/PopRotateSection';

interface PlaylistItem {
  id: string;
  snippet: {
    title: string;
    thumbnails: {
      medium: {
        url: string;
        width: number;
        height: number;
      };
    };
    resourceId: {
      videoId: string;
    };
  };
}

interface MusicDisplayProps {
  youtubeItems?: PlaylistItem[]; 
  error?: string;
}

export default function MusicDisplay({ youtubeItems = [], error }: MusicDisplayProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen"></div>;

  const isDark = resolvedTheme === 'dark';

  const containerText = isDark ? 'text-white' : 'text-gray-900';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-gray-100';
  const cardShadow = isDark ? 'shadow-lg' : 'shadow-md';
  const linkHover = isDark ? 'hover:text-cyan-300' : 'hover:text-cyan-600';
  const titleText = isDark ? 'text-white' : 'text-gray-900';

  if (error) {
     return <main className={`p-8 ${containerText}`}>{error}</main>;
  }

  const items = Array.isArray(youtubeItems) ? youtubeItems : [];

  return (
    <div className={`container mx-auto px-8 pt-24 pb-16 ${containerText}`}>
      <div className="flex flex-col md:flex-row gap-4 md:gap-4 max-w-4xl mx-auto">    
        <div className="text-center md:text-justify w-full">
          <Link className={`transition-all hover:text-green-500 duration-300 md:text-center text-5xl pt-4 font-bold ${containerText}`} href="https://open.spotify.com/artist/1PPAtm7YfRKghHpCqR3QZZ">
            Spotify
          </Link>
          <br /><br />
          <iframe
            credentialless="true"
            className="animate-fade-in"
            title="Spotify Artist Player"
            data-testid="embed-iframe"
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/artist/1PPAtm7YfRKghHpCqR3QZZ?utm_source=generator"
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
          <br /><br />
          
          <FadeInSection>
            <Link className={`transition-all hover:text-orange-400 duration-300 md:text-center text-5xl pt-4 font-bold ${containerText}`} href="https://soundcloud.com/muhammadfaranaiki">
              SoundCloud
            </Link>
            <br /><br />
            <iframe
              credentialless="true"
              className="animate-fade-in"
              width="100%" 
              height="300" 
              scrolling="no" 
              frameBorder="no" 
              allow="autoplay"  
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/667105430&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false&visual=false&show_artwork=false"
            ></iframe>
            <br /><br />
          </FadeInSection>
          
          <FadeInSection>
            <Link className={`transition-all hover:text-red-500 duration-300 md:text-center text-5xl pt-4 font-bold ${containerText}`} href="https://www.youtube.com/playlist?list=PLh4mbEw6q2QncQrgz5uaLYAcTA0MolCTe">
              YouTube
            </Link>
            <br /><br />
          </FadeInSection>
          
          <section>
            {items.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                {items.map((item) => (
                  <li key={item.id} className={`${cardBg} rounded-lg overflow-visible ${cardShadow} transform hover:scale-105 transition-all ${linkHover} duration-300`}>
                    <PopRotateSection>
                      <a href={`https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`} target="_blank" rel="noopener noreferrer">
                        <Image 
                          width={item.snippet.thumbnails.medium.width} 
                          height={item.snippet.thumbnails.medium.height} 
                          src={item.snippet.thumbnails.medium.url} 
                          alt={item.snippet.title}
                          className="w-full h-auto object-cover rounded-t-lg"
                        />
                        <div className="p-3">
                          <h3 className={`text-center font-semibold text-base h-16 overflow-auto no-scrollbar ${titleText}`}>{item.snippet.title}</h3>
                        </div>
                      </a>
                    </PopRotateSection>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">Cannot load video or playlist is empty.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
