"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Github, Linkedin, Instagram, Twitter, Mail, Youtube } from 'lucide-react';
import Image from 'next/image';
import FadeInSection from '@/components/FadeInSection';
import PopRotateSection from '@/components/PopRotateSection';
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://faranaiki.id/social'),
  title: "Faran Aiki's Social Media",
  description: "Faran Aiki's social media",
  openGraph: {
    title: "Faran Aiki's Social Media",
    description: "Faran Aiki's Social Media",
    url: 'https://faranaiki.id/social',
    siteName: 'Faran Aiki\'s Social Media', 
    type: 'website',
  },
  icons: { icon: '/icon.ico', shortcut: '/icon.ico', apple: '/icon.ico' },
  alternates: { canonical: '/' },
};

interface SocialDisplayProps {
  pageTitle: string;
}

export default function SocialDisplay({ pageTitle }: SocialDisplayProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen"></div>;

  const isDark = resolvedTheme === 'dark';

  // Dynamic Styles
  const containerText = isDark ? 'text-gray-100' : 'text-gray-900';
  const cardBg = isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-gray-200 shadow-lg';
  const usernameText = isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-black';
  const nameText = isDark ? 'text-gray-100' : 'text-gray-900';
  
  // Icon Colors
  const githubColor = isDark ? 'text-white' : 'text-gray-900';

  const socialLinks = [
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
      url: "https://linktr.ee/FaranAiki", // Fixed: Added protocol
      icon: <Image alt="LinkTree icon" width="48" height="48" src="https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/Linktree_logo.svg/768px-Linktree_logo.svg.png?20230519151448" priority unoptimized />,
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
      icon: <Image alt="Tiktok icon" width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Tiktok_icon.svg" unoptimized />,
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
      icon: <Image alt='My Anime List icon' width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png" priority />,
      color: "hover:border-blue-600"
    },
    {
      name: "Lichess",
      username: "FaranAiki",
      url: "https://lichess.org/@/FaranAiki",
      icon: <Image alt='Lichess icon' width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/d/da/Lichess_Logo_2019.svg" />,
      color: "hover:border-white"
    },
    {
      name: "Quora",
      username: "Muhammad Faran Aiki",
      url: "https://id.quora.com/profile/Muhammad-Faran-Aiki-4",
      icon: <Image alt='Quora icon' width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/0/09/Quora_icon.svg" priority />,
      color: "hover:border-red-600"
    },
    {
      name: "Reddit",
      username: "FaranAiki",
      url: "https://www.reddit.com/user/FaranAiki/",
      icon: <Image alt='Reddit icon' width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Snoo.svg" priority  />,
      color: "hover:border-red-300"
    },
    {
      name: "SlideShare",
      username: "Faran Aiki",
      url: "https://www.slideshare.net/MuhammadFaranAiki",
      icon: <Image alt='Slideshare icon' width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/e/e1/SlideShare_logo.svg" priority  />,
      color: "hover:border-orange-300"
    },
    {
      name: "Scribd",
      username: "Muhammad Faran Aiki",
      url: "https://id.scribd.com/user/530310522/Muhammad-Faran-Aiki",
      icon: <Image alt='Slideshare icon' width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/5/52/Scribd_logo_%282%29.svg" priority  />,
      color: "hover:border-green-300"
    },
    {
      name: "Line",
      username: "@faranaiki_",
      url: "https://line.me/ti/p/8ZF2kENUEj",
      icon: <Image alt='Line icon' width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" priority  />,
      color: "hover:border-green-400"
    },
    {
      name: "Telegram",
      username: "@FaranAiki",
      url: "https://t.me/FaranAiki",
      icon: <Image alt='Telegram icon' width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" priority  />,
      color: "hover:border-blue-300"
    },
  ];

  return (
    <FadeInSection slideIndex={1} totalSlides={1} className="w-full h-full flex items-center justify-center">
      <div className={`container mx-auto max-w-5xl ${containerText}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {socialLinks.map((link, index) => (
            // Adjusted logic: Cap the delay to avoid excessive waiting for items at the bottom of the list.
            // Using (index % 4) ensures the staggering effect resets every row (approx), keeping animations snappy.
            <PopRotateSection key={link.name} delay={(index % 6) * 50} className="h-full">
              <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group ${cardBg} backdrop-blur-sm border rounded-lg p-6 flex flex-col items-center justify-center text-center transition-[transform] duration-300 transform hover:-translate-y-2 ${link.color} h-full`}
              >
                  <div className={`text-sm ${usernameText} mb-4 transition-colors`}>
                  {link.username}
                  </div>

                  <div className="mb-4">
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
  );
}

