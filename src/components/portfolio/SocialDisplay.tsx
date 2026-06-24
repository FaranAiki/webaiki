"use client";

import React, { useEffect } from 'react';
import { Github, Linkedin, Instagram, Twitter, Mail, Youtube } from 'lucide-react';
import Image from 'next/image';
import Script from 'next/script';
import { useTheme } from 'next-themes';
import { usePresentation } from '../providers/PresentationContext';
import { motion, Variants } from 'framer-motion';

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: () => void;
      };
    };
  }
}

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
  dict?: Record<string, string>;
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

const MaskIcon = ({ src, colorClass }: { src: string, colorClass: string }) => (
  <div 
    className={`w-[48px] h-[48px] ${colorClass} transition-colors duration-300`} 
    style={{ 
      WebkitMaskImage: `url('${src}')`, 
      WebkitMaskSize: 'contain', 
      WebkitMaskRepeat: 'no-repeat', 
      WebkitMaskPosition: 'center',
      maskImage: `url('${src}')`,
      maskSize: 'contain',
      maskRepeat: 'no-repeat',
      maskPosition: 'center'
    }} 
  />
);

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
      icon: <MaskIcon src="/images/social/linktree.webp" colorClass="bg-green-600 dark:bg-green-400" />,
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
      icon: <MaskIcon src="/images/social/myanimelist.webp" colorClass="bg-blue-600 dark:bg-blue-400" />,
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
      icon: <MaskIcon src="/images/social/quora.webp" colorClass="bg-red-600 dark:bg-red-500" />,
      color: "hover:border-red-600"
    },
    {
      name: "Reddit",
      username: "FaranAiki",
      url: "https://www.reddit.com/user/FaranAiki/",
      icon: <MaskIcon src="/images/social/reddit.webp" colorClass="bg-orange-600 dark:bg-orange-500" />,
      color: "hover:border-red-300"
    },
    {
      name: "SlideShare",
      username: "Faran Aiki",
      url: "https://www.slideshare.net/MuhammadFaranAiki",
      icon: <MaskIcon src="/images/social/slideshare.webp" colorClass="bg-blue-500 dark:bg-blue-400" />,
      color: "hover:border-orange-300"
    },
    {
      name: "Scribd",
      username: "Muhammad Faran Aiki",
      url: "https://id.scribd.com/user/530310522/Muhammad-Faran-Aiki",
      icon: <MaskIcon src="/images/social/scribd.webp" colorClass="bg-teal-600 dark:bg-teal-400" />,
      color: "hover:border-green-300"
    },
    {
      name: "Line",
      username: "@faranaiki_",
      url: "https://line.me/ti/p/8ZF2kENUEj",
      icon: <MaskIcon src="/images/social/line.webp" colorClass="bg-green-500 dark:bg-green-400" />,
      color: "hover:border-green-400"
    },
    {
      name: "Telegram",
      username: "@FaranAiki",
      url: "https://t.me/FaranAiki",
      icon: <MaskIcon src="/images/social/telegram.webp" colorClass="bg-blue-500 dark:bg-blue-400" />,
      color: "hover:border-blue-300"
    },
  ];

