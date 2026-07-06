"use client";

import React from 'react';
import { Github, Linkedin, Instagram, Twitter, Mail, Youtube } from 'lucide-react';
import Image from 'next/image';
import { usePresentation } from '../providers/PresentationContext';
import { m as motion, Variants } from 'framer-motion';


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
  dict?: import('@/components/layout/Translator').TranslationDict;
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
      icon: <Image alt="TikTok Faran Aiki Social Link" width="48" height="48" src="/images/social/tiktok.webp" className="dark:brightness-0 dark:invert" />,
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
      icon: <Image alt="Lichess Faran Aiki Social Link" width="48" height="48" src="/images/social/lichess.webp" className="dark:brightness-0 dark:invert" />,
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

export default function SocialDisplay({ customLinks, hidePresentation = false }: SocialDisplayProps) {
  const { isPresentationMode } = usePresentation();
  
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
              {socialLinks.map((link, idx) => (
                <motion.div key={link.name} className="break-inside-avoid w-full" initial={idx < 4 ? "visible" : undefined} variants={itemVariants}>
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
