"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { shimmer, toBase64, formatCJK } from '@/lib/utils';
import Image from 'next/image';
import HoverableWords from '@/components/HoverableWords';
import FadeInSection from '@/components/FadeInSection';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from './SettingsContext';
import { usePresentation } from './PresentationContext';

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
  isCompact?: boolean;
};

export const SectionSeparator = ({ isDark, isCompact }: { isDark: boolean, isCompact?: boolean }) => (
  <div className={`SectionSeparator w-full max-w-4xl mx-auto ${isCompact ? 'my-8 md:my-12' : 'my-16 md:my-24'}`}>
    <div className={`h-px bg-gradient-to-r from-transparent ${isDark ? 'via-gray-500/50' : 'via-black/20'} to-transparent`} />
  </div>
);

export function AboutSection({ about_title, about_text_1, about_text_2, carouselPhotos, faran_photo, lang, isCompact, responsiveJustifyClass, justifyClass, textClass, titleClass }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!carouselPhotos || carouselPhotos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselPhotos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselPhotos]);

  return (
    <FadeInSection slideIndex={1} totalSlides={4} initialVisible={true}>
        <div className={`flex flex-col-reverse xl:flex-row print:flex-row justify-center items-center gap-8 ${isCompact ? 'lg:gap-8' : 'lg:gap-16'} max-w-6xl mx-auto w-full`}>
          <div className={`flex-1 ${responsiveJustifyClass} max-w-prose print:max-w-none`}>
            <h1 className={`${isCompact ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'} font-extrabold ${titleClass} mb-6 hover:opacity-85 transition-opacity tracking-tight`}>
              {about_title}
            </h1>
            <div className="space-y-4">
              <HoverableWords className={`${isCompact ? 'text-sm md:text-base' : 'text-lg md:text-xl'} ${textClass} ${justifyClass}`}>
                {formatCJK(about_text_1, lang)}
              </HoverableWords>
              <HoverableWords className={`${isCompact ? 'text-sm md:text-base' : 'text-lg md:text-xl'} ${textClass} ${justifyClass}`}>
                {formatCJK(about_text_2, lang)}
              </HoverableWords>
            </div>
          </div>

          <div className="flex-shrink-0 relative group">
            <div
              className={`relative ${isCompact ? 'w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56' : 'w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px]'} flex justify-center items-center overflow-hidden transform-gpu`}
            >
              <AnimatePresence mode="wait">
                {carouselPhotos && carouselPhotos.length > 0 && (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1.01 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="relative w-full h-full flex justify-center items-center"
                >
                  <Image
                    src={`/images/photo_faran_aiki/${carouselPhotos[currentIndex]}`}
                    alt={faran_photo}
                    fill
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(400, 400))}`}
                    className={`
                      object-contain
                      transition-transform duration-700 ease-out
                      hover:scale-[1.06]
                      scale-[1.01]
                    `}
                    sizes="(max-width: 768px) 160px, 400px"
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
  );
}

export function PhilosophySection({ about_philosophy_title, about_philosophy, lang, isCompact, responsiveJustifyClass, justifyClass, textClass, titleClass, isPresentationMode }: any) {
    return (
        <FadeInSection slideIndex={2} totalSlides={4}>
        <div className={`flex flex-col-reverse xl:flex-row-reverse print:flex-row-reverse justify-center items-center gap-8 ${isCompact ? 'lg:gap-8' : 'lg:gap-16'} max-w-6xl mx-auto w-full`}>
          <div className={`flex-1 ${responsiveJustifyClass} max-w-prose print:max-w-none`}>
            <h2 className={`${isCompact ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl'} font-bold ${titleClass} mb-6 hover:opacity-85 transition-opacity`}>
              {about_philosophy_title}
            </h2>
            <HoverableWords
              className={`${isCompact ? 'text-sm md:text-base' : 'text-lg md:text-xl'} ${textClass} ${justifyClass} font-medium`}
              prophover={`transition-[colors,transform] inline-block duration-200 ease-in-out hover:text-cyan-600 dark:hover:text-cyan-300 hover:scale-105 cursor-pointer`}
            >
              {formatCJK(about_philosophy, lang)}
            </HoverableWords>
          </div>

          <div className="flex-shrink-0">
            <div className={`relative ${isCompact ? 'w-32 h-32 md:w-40 md:h-40' : 'w-56 h-56 md:w-72 md:h-72'}`}>
              <Image
                src={`/images/move_forward.webp`}
                alt="Move Forward Philosophy"
                fill
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(288, 288))}`}
                sizes="(max-width: 768px) 128px, 288px"
                quality={85}
                priority={isPresentationMode}
                className="object-contain animate-float transition-[colors,transform,opacity] duration-500 ease-in-out opacity-90 hover:opacity-100 hover:-rotate-3 drop-shadow-xl hover:drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]"
              />
            </div>
          </div>
        </div>
      </FadeInSection>
    );
}

export function PrinciplesSection({ about_principle_title, about_principle_1, about_principle_2, about_principle_3, lang, isCompact, responsiveJustifyClass, justifyClass, textClass, titleClass, isPresentationMode }: any) {
    return (
        <FadeInSection slideIndex={3} totalSlides={4}>
        <div className={`flex flex-col-reverse xl:flex-row print:flex-row justify-center items-center gap-8 ${isCompact ? 'lg:gap-8' : 'lg:gap-16'} max-w-6xl mx-auto w-full`}>
          <div className={`flex-1 ${responsiveJustifyClass} max-w-prose print:max-w-none`}>
            <h2 className={`${isCompact ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl'} font-bold ${titleClass} mb-6 hover:opacity-85 transition-opacity`}>
              {about_principle_title}
            </h2>
            <div className="space-y-4">
              <HoverableWords
                  className={`${isCompact ? 'text-sm md:text-base' : 'text-lg md:text-xl'} ${textClass} ${justifyClass}`}
                  prophover='transition-[colors,opacity,transform] inline-block duration-200 ease-in-out hover:translate-x-1 hover:text-cyan-600 cursor-pointer'
              >
                  {formatCJK(about_principle_1, lang)}
              </HoverableWords>
              <HoverableWords
                  className={`${isCompact ? 'text-sm md:text-base' : 'text-lg md:text-xl'} ${textClass} ${justifyClass}`}
                  prophover='transition-[colors,opacity,transform] inline-block duration-200 ease-in-out hover:translate-x-1 hover:text-cyan-600 cursor-pointer'
              >
                  {formatCJK(about_principle_2, lang)}
              </HoverableWords>
              <HoverableWords
                  className={`${isCompact ? 'text-sm md:text-base' : 'text-lg md:text-xl'} ${textClass} ${justifyClass}`}
                  prophover='transition-[colors,opacity,transform] inline-block duration-200 ease-in-out hover:translate-x-1 hover:text-cyan-600 cursor-pointer'
              >
                  {formatCJK(about_principle_3, lang)}
              </HoverableWords>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className={`relative ${isCompact ? 'w-32 h-32 md:w-40 md:h-40' : 'w-56 h-56 md:w-72 md:h-72'}`}>
              <Image
                src={`/images/tree.webp`}
                alt="Guiding Principles Tree"
                fill
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(288, 288))}`}
                sizes="(max-width: 768px) 128px, 288px"
                quality={85}
                priority={isPresentationMode}
                className="object-contain transition-[colors,opacity,transform] duration-500 ease-in-out opacity-90 hover:opacity-100 hover:scale-105 hover:rotate-2 drop-shadow-xl hover:drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]"
              />
            </div>
          </div>
        </div>
      </FadeInSection>
    );
}

export function VisionMissionSection({ about_vision_mission_title, about_vision_mission_1, about_vision_mission_2, about_vision_mission_3, lang, isCompact, responsiveJustifyClass, justifyClass, textClass, titleClass, isPresentationMode }: any) {
    return (
        <FadeInSection slideIndex={4} totalSlides={4}>
        <div className={`flex flex-col-reverse xl:flex-row-reverse print:flex-row-reverse justify-center items-center gap-8 ${isCompact ? 'lg:gap-8' : 'lg:gap-16'} max-w-6xl mx-auto w-full`}>
          <div className={`flex-1 ${responsiveJustifyClass} max-w-prose print:max-w-none`}>
            <h2 className={`${isCompact ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl'} font-bold ${titleClass} mb-6 hover:opacity-85 transition-opacity`}>
              {about_vision_mission_title}
            </h2>
            <div className="space-y-4">
              <HoverableWords
                  className={`${isCompact ? 'text-sm md:text-base' : 'text-lg md:text-xl'} ${textClass} ${justifyClass}`}
                  prophover={`transition-[colors,opacity,transform] inline-block duration-200 ease-in-out hover:scale-105 hover:text-cyan-600 dark:hover:text-cyan-300 cursor-pointer`}
              >
                  {formatCJK(about_vision_mission_1, lang)}
              </HoverableWords>
              <HoverableWords
                  className={`${isCompact ? 'text-sm md:text-base' : 'text-lg md:text-xl'} ${textClass} ${justifyClass}`}
                  prophover={`transition-[colors,transform,opacity] inline-block duration-200 ease-in-out hover:scale-105 hover:text-cyan-600 dark:hover:text-cyan-300 cursor-pointer`}
              >
                  {formatCJK(about_vision_mission_2, lang)}
              </HoverableWords>
              <HoverableWords
                  className={`${isCompact ? 'text-sm md:text-base' : 'text-lg md:text-xl'} ${textClass} ${justifyClass}`}
                  prophover={`transition-[colors,transform,opacity] inline-block duration-200 ease-in-out hover:scale-105 hover:text-cyan-600 dark:hover:text-cyan-300 cursor-pointer`}
              >
                  {formatCJK(about_vision_mission_3, lang)}
              </HoverableWords>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className={`relative ${isCompact ? 'w-32 h-32 md:w-40 md:h-40' : 'w-56 h-56 md:w-72 md:h-72'}`}>
              <Image
                src={`/images/vission_mission.webp`}
                alt="Vision and Mission"
                fill
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(288, 288))}`}
                sizes="(max-width: 768px) 128px, 288px"
                quality={85}
                priority={isPresentationMode}
                className="object-contain animate-float transition-[colors,transform,opacity] duration-500 ease-in-out opacity-90 hover:opacity-100 hover:scale-110 hover:brightness-110 drop-shadow-xl hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              />
            </div>
          </div>
        </div>
      </FadeInSection>
    );
}

export default function AboutMe(props: AboutMeProps) {
  const { resolvedTheme } = useTheme();
  const { textAlign } = useSettings();
  const { isPresentationMode } = usePresentation();

  const isJustified = props.lang !== 'jp' && props.lang !== 'zh';
  const defaultJustifyClass = isJustified ? 'text-justify' : 'text-left';
  const justifyClass = textAlign === 'default' ? defaultJustifyClass : `text-${textAlign}`;
  const responsiveJustifyClass = textAlign === 'default' ? `text-center md:${justifyClass}` : justifyClass;
  const isDark = resolvedTheme === 'dark';

  const commonProps = {
    ...props,
    responsiveJustifyClass,
    justifyClass,
    isPresentationMode,
    titleClass: "text-black dark:text-white",
    textClass: "text-black dark:text-gray-200"
  };

  return (
    <div className={`w-full ${props.isCompact ? 'py-4' : 'py-8'} md:px-5`}>
      <AboutSection {...commonProps} />
      {!isPresentationMode && <SectionSeparator isDark={isDark} isCompact={props.isCompact} />}
      <PhilosophySection {...commonProps} />
      {!isPresentationMode && <SectionSeparator isDark={isDark} isCompact={props.isCompact} />}
      <PrinciplesSection {...commonProps} />
      {!isPresentationMode && <SectionSeparator isDark={isDark} isCompact={props.isCompact} />}
      <VisionMissionSection {...commonProps} />
    </div>
  );
}