export default function SocialDisplay({ customLinks, hidePresentation = false, dict = {} }: SocialDisplayProps) {
  const { isPresentationMode } = usePresentation();
  const { theme, systemTheme } = useTheme();
  
  // Need mounted state for next-themes to avoid hydration mismatch
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Force Twitter widget to rescan the DOM and render the timeline
    // This handles both client-side navigation and theme toggling
    if (mounted && typeof window !== 'undefined' && window.twttr && window.twttr.widgets) {
      setTimeout(() => {
        window.twttr?.widgets?.load();
      }, 100);
    }
  }, [mounted, theme, systemTheme]);

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
            {dict.View_Profile || "View Profile"}
          </span>
        </a>
      );
    }

    if (link.name === 'Twitter / X') {
      return (
        <a 
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group ${cardBg} border ${presentationMode ? 'rounded-2xl p-6' : 'rounded-lg p-5'} flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 w-full shadow-sm hover:shadow-lg overflow-hidden relative min-h-[300px]`}
        >
          {/* Accent Header */}
          <div className="absolute top-0 inset-x-0 h-16 bg-blue-500/10 dark:bg-zinc-800/50 border-b border-blue-500/20 dark:border-zinc-700/50" />
          
          <div className="relative mt-2 mb-4 z-10 bg-theme-surface rounded-full p-4 border-4 border-theme-surface shadow-md group-hover:scale-110 transition-transform duration-300">
             <Twitter size={48} className="text-blue-500 dark:text-zinc-100" />
          </div>

          <h3 className="text-xl font-black text-foreground mb-1 relative z-10">Faran Aiki</h3>
          <p className="text-xs text-theme-muted font-bold tracking-tight mb-6 relative z-10">
            @FaranAiki
          </p>

          <span className="mt-auto px-6 py-2.5 rounded-full bg-blue-500 dark:bg-zinc-800 text-white text-xs font-black tracking-wider shadow-sm group-hover:bg-blue-600 dark:group-hover:bg-zinc-700 group-hover:shadow-md transition-all flex items-center gap-2">
            <Twitter size={16} />
            {dict.View_Profile || "View Profile"}
          </span>
        </a>
      );
    }

    if (link.name === 'Instagram') {
      return (
        <div className={`group ${cardBg} border ${presentationMode ? 'rounded-2xl p-4' : 'rounded-lg p-3'} flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 w-full shadow-sm hover:shadow-lg overflow-hidden`}>
          <iframe 
            src="https://www.instagram.com/mfaranaiki/embed/" 
            className="w-full h-[400px] sm:h-[450px] rounded-lg border-0 bg-transparent"
            allowtransparency="true"
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
            className="w-full h-[400px] sm:h-[450px] rounded-lg border-0 bg-transparent"
            allow="fullscreen"
            scrolling="no"
            frameBorder="0"
          />
        </div>
      );
    }

    if (link.name === 'YouTube') {
      return (
        <a 
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group ${cardBg} border ${presentationMode ? 'rounded-2xl p-6' : 'rounded-lg p-5'} flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 w-full shadow-sm hover:shadow-lg overflow-hidden relative min-h-[300px]`}
        >
          <div className="absolute top-0 inset-x-0 h-16 bg-red-600/10 border-b border-red-500/20" />
          
          <div className="relative mt-2 mb-4 z-10 bg-theme-surface rounded-full p-4 border-4 border-theme-surface shadow-md group-hover:scale-110 transition-transform duration-300">
             <Youtube size={48} className="text-red-500" />
          </div>

          <h3 className="text-xl font-black text-foreground mb-1 relative z-10">Faran Aiki</h3>
          <p className="text-xs text-theme-muted font-bold tracking-tight mb-6 relative z-10">
            {dict.Official_YouTube_Channel || "Official YouTube Channel"}
          </p>

          <span className="mt-auto px-6 py-2.5 rounded-full bg-red-600 text-white text-xs font-black tracking-wider shadow-sm group-hover:bg-red-700 group-hover:shadow-md transition-all flex items-center gap-2">
            <Youtube size={16} />
            {dict.Subscribe || "SUBSCRIBE"}
          </span>
        </a>
      );
    }

    if (link.name === 'GitHub') {
      return (
        <a 
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group ${cardBg} border ${presentationMode ? 'rounded-2xl p-6' : 'rounded-lg p-4'} flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 w-full shadow-sm hover:shadow-lg overflow-hidden gap-4 min-h-[300px]`}
        >
          <div className="w-full flex justify-center mb-2">
            <div className="flex items-center gap-2">
              <Github size={24} className="text-foreground" />
              <span className="font-bold text-foreground">@FaranAiki on GitHub</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 w-full">
            {/* Profile & Overall Stats */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={`https://github-readme-stats.vercel.app/api?username=FaranAiki&show_icons=true&theme=${badgeTheme === 'dark' ? 'tokyonight' : 'default'}&hide_border=true&bg_color=00000000`}
              alt="GitHub Profile Stats"
              className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-500"
            />
            
            {/* Top Languages */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={`https://github-readme-stats.vercel.app/api/top-langs/?username=FaranAiki&layout=compact&theme=${badgeTheme === 'dark' ? 'tokyonight' : 'default'}&hide_border=true&bg_color=00000000`}
              alt="GitHub Top Languages"
              className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-500 delay-75"
            />

            {/* Commits / Activity Graph */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={`https://github-readme-activity-graph.vercel.app/graph?username=FaranAiki&theme=${badgeTheme === 'dark' ? 'tokyonight' : 'default'}&hide_border=true&bg_color=00000000&line=theme-500`}
              alt="GitHub Commits Graph"
              className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-500 delay-150"
            />
          </div>

          <span className="mt-2 text-xs font-bold text-theme-500 opacity-0 group-hover:opacity-100 transition-opacity">
            {dict.View_Full_Profile || "View Full Profile →"}
          </span>
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
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 p-4 space-y-6">
              {socialLinks.map((link) => (
                <motion.div key={link.name} className="break-inside-avoid w-full" variants={itemVariants}>
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
