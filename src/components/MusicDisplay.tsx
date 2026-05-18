"use client";

import React, { useState, useEffect } from 'react';
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
  lang?: string;
}

export default function MusicDisplay({ youtubeItems = [], error, lang }: MusicDisplayProps) {
  // GTMetrix Optimization: Delay loading of heavy iframes to significantly improve Time to Interactive (TTI) and Speed Index.
  const [iframesLoaded, setIframesLoaded] = useState(false);

  const isJustified = lang !== 'jp' && lang !== 'zh';
  const justifyClass = isJustified ? 'text-justify' : 'text-left';

  useEffect(() => {
    // Load iframes after 1.5 seconds, or immediately upon user scroll
    const timer = setTimeout(() => setIframesLoaded(true), 1500);
    
    const handleScroll = () => {
      setIframesLoaded(true);
      window.removeEventListener('scroll', handleScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true, once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Notice: We completely removed the `mounted` state blockage to allow full Server-Side Rendering (SSR).
  // This instantly improves Largest Contentful Paint (LCP) and First Contentful Paint (FCP).
  // Theme colors now rely purely on Tailwind's `dark:` classes to avoid hydration mismatch errors.

  if (error) {
     return <main className={`p-8 text-gray-900 dark:text-white`}>{error}</main>;
  }

  const items = Array.isArray(youtubeItems) ? youtubeItems : [];

  return (
    <div className={`container mx-auto px-8 pt-24 pb-16 text-gray-900 dark:text-white`}>
      <div className="flex flex-col md:flex-row gap-4 md:gap-4 max-w-4xl mx-auto">    
        <div className={`text-center md:${justifyClass} w-full`}>
          
          <Link className={`transition-[transform] hover:text-green-500 duration-300 md:text-center text-5xl pt-4 font-bold text-gray-900 dark:text-white`} href="https://open.spotify.com/artist/1PPAtm7YfRKghHpCqR3QZZ">
            Spotify
          </Link>
          <br /><br />
          
          <div className="w-full h-[352px] relative rounded-[12px] bg-gray-200 dark:bg-gray-800 overflow-hidden mb-8">
            {!iframesLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">Loading Spotify Player...</span>
              </div>
            )}
            {iframesLoaded && (
              <iframe
                credentialless="true"
                className="animate-fade-in absolute inset-0 w-full h-full"
                title="Spotify Artist Player"
                data-testid="embed-iframe"
                style={{ borderRadius: '12px' }}
                src="https://open.spotify.com/embed/artist/1PPAtm7YfRKghHpCqR3QZZ?utm_source=generator"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            )}
          </div>
          
          <FadeInSection>
            <Link className={`transition-[colors,transform] hover:text-orange-400 duration-300 md:text-center text-5xl pt-4 font-bold text-gray-900 dark:text-white`} href="https://soundcloud.com/muhammadfaranaiki">
              SoundCloud
            </Link>
            <br /><br />
            
            <div className="w-full h-[300px] relative bg-gray-200 dark:bg-gray-800 overflow-hidden mb-8 rounded-lg">
              {!iframesLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">Loading SoundCloud Player...</span>
                </div>
              )}
              {iframesLoaded && (
                <iframe
                  credentialless="true"
                  className="animate-fade-in absolute inset-0 w-full h-full"
                  scrolling="no" 
                  frameBorder="no" 
                  allow="autoplay"  
                  src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/667105430&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false&visual=false&show_artwork=false"
                  loading="lazy"
                ></iframe>
              )}
            </div>
          </FadeInSection>
          
          <FadeInSection>
            <Link className={`transition-[colors,transform] hover:text-red-500 duration-300 md:text-center text-5xl pt-4 font-bold text-gray-900 dark:text-white`} href="https://www.youtube.com/playlist?list=PLh4mbEw6q2QncQrgz5uaLYAcTA0MolCTe">
              YouTube
            </Link>
            <br /><br />
          </FadeInSection>
          
          <section>
            {items.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                {items.map((item) => (
                  <PopRotateSection key={item.id}> 
                    <li className={`bg-gray-100 dark:bg-gray-800 rounded-lg overflow-visible shadow-md dark:shadow-lg transform hover:scale-105 transition-[transform,colors] hover:text-cyan-600 dark:hover:text-cyan-300 duration-300`}>
                      <a href={`https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`} target="_blank" rel="noopener noreferrer">
                        <Image 
                          width={item.snippet.thumbnails.medium.width} 
                          height={item.snippet.thumbnails.medium.height} 
                          src={item.snippet.thumbnails.medium.url} 
                          alt={item.snippet.title}
                          className="w-full h-auto object-cover rounded-t-lg"
                          loading="lazy"
                        />
                        <div className="p-3">
                          <h3 className={`text-center font-semibold text-base h-16 overflow-auto no-scrollbar text-gray-900 dark:text-white`}>{item.snippet.title}</h3>
                        </div>
                      </a>
                    </li>
                  </PopRotateSection> 
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
