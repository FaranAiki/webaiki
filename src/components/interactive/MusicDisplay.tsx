"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import FadeInSection from '@/components/shared/FadeInSection';
import PopRotateSection from '@/components/shared/PopRotateSection';
import { usePresentation } from '../providers/PresentationContext';
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
  dict?: import('@/components/layout/Translator').TranslationDict;
}

export default function MusicDisplay({ youtubeItems = [], error, lang, dict = {} }: MusicDisplayProps) {
  // GTMetrix Optimization: Delay loading of heavy iframes to significantly improve Time to Interactive (TTI) and Speed Index.
  const [spotifyLoaded, setSpotifyLoaded] = useState(false);
  const [soundCloudLoaded, setSoundCloudLoaded] = useState(false);
  const { isPresentationMode } = usePresentation();

  const isJustified = lang !== 'jp' && lang !== 'zh';
  const justifyClass = isJustified ? 'text-justify' : 'text-left';

  useEffect(() => {
    if (isPresentationMode) {
        setSpotifyLoaded(true);
        setSoundCloudLoaded(true);
    }
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
     return <main className={`p-8 text-foreground`}>{error}</main>;
  }

  return (
    <div className="w-full h-full presentation-mode:contents">
      {/* Presentation Mode */}
      {isPresentationMode && (
        <div className="presentation-container contents">
        {/* Slide 1: Spotify */}
        <FadeInSection slideIndex={1} totalSlides={totalSlides} className="w-full h-full flex-shrink-0">
          <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 pt-20 pb-10">
            <Link className="text-4xl md:text-6xl font-black mb-8 text-green-500 hover:scale-105 transition-transform" href="https://open.spotify.com/artist/1PPAtm7YfRKghHpCqR3QZZ">
              Spotify
            </Link>
            <div className="w-full h-[400px] md:h-[500px] relative rounded-3xl overflow-hidden shadow-2xl border border-theme-border">
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
            <div className="w-full h-[300px] md:h-[450px] relative rounded-3xl overflow-hidden shadow-2xl border border-theme-border">
                <iframe
                    credentialless="true"
                    className="absolute inset-0 w-full h-full"
                    scrolling="no" 
                    frameBorder="no" 
                    allow="autoplay"  
                    title="SoundCloud Player"
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
                        <span className="text-xl md:text-2xl text-theme-muted font-mono">[{idx + 1}/{youtubeSlides.length}]</span>
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
                        <div 
                            className="bg-theme-surface-strong w-full aspect-video relative mb-3 rounded-xl overflow-hidden shadow-xl transition-transform group-hover:scale-105 transform-gpu"
                            style={{ boxShadow: 'inset 0 0 0 1px rgba(var(--theme-border-rgb),0.1)' }}
                        >
                            <a href={`https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`} target="_blank" rel="noopener noreferrer">
                                <Image 
                                width={item.snippet.thumbnails.medium.width} 
                                height={item.snippet.thumbnails.medium.height} 
                                src={item.snippet.thumbnails.medium.url} 
                                alt={`${item.snippet.title} - Music Faran Aiki`}
                                className="w-full h-full object-cover scale-[1.01]"
                                />
                            </a>
                        </div>
                        <p className="text-center font-bold text-xs md:text-sm text-theme-muted line-clamp-2 px-1">
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
                    <h2 className="text-3xl font-bold text-red-500">{dict.YouTube_Playlist_Empty || 'YouTube Playlist Empty'}</h2>
                </div>
            </FadeInSection>
        )}
      </div>
      )}

      {/* Normal Mode */}
      {!isPresentationMode && (
        <div className={`block container mx-auto px-8 pt-24 pb-16 text-foreground`}>
        <div className="flex flex-col md:flex-row gap-4 md:gap-4 max-w-4xl mx-auto">    
          <div className={`text-center md:${justifyClass} w-full`}>
            
            <Link className={`transition-[transform] hover:text-green-500 duration-300 md:text-center text-5xl pt-4 font-bold text-foreground`} href="https://open.spotify.com/artist/1PPAtm7YfRKghHpCqR3QZZ">
              Spotify
            </Link>
            <br /><br />
            
            <div 
              className="w-full h-[352px] relative rounded-[12px] bg-theme-surface-strong overflow-hidden mb-8 group cursor-pointer transition-all hover:ring-2 hover:ring-green-500/50"
              onMouseEnter={() => setSpotifyLoaded(true)}
              onTouchStart={() => setSpotifyLoaded(true)}
            >
              {!spotifyLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-white/5 transition-colors group-hover:bg-black/10 dark:group-hover:bg-white/10">
                  <div className="flex flex-col items-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-theme-muted group-hover:text-green-500 transition-colors" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.021zM19.08 14.1c-.3.479-.9.6-1.38.3-3.12-1.92-7.86-2.52-11.46-1.38-.54.18-1.08-.12-1.26-.66-.18-.54.12-1.08.66-1.26 4.02-1.32 9.24-.66 12.78 1.5.54.3.72.96.36 1.5zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.72.18-1.44-.18-1.68-.9-.18-.72.18-1.44.9-1.68 4.2-1.26 11.28-1.02 15.721 1.62.66.42.84 1.26.42 1.92-.42.72-1.26.9-1.921.48z"/></svg>
                    <span className="text-theme-muted text-sm font-medium">{dict.Hover_To_Load || 'Hover to open the list'}</span>
                  </div>
                </div>
              )}
              {spotifyLoaded && (
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
              <Link className={`transition-[colors,transform] hover:text-orange-400 duration-300 md:text-center text-5xl pt-4 font-bold text-foreground`} href="https://soundcloud.com/muhammadfaranaiki">
                SoundCloud
              </Link>
              <br /><br />
              
              <div 
                className="w-full h-[300px] relative bg-theme-surface-strong overflow-hidden mb-8 rounded-lg group cursor-pointer transition-all hover:ring-2 hover:ring-orange-500/50"
                onMouseEnter={() => setSoundCloudLoaded(true)}
                onTouchStart={() => setSoundCloudLoaded(true)}
              >
                {!soundCloudLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-white/5 transition-colors group-hover:bg-black/10 dark:group-hover:bg-white/10">
                    <div className="flex flex-col items-center gap-2">
                      <svg viewBox="0 0 24 24" className="w-8 h-8 text-theme-muted group-hover:text-orange-500 transition-colors" fill="currentColor"><path d="M11.758 13.916v-6.99c0-.447.362-.809.809-.809.447 0 .809.362.809.809v6.99c0 .447-.362.809-.809.809-.447 0-.809-.362-.809-.809zM8.384 14.156v-4.145c0-.447.362-.809.809-.809.447 0 .809.362.809.809v4.145c0 .447-.362.809-.809.809-.447 0-.809-.362-.809-.809zM5.01 13.682v-2.036c0-.447.362-.809.809-.809.447 0 .809.362.809.809v2.036c0 .447-.362.809-.809.809-.447 0-.809-.362-.809-.809zM1.636 12.755v-.733c0-.447.362-.809.809-.809.447 0 .809.362.809.809v.733c0 .447-.362.809-.809.809-.447 0-.809-.362-.809-.809zM18.892 7.026c-1.848 0-3.376 1.341-3.659 3.091v4.301c.281 1.748 1.808 3.088 3.659 3.088 2.046 0 3.704-1.658 3.704-3.704 0-2.046-1.658-3.704-3.704-3.704v-3.072zM15.132 14.394v-5.26c0-.447.362-.809.809-.809.447 0 .809.362.809.809v5.26c0 .447-.362.809-.809.809-.447 0-.809-.362-.809-.809z"/></svg>
                      <span className="text-theme-muted text-sm font-medium">{dict.Hover_To_Load || 'Hover to open the list'}</span>
                    </div>
                  </div>
                )}
                {soundCloudLoaded && (
                  <iframe
                    credentialless="true"
                    className="animate-fade-in absolute inset-0 w-full h-full"
                    scrolling="no" 
                    frameBorder="no" 
                    allow="autoplay"  
                    title="SoundCloud Player"
                    src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/667105430&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false&visual=false&show_artwork=false"
                    loading="lazy"
                  ></iframe>
                )}
              </div>
            </FadeInSection>
            
            <FadeInSection>
              <Link className={`transition-[colors,transform] hover:text-red-500 duration-300 md:text-center text-5xl pt-4 font-bold text-foreground`} href="https://www.youtube.com/playlist?list=PLh4mbEw6q2QncQrgz5uaLYAcTA0MolCTe">
                YouTube
              </Link>
              <br /><br />
            </FadeInSection>
            
            <section>
              {items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                  {items.map((item) => (
                    <PopRotateSection key={item.id}> 
                      <div 
                        className={`bg-theme-surface-strong rounded-lg overflow-hidden shadow-md shadow-theme-shadow transform hover:scale-105 transition-[transform,colors] hover:text-theme-600 dark:hover:text-theme-300 duration-300 transform-gpu`}
                        style={{ boxShadow: 'inset 0 0 0 1px rgba(var(--theme-border-rgb),0.1)' }}
                      >
                        <a href={`https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`} target="_blank" rel="noopener noreferrer">
                          <Image 
                            width={item.snippet.thumbnails.medium.width} 
                            height={item.snippet.thumbnails.medium.height} 
                            src={item.snippet.thumbnails.medium.url} 
                            alt={`${item.snippet.title} - Music Faran Aiki`}
                            className="w-full h-auto object-cover scale-[1.01]"
                            loading="lazy"
                          />
                          <div className="p-3">
                            <h2 className="text-center font-semibold text-sm md:text-base text-foreground line-clamp-2">{formatCJK(item.snippet.title, lang)}</h2>
                          </div>
                        </a>
                      </div>
                    </PopRotateSection> 
                  ))}
                </div>
              ) : (
                <p className="text-theme-muted">{dict.Cannot_Load_Video || 'Cannot load video or playlist is empty.'}</p>
              )}
            </section>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
