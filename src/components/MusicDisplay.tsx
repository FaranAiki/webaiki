"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import FadeInSection from '@/components/FadeInSection';
import PopRotateSection from '@/components/PopRotateSection';
import { usePresentation } from './PresentationContext';
import { formatCJK } from '@/lib/utils';

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
  const { isPresentationMode } = usePresentation();

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

    if (isPresentationMode) {
        setIframesLoaded(true);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isPresentationMode]);

  const items = useMemo(() => Array.isArray(youtubeItems) ? youtubeItems : [], [youtubeItems]);

  // Chunk YouTube items for presentation slides (max 6 per slide)
  const youtubeSlides = useMemo(() => {
    const slides: PlaylistItem[][] = [];
    const chunkSize = 6;
    for (let i = 0; i < items.length; i += chunkSize) {
      slides.push(items.slice(i, i + chunkSize));
    }
    return slides;
  }, [items]);

  const totalSlides = 2 + (youtubeSlides.length || 1); // Spotify + SoundCloud + YouTube slides

  if (error) {
     return <main className={`p-8 text-gray-900 dark:text-white`}>{error}</main>;
  }

  return (
    <div className="w-full h-full presentation-mode:contents">
      {/* Presentation Mode */}
      <div className="hidden body-presentation-mode:contents presentation-container">
        {/* Slide 1: Spotify */}
        <FadeInSection slideIndex={1} totalSlides={totalSlides} className="w-full h-full flex-shrink-0">
          <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 pt-20 pb-10">
            <Link className="text-4xl md:text-6xl font-black mb-8 text-green-500 hover:scale-105 transition-transform" href="https://open.spotify.com/artist/1PPAtm7YfRKghHpCqR3QZZ">
              Spotify
            </Link>
            <div className="w-full h-[400px] md:h-[500px] relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <iframe
                    credentialless="true"
                    className="absolute inset-0 w-full h-full"
                    title="Spotify Artist Player"
                    style={{ borderRadius: '12px' }}
                    src="https://open.spotify.com/embed/artist/1PPAtm7YfRKghHpCqR3QZZ?utm_source=generator"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                ></iframe>
            </div>
          </div>
        </FadeInSection>

        {/* Slide 2: SoundCloud */}
        <FadeInSection slideIndex={2} totalSlides={totalSlides} className="w-full h-full flex-shrink-0">
          <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 pt-20 pb-10">
            <Link className="text-4xl md:text-6xl font-black mb-8 text-orange-500 hover:scale-105 transition-transform" href="https://soundcloud.com/muhammadfaranaiki">
              SoundCloud
            </Link>
            <div className="w-full h-[300px] md:h-[450px] relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <iframe
                    credentialless="true"
                    className="absolute inset-0 w-full h-full"
                    scrolling="no" 
                    frameBorder="no" 
                    allow="autoplay"  
                    src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/667105430&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false&visual=false&show_artwork=false"
                ></iframe>
            </div>
          </div>
        </FadeInSection>

        {/* Slide 3+: YouTube */}
        {youtubeSlides.length > 0 ? (
          youtubeSlides.map((slideItems, idx) => (
            <FadeInSection 
                key={`yt-slide-${idx}`} 
                slideIndex={3 + idx} 
                totalSlides={totalSlides} 
                className="w-full h-full flex-shrink-0"
            >
              <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto p-4 pt-20 pb-10">
                <div className="flex items-center gap-4 mb-8">
                    <Link className="text-3xl md:text-5xl font-black text-red-500 hover:scale-105 transition-transform" href="https://www.youtube.com/playlist?list=PLh4mbEw6q2QncQrgz5uaLYAcTA0MolCTe">
                    YouTube
                    </Link>
                    {youtubeSlides.length > 1 && (
                        <span className="text-xl md:text-2xl text-gray-500 font-mono">[{idx + 1}/{youtubeSlides.length}]</span>
                    )}
                </div>
                
                <div className={`grid gap-4 md:gap-6 w-full max-h-[70vh] p-2 overflow-visible no-scrollbar justify-items-center ${
                    slideItems.length === 4 
                    ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl' 
                    : slideItems.length <= 2
                    ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}>
                    {slideItems.map((item) => (
                    <div key={item.id} className="flex flex-col items-center group w-full max-w-[250px] md:max-w-[300px]">
                        <div className="bg-gray-800 w-full aspect-video relative mb-3 rounded-xl overflow-hidden shadow-xl transition-transform group-hover:scale-105 border border-white/10">
                            <a href={`https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`} target="_blank" rel="noopener noreferrer">
                                <Image 
                                width={item.snippet.thumbnails.medium.width} 
                                height={item.snippet.thumbnails.medium.height} 
                                src={item.snippet.thumbnails.medium.url} 
                                alt={item.snippet.title}
                                className="w-full h-full object-cover"
                                />
                            </a>
                        </div>
                        <p className="text-center font-bold text-xs md:text-sm text-gray-300 line-clamp-2 px-1">
                            {formatCJK(item.snippet.title, lang)}
                        </p>
                    </div>
                    ))}
                </div>
              </div>
            </FadeInSection>
          ))
        ) : (
            <FadeInSection slideIndex={3} totalSlides={totalSlides} className="w-full h-full flex-shrink-0">
                <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 pt-20 pb-10">
                    <h2 className="text-3xl font-bold text-red-500">YouTube Playlist Empty</h2>
                </div>
            </FadeInSection>
        )}
      </div>

      {/* Normal Mode */}
      <div className={`block body-presentation-mode:hidden container mx-auto px-8 pt-24 pb-16 text-gray-900 dark:text-white`}>
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
                            <h3 className={`text-center font-semibold text-base h-16 overflow-auto no-scrollbar text-gray-900 dark:text-white`}>{formatCJK(item.snippet.title, lang)}</h3>
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
    </div>
  );
}
