"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { shimmer, toBase64, formatCJK } from '@/lib/utils';
import Image from 'next/image';
import HoverableWords from '@/components/HoverableWords';
import FadeInSection from '@/components/FadeInSection';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from './SettingsContext';

export type AboutMeProps = {
  carouselPhotos: string[];
  faran_photo: string;
  about_philosophy_title: string;
  about_philosophy: string;
  about_principle_title: string;
  about_principle_1: string;
  about_principle_2: string;
  about_principle_3: string;
  about_vision_mission_title: string;
  about_vision_mission_1: string;
  about_vision_mission_2: string;
  about_vision_mission_3: string;
  about_title: string;
  about_text_1: string;
  about_text_2: string;
  lang?: string;
};

const SectionSeparator = ({ isDark }: { isDark: boolean }) => (
  <div className="SectionSeparator w-full max-w-4xl mx-auto my-16 md:my-24">
    <div className={`h-px bg-gradient-to-r from-transparent ${isDark ? 'via-gray-500/50' : 'via-black/20'} to-transparent`} />
  </div>
);

export default function AboutMe({
  carouselPhotos,
  about_text_1,
  about_text_2,
  about_title,
  about_philosophy_title,
  about_philosophy,
  about_principle_title,
  about_principle_1,
  about_principle_2,
  about_principle_3,
  about_vision_mission_title,
  about_vision_mission_1,
  about_vision_mission_2,
  about_vision_mission_3,
  faran_photo,
  lang
}: AboutMeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { resolvedTheme } = useTheme();
  const { textAlign } = useSettings();
  const [mounted, setMounted] = useState(false);

  const isJustified = lang !== 'jp' && lang !== 'zh';
  const defaultJustifyClass = isJustified ? 'text-justify' : 'text-left';
  const justifyClass = textAlign === 'default' ? defaultJustifyClass : `text-${textAlign}`;
  const responsiveJustifyClass = textAlign === 'default' ? `text-center md:${justifyClass}` : justifyClass;

  useEffect(() => {
    setMounted(true);

    if (!carouselPhotos || carouselPhotos.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselPhotos.length);
    }, 4000); 

    return () => clearInterval(interval);
  }, [carouselPhotos]);

  const isDark = resolvedTheme === 'dark';

  // Enhanced Contrast & Typography Classes
  // We use Tailwind's dark: classes where possible to avoid hydration mismatch and allow SSR
  const titleClass = "text-black dark:text-white";
  const textClass = "text-black dark:text-gray-200"; 
  const borderClass = "border-gray-200 dark:border-white/10";

  return (
    <div className="w-full py-8 md:px-5 presentation-mode:contents">
       
      {/* About Me Section */}
      <FadeInSection slideIndex={1} totalSlides={4} initialVisible={true}>
        <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-8 lg:gap-16 max-w-6xl mx-auto w-full">
          <div className={`flex-1 ${responsiveJustifyClass} max-w-prose`}>
            <h1 className={`text-4xl md:text-5xl font-extrabold ${titleClass} mb-6 hover:opacity-85 transition-opacity tracking-tight`}>
              {about_title}
            </h1>
            <div className="space-y-4">
              <HoverableWords className={`text-lg md:text-xl ${textClass} ${justifyClass}`}>
                {formatCJK(about_text_1, lang)}
              </HoverableWords>
              <HoverableWords className={`text-lg md:text-xl ${textClass} ${justifyClass}`}>
                {formatCJK(about_text_2, lang)}
              </HoverableWords>
            </div>
          </div>

          <div className="flex-shrink-0 relative group">
            <div className={`relative w-64 h-64 md:w-80 md:h-80 overflow-hidden rounded-2xl shadow-2xl border ${borderClass}`}>
              <div className="absolute inset-0 bg-cyan-500/30 blur-3xl rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-700"></div>
              <AnimatePresence mode="wait">
                {carouselPhotos && carouselPhotos.length > 0 && (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={`/images/photo_faran_aiki/${carouselPhotos[currentIndex]}`}
                    alt={faran_photo}
                    fill
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(320, 320))}`}
                    className={`
                      object-cover 
                      transition-transform duration-700 ease-out
                      hover:scale-[1.05]
                    `}
                    sizes="(max-width: 768px) 256px, 320px"
                    quality={85}
                    priority={true}
                  />
                </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </FadeInSection>

      <div className="block presentation-mode:hidden">
        <SectionSeparator isDark={isDark} />
      </div>

      {/* Philosophy Section */}
      <FadeInSection slideIndex={2} totalSlides={4}>
        <div className="flex flex-col-reverse md:flex-row-reverse justify-center items-center gap-8 lg:gap-16 max-w-6xl mx-auto w-full">
          <div className={`flex-1 ${responsiveJustifyClass} max-w-prose`}>
            <h2 className={`text-3xl md:text-4xl font-bold ${titleClass} mb-6 hover:opacity-85 transition-opacity`}>
              {about_philosophy_title}
            </h2>
            <HoverableWords 
              className={`text-lg md:text-xl ${textClass} ${justifyClass} font-medium`} 
              prophover={`transition-[colors,transform] inline-block duration-200 ease-in-out hover:text-cyan-600 dark:hover:text-cyan-300 hover:scale-105 cursor-pointer`}
            >
              {formatCJK(about_philosophy, lang)}
            </HoverableWords>
          </div>

          <div className="flex-shrink-0">
            <div className="relative w-56 h-56 md:w-72 md:h-72">
              <Image
                src={`/images/move_forward.webp`}
                alt="Move Forward Philosophy"
                fill
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(288, 288))}`}
                sizes="(max-width: 768px) 224px, 288px"
                quality={85}
                className="object-contain animate-float transition-[colors,transform,opacity] duration-500 ease-in-out opacity-90 hover:opacity-100 hover:-rotate-3 drop-shadow-xl hover:drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]"
              />
            </div>
          </div>
        </div>
      </FadeInSection>

      <div className="block presentation-mode:hidden">
        <SectionSeparator isDark={isDark} />
      </div>

      {/* Principles Section */}
      <FadeInSection slideIndex={3} totalSlides={4}>
        <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-8 lg:gap-16 max-w-6xl mx-auto w-full">
          <div className={`flex-1 ${responsiveJustifyClass} max-w-prose`}>
            <h2 className={`text-3xl md:text-4xl font-bold ${titleClass} mb-6 hover:opacity-85 transition-opacity`}>
              {about_principle_title}
            </h2>
            <div className="space-y-4">
              <HoverableWords 
                  className={`text-lg md:text-xl ${textClass} ${justifyClass}`} 
                  prophover='transition-[colors,opacity,transform] inline-block duration-200 ease-in-out hover:translate-x-1 hover:text-cyan-600 cursor-pointer'
              >
                  {formatCJK(about_principle_1, lang)}
              </HoverableWords>
              <HoverableWords 
                  className={`text-lg md:text-xl ${textClass} ${justifyClass}`} 
                  prophover='transition-[colors,opacity,transform] inline-block duration-200 ease-in-out hover:translate-x-1 hover:text-cyan-600 cursor-pointer'
              >
                  {formatCJK(about_principle_2, lang)}
              </HoverableWords>
              {/* Added Principle 3 */}
              <HoverableWords 
                  className={`text-lg md:text-xl ${textClass} ${justifyClass}`} 
                  prophover='transition-[colors,opacity,transform] inline-block duration-200 ease-in-out hover:translate-x-1 hover:text-cyan-600 cursor-pointer'
              >
                  {formatCJK(about_principle_3, lang)}
              </HoverableWords>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="relative w-56 h-56 md:w-72 md:h-72">
              <Image
                src={`/images/tree.webp`}
                alt="Guiding Principles Tree"
                fill
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(288, 288))}`}
                sizes="(max-width: 768px) 224px, 288px"
                quality={85}
                className="object-contain transition-[colors,opacity,transform] duration-500 ease-in-out opacity-90 hover:opacity-100 hover:scale-105 hover:rotate-2 drop-shadow-xl hover:drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]"
              />
            </div>
          </div>
        </div>
      </FadeInSection>

      <div className="block presentation-mode:hidden">
        <SectionSeparator isDark={isDark} />
      </div>

      {/* Vision & Mission Section */}
      <FadeInSection slideIndex={4} totalSlides={4}>
        <div className="flex flex-col-reverse md:flex-row-reverse justify-center items-center gap-8 lg:gap-16 max-w-6xl mx-auto w-full">
          <div className={`flex-1 ${responsiveJustifyClass} max-w-prose`}>
            <h2 className={`text-3xl md:text-4xl font-bold ${titleClass} mb-6 hover:opacity-85 transition-opacity`}>
              {about_vision_mission_title}
            </h2>
            <div className="space-y-4">
              <HoverableWords 
                  className={`text-lg md:text-xl ${textClass} ${justifyClass}`} 
                  prophover={`transition-[colors,opacity,transform] inline-block duration-200 ease-in-out hover:scale-105 hover:text-cyan-600 dark:hover:text-cyan-300 cursor-pointer`}
              >
                  {formatCJK(about_vision_mission_1, lang)}
              </HoverableWords>
              <HoverableWords 
                  className={`text-lg md:text-xl ${textClass} ${justifyClass}`} 
                  prophover={`transition-[colors,transform,opacity] inline-block duration-200 ease-in-out hover:scale-105 hover:text-cyan-600 dark:hover:text-cyan-300 cursor-pointer`}
              >
                  {formatCJK(about_vision_mission_2, lang)}
              </HoverableWords>
              {/* Added Vision Mission 3 */}
              <HoverableWords 
                  className={`text-lg md:text-xl ${textClass} ${justifyClass}`} 
                  prophover={`transition-[colors,transform,opacity] inline-block duration-200 ease-in-out hover:scale-105 hover:text-cyan-600 dark:hover:text-cyan-300 cursor-pointer`}
              >
                  {formatCJK(about_vision_mission_3, lang)}
              </HoverableWords>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="relative w-56 h-56 md:w-72 md:h-72">
              <Image
                src={`/images/vission_mission.webp`}
                alt="Vision and Mission"
                fill
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(288, 288))}`}
                sizes="(max-width: 768px) 224px, 288px"
                quality={85}
                className="object-contain animate-float transition-[colors,transform,opacity] duration-500 ease-in-out opacity-90 hover:opacity-100 hover:scale-110 hover:brightness-110 drop-shadow-xl hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              />
            </div>
          </div>
        </div>
      </FadeInSection>
    </div>
  );
}
