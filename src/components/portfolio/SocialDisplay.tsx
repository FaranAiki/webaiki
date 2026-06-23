"use client";

import React, { useEffect } from 'react';
import { Github, Linkedin, Instagram, Twitter, Mail, Youtube } from 'lucide-react';
import Image from 'next/image';
import Script from 'next/script';
import { useTheme } from 'next-themes';
import { usePresentation } from '../providers/PresentationContext';
import { motion, Variants } from 'framer-motion';

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

// Professional animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring",
      damping: 20,
      stiffness: 100,
      duration: 0.4
    }
  }
};

export const defaultSocialLinks: SocialLink[] = [
    {
      name: "GitHub",
      username: "FaranAiki",
      url: "https://github.com/FaranAiki",
      icon: <Github size={48} className="text-black dark:text-white" />,
      color: "hover:border-theme-border"
    },
    {
      name: "LinkedIn",
      username: "Muhammad Faran Aiki",
      url: "https://www.linkedin.com/in/faranaiki/",
      icon: <Linkedin size={48} className="text-theme-500" />,
      color: "hover:border-theme-500"
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
      icon: <Image alt="Tiktok icon" width="48" height="48" src="/images/social/tiktok.webp" className="dark:brightness-0 dark:invert" />,
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
      icon: <Image alt='Lichess icon' width="48" height="48" src="/images/social/lichess.webp" className="dark:brightness-0 dark:invert" />,
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

export default function SocialDisplay({ customLinks, hidePresentation = false }: SocialDisplayProps) {
  const { isPresentationMode } = usePresentation();
  const { theme, systemTheme } = useTheme();
  
  // Need mounted state for next-themes to avoid hydration mismatch
  const [mounted, setMounted] = React.useState(false);
  useEffect(() => setMounted(true), []);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const badgeTheme = mounted && currentTheme === 'dark' ? 'dark' : 'light';

  // Static/CSS-variable based styles to prevent flicker
  const containerClass = "text-foreground";
  const cardBg = "bg-[var(--card-bg)] border-[var(--card-border)] backdrop-blur-sm shadow-sm hover:shadow-lg";
  const usernameClass = "text-[var(--text-muted)] group-hover:text-foreground";
  const nameClass = "text-foreground";

  const socialLinks = customLinks || defaultSocialLinks;

  const chunkArray = (arr: SocialLink[], size: number) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  const socialChunks = chunkArray(socialLinks, 4);
  const showPresentation = isPresentationMode && !hidePresentation;

  const renderCard = (link: SocialLink, presentationMode: boolean) => {
    if (link.name === 'LinkedIn') {
      return (
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group ${cardBg} border ${presentationMode ? 'rounded-2xl p-8' : 'rounded-lg p-6'} flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 ${presentationMode ? 'hover:scale-[1.02]' : ''} h-full ${presentationMode ? 'min-h-[200px]' : ''} shadow-sm hover:shadow-lg relative overflow-hidden`}
        >
          {/* Top Banner Gradient matching the theme */}
          <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-r from-theme-500/20 to-theme-600/30 border-b border-theme-border/50" />
          
          {/* Profile Photo */}
          <div className="relative mt-4 mb-3 z-10">
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-theme-surface bg-theme-surface-strong relative shadow-md">
              <Image 
                src="/images/photo_faran_aiki/1_fa_photo_linkedin.webp" 
                alt="Muhammad Faran Aiki" 
                fill 
                className="object-cover" 
              />
            </div>
            {/* LinkedIn Badge Overlay Icon */}
            <div className="absolute -bottom-1 -right-1 bg-theme-surface rounded-full p-1 border border-theme-border shadow-sm flex items-center justify-center">
              <Linkedin size={12} className="text-theme-500" />
            </div>
          </div>

          <h3 className={`text-base font-black text-foreground mb-0.5 line-clamp-1`}>
            Muhammad Faran Aiki
          </h3>

          <p className="text-[10px] md:text-xs text-theme-muted mb-4 line-clamp-1 font-bold tracking-tight">
            Software Engineer & ITB Student
          </p>

          <span className="mt-auto px-4 py-1.5 rounded-full border border-theme-border text-[10px] md:text-xs font-black tracking-wider text-theme-500 group-hover:bg-theme-500 group-hover:text-white group-hover:border-theme-500 transition-all">
            View Profile
          </span>
        </a>
      );
    }

    if (link.name === 'Twitter / X') {
      return (
        <div className={`group ${cardBg} border ${presentationMode ? 'rounded-2xl p-4' : 'rounded-lg p-3'} flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 w-full shadow-sm hover:shadow-lg overflow-hidden`}>
          <div className="w-full relative flex flex-col items-center justify-center">
            <a 
              className="twitter-timeline w-full text-center text-xs font-bold text-theme-500" 
              href="https://x.com/FaranAiki?ref_src=twsrc%5Etfw"
              data-theme={badgeTheme}
              data-chrome="nofooter noborders noheader transparent"
            >
              Posts by @FaranAiki
            </a>
          </div>
        </div>
      );
    }

    if (link.name === 'Instagram') {
      return (
        <div className={`group ${cardBg} border ${presentationMode ? 'rounded-2xl p-4' : 'rounded-lg p-3'} flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 w-full shadow-sm hover:shadow-lg overflow-hidden`}>
          <iframe 
            src="https://www.instagram.com/kapanairi/embed/" 
            className="w-full h-[500px] sm:h-[600px] rounded-lg border-0 bg-transparent"
            allowTransparency={true}
            scrolling="no"
            frameBorder="0"
          />
        </div>
      );
    }

    if (link.name === 'TikTok') {
      return (
        <div className={`group ${cardBg} border ${presentationMode ? 'rounded-2xl p-4' : 'rounded-lg p-3'} flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 w-full shadow-sm hover:shadow-lg overflow-hidden`}>
          <iframe 
            src="https://www.tiktok.com/embed/@faranaiki07" 
            className="w-full h-[600px] sm:h-[700px] rounded-lg border-0 bg-transparent"
            allow="fullscreen"
            scrolling="no"
            frameBorder="0"
          />
        </div>
      );
    }

    if (link.name === 'GitHub') {
      return (
        <a 
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group ${cardBg} border ${presentationMode ? 'rounded-2xl p-4' : 'rounded-lg p-4'} flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 w-full shadow-sm hover:shadow-lg overflow-hidden`}
        >
          <img 
            src={`https://github-readme-stats.vercel.app/api?username=FaranAiki&show_icons=true&theme=${badgeTheme === 'dark' ? 'tokyonight' : 'default'}&hide_border=true&bg_color=00000000`}
            alt="GitHub Stats"
            className="w-full h-auto object-contain"
          />
        </a>
      );
    }
    
    return (
      <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group ${cardBg} border ${presentationMode ? 'rounded-2xl p-8' : 'rounded-lg p-6'} flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-2 ${presentationMode ? 'hover:scale-[1.02]' : ''} ${link.color} w-full shadow-sm hover:shadow-lg`}
      >
          <div className={`text-${presentationMode ? 'base' : 'sm'} ${usernameClass} mb-4 transition-colors`}>
          {link.username}
          </div>

          <div className={`mb-${presentationMode ? '6' : '4'} transition-transform group-hover:scale-110 duration-300`}>
          {link.icon}
          </div>

          <div className={`text-${presentationMode ? '2xl' : 'lg'} font-${presentationMode ? 'bold' : 'semibold'} ${nameClass}`}>
          {link.name}
          </div>
      </a>
    );
  };

  return (
    <div className="w-full h-full">
      <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />
      {showPresentation && (
        <div className="presentation-container">
          {socialChunks.map((chunk, chunkIdx) => (
            <motion.div 
              key={`social-slide-${chunkIdx}`} 
              className="w-full h-full flex-shrink-0 flex items-center justify-center presentation-section"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <div className={`container mx-auto max-w-5xl ${containerClass} px-4`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center justify-center">
                  {chunk.map((link) => (
                    <motion.div key={link.name} className="h-full" variants={itemVariants}>
                      {renderCard(link, true)}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!showPresentation && (
        <motion.div 
          className="block w-full h-full flex items-center justify-center py-12 md:py-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          <div className={`container mx-auto max-w-5xl ${containerClass}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 items-start">
              {socialLinks.map((link) => (
                <motion.div key={link.name} className="h-full" variants={itemVariants}>
                  {renderCard(link, false)}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
