"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Github, Linkedin, Instagram, Twitter, Mail, Youtube } from 'lucide-react';
import Image from 'next/image';
import PopRotateSection from '@/components/PopRotateSection';
import FadeInSection from '@/components/FadeInSection';
import { usePresentation } from './PresentationContext';
import { motion } from 'framer-motion';

export interface SocialLink {
  name: string;
  username: string;
  url: string;
  icon: React.ReactNode;
  color: string;
}

interface SocialDisplayProps {
  customLinks?: SocialLink[];
  hidePresentation?: boolean;
}

export default function SocialDisplay({ customLinks, hidePresentation = false }: SocialDisplayProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isPresentationMode } = usePresentation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  // Dynamic Styles
  const containerText = isDark ? 'text-gray-100' : 'text-gray-900';
  const cardBg = isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-gray-200 shadow-lg';
  const usernameText = isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-black';
  const nameText = isDark ? 'text-gray-100' : 'text-gray-900';
  
  // Icon Colors
  const githubColor = isDark ? 'text-white' : 'text-gray-900';

  const defaultSocialLinks: SocialLink[] = [
    {
      name: "GitHub",
      username: "FaranAiki",
      url: "https://github.com/FaranAiki",
      icon: <Github size={48} className={githubColor} />,
      color: "hover:border-gray-500"
    },
    {
      name: "LinkedIn",
      username: "Muhammad Faran Aiki",
      url: "https://www.linkedin.com/in/muhammad-faran-aiki-8a6305343/",
      icon: <Linkedin size={48} className="text-blue-500" />,
      color: "hover:border-blue-500"
    },
    {
      name: "Instagram",
      username: "@mfaranaiki",
      url: "https://www.instagram.com/mfaranaiki/",
      icon: <Instagram size={48} className="text-pink-500" />,
      color: "hover:border-pink-500"
    },
    {
      name: "Twitter / X",
      username: "@FaranAiki",
      url: "https://x.com/FaranAiki",
      icon: <Twitter size={48} className="text-sky-500" />,
      color: "hover:border-sky-500"
    },
    {
      name: "Link Tree",
      username: "Faran Aiki",
      url: "https://linktr.ee/FaranAiki",
      icon: <Image alt="LinkTree icon" width="48" height="48" src="/images/social/linktree.webp" className="brightness-0 invert-[0.5] sepia-[1] hue-rotate-[70deg] saturate-[3]" />,
      color: "hover:border-green-200"
    },
    {
      name: "YouTube",
      username: "Muhammad Faran Aiki",
      url: "https://www.youtube.com/@FaranAiki",
      icon: <Youtube size={48} className="text-red-600" />,
      color: "hover:border-red-600"
    },
    {
      name: "TikTok",
      username: "@faranaiki07",
      url: "https://www.tiktok.com/@faranaiki07",
      icon: <Image alt="Tiktok icon" width="48" height="48" src="/images/social/tiktok.webp" className={isDark ? "brightness-0 invert" : ""} />,
      color: "hover:border-black"
    },
    {
      name: "Email",
      username: "faran.aiki.business@gmail.com",
      url: "mailto:faran.aiki.business@gmail.com",
      icon: <Mail size={48} className="text-teal-400" />,
      color: "hover:border-teal-400"
    },
    {
      name: "My Anime List",
      username: "FaranAiki",
      url: "https://myanimelist.net/profile/FaranAiki",
      icon: <Image alt='My Anime List icon' width="48" height="48" src="/images/social/myanimelist.webp" className="brightness-0 invert-[0.3] sepia-[1] hue-rotate-[190deg] saturate-[5]" />,
      color: "hover:border-blue-600"
    },
    {
      name: "Lichess",
      username: "FaranAiki",
      url: "https://lichess.org/@/FaranAiki",
      icon: <Image alt='Lichess icon' width="48" height="48" src="/images/social/lichess.webp" className={isDark ? "brightness-0 invert" : ""} />,
      color: "hover:border-white"
    },
    {
      name: "Quora",
      username: "Muhammad Faran Aiki",
      url: "https://id.quora.com/profile/Muhammad-Faran-Aiki-4",
      icon: <Image alt='Quora icon' width="48" height="48" src="/images/social/quora.webp" className="brightness-0 invert-[0.2] sepia-[1] hue-rotate-[330deg] saturate-[10]" />,
      color: "hover:border-red-600"
    },
    {
      name: "Reddit",
      username: "FaranAiki",
      url: "https://www.reddit.com/user/FaranAiki/",
      icon: <Image alt='Reddit icon' width="48" height="48" src="/images/social/reddit.webp" className="brightness-0 invert-[0.5] sepia-[1] hue-rotate-[350deg] saturate-[5]" />,
      color: "hover:border-red-300"
    },
    {
      name: "SlideShare",
      username: "Faran Aiki",
      url: "https://www.slideshare.net/MuhammadFaranAiki",
      icon: <Image alt='Slideshare icon' width="48" height="48" src="/images/social/slideshare.webp" className="brightness-0 invert-[0.5] sepia-[1] hue-rotate-[10deg] saturate-[5]" />,
      color: "hover:border-orange-300"
    },
    {
      name: "Scribd",
      username: "Muhammad Faran Aiki",
      url: "https://id.scribd.com/user/530310522/Muhammad-Faran-Aiki",
      icon: <Image alt='Scribd icon' width="48" height="48" src="/images/social/scribd.webp" className="brightness-0 invert-[0.4] sepia-[1] hue-rotate-[160deg] saturate-[5]" />,
      color: "hover:border-green-300"
    },
    {
      name: "Line",
      username: "@faranaiki_",
      url: "https://line.me/ti/p/8ZF2kENUEj",
      icon: <Image alt='Line icon' width="48" height="48" src="/images/social/line.webp" className="brightness-0 invert-[0.4] sepia-[1] hue-rotate-[80deg] saturate-[5]" />,
      color: "hover:border-green-400"
    },
    {
      name: "Telegram",
      username: "@FaranAiki",
      url: "https://t.me/FaranAiki",
      icon: <Image alt='Telegram icon' width="48" height="48" src="/images/social/telegram.webp" className="brightness-0 invert-[0.5] sepia-[1] hue-rotate-[180deg] saturate-[5]" />,
      color: "hover:border-blue-300"
    },
  ];

  const socialLinks = customLinks || defaultSocialLinks;

  // Helper function to chunk array
  const chunkArray = (arr: SocialLink[], size: number) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  const socialChunks = chunkArray(socialLinks, 4);
  const showPresentation = isPresentationMode && !hidePresentation;

  return (
    <div className="w-full h-full">
      {/* Presentation Mode: Grouped into Slides */}
      {showPresentation && (
        <div className="presentation-container">
          {socialChunks.map((chunk, chunkIdx) => (
            <FadeInSection 
              key={`social-slide-${chunkIdx}`} 
              className="w-full h-full flex-shrink-0"
              slideIndex={chunkIdx + 1}
              totalSlides={socialChunks.length}
            >
              <div className={`container mx-auto max-w-5xl ${containerText} px-4`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center justify-center">
                  {chunk.map((link, index) => (
                    <PopRotateSection key={link.name} delay={index * 100} className="h-full">
                      {/* CRITICAL: Use standard <a> instead of motion.a to avoid double-animation conflicts in popups */}
                      <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group ${cardBg} backdrop-blur-sm border rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] ${link.color} h-full min-h-[200px] shadow-sm hover:shadow-xl`}
                      >
                          <div className={`text-base ${usernameText} mb-4 transition-colors`}>
                          {link.username}
                          </div>

                          <div className="mb-6 transition-transform group-hover:scale-110 duration-300">
                              {link.icon}
                          </div>

                          <div className={`text-2xl font-bold ${nameText}`}>
                          {link.name}
                          </div>
                      </a>
                    </PopRotateSection>
                  ))}
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      )}

      {/* Normal Mode */}
      {!showPresentation && (
        <div className="block">
          <FadeInSection className="w-full h-full flex items-center justify-center py-12 md:py-20">
            <div className={`container mx-auto max-w-5xl ${containerText}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                {socialLinks.map((link, index) => (
                  <PopRotateSection key={link.name} delay={(index % 6) * 50} className="h-full">
                    {/* CRITICAL: Standard <a> to fix Framer Motion conflicts in popups */}
                    <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group ${cardBg} backdrop-blur-sm border rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-2 ${link.color} h-full shadow-sm hover:shadow-lg`}
                    >
                        <div className={`text-sm ${usernameText} mb-4 transition-colors`}>
                        {link.username}
                        </div>

                        <div className="mb-4 transition-transform group-hover:scale-110 duration-300">
                        {link.icon}
                        </div>

                        <div className={`text-lg font-semibold ${nameText}`}>
                        {link.name}
                        </div>
                    </a>
                  </PopRotateSection>
                ))}
              </div>
            </div>
          </FadeInSection>
        </div>
      )}
    </div>
  );
}
