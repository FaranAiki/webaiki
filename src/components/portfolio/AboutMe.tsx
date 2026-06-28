"use client";

import { useState, useEffect } from 'react';
import { shimmer, toBase64, formatCJK } from '@/lib/utils';
import Image from 'next/image';
import HoverableWords from '@/components/shared/HoverableWords';
import FadeInSection from '@/components/shared/FadeInSection';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../providers/SettingsContext';
import { usePresentation } from '../providers/PresentationContext';

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

export const SectionSeparator = ({ isCompact }: { isDark?: boolean, isCompact?: boolean }) => (
  <div className={`SectionSeparator w-full max-w-4xl mx-auto ${isCompact ? 'my-4 md:my-6' : 'my-16 md:my-24'} transform-gpu`}>
    <div className="h-px bg-gradient-to-r from-transparent via-[var(--card-border)] to-transparent opacity-30" />
  </div>
);

interface AboutSubSectionProps extends AboutMeProps {
  responsiveJustifyClass?: string;
  justifyClass?: string;
  textClass?: string;
  titleClass?: string;
  isPresentationMode?: boolean;
}

function useAboutLayout(props: AboutSubSectionProps) {
  const { textAlign } = useSettings();
  const { isPresentationMode: presMode } = usePresentation();

  const lang = props.lang;
  const isJustified = lang !== 'jp' && lang !== 'zh';
  const defaultJustifyClass = isJustified ? 'text-justify' : 'text-left';
  
  const justifyClass = props.justifyClass ?? (textAlign === 'default' ? defaultJustifyClass : `text-${textAlign}`);
  const responsiveJustifyClass = props.responsiveJustifyClass ?? (textAlign === 'default' ? `text-center md:${justifyClass}` : justifyClass);
  const isPresentationMode = props.isPresentationMode ?? presMode;
  const titleClass = props.titleClass ?? "text-foreground";
  const textClass = props.textClass ?? "text-foreground/90 dark:text-foreground/80";

  return {
    justifyClass,
    responsiveJustifyClass,
    isPresentationMode,
    titleClass,
    textClass,
  };
}

export function PortfolioAboutHeader(props: AboutMeProps) {
  const { textClass } = useAboutLayout(props);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!props.carouselPhotos || props.carouselPhotos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % props.carouselPhotos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [props.carouselPhotos]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
      {/* Visual Identity */}
      <div className="lg:col-span-4 flex justify-center lg:justify-start">
        <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-full lg:aspect-square group transform-gpu">
          <div className="absolute inset-0 bg-theme-500/20 blur-[60px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity" />
          <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-theme-500/20 dark:border-theme-500/30 bg-theme-surface/50 backdrop-blur-sm shadow-theme-shadow">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6 }}
                  className="relative w-full h-full"
                >
                    <Image
                      src={`/images/photo_faran_aiki/${props.carouselPhotos[currentIndex]}`}
                      alt={props.faran_photo}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 300px, 400px"
                      priority
                      quality={60}
                      fetchPriority="high"
                    />
                </motion.div>
              </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Narrative Identity */}
      <div className="lg:col-span-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter nav-active-gacor leading-none cursor-default hover:opacity-80 transition-opacity">
            {props.about_title}
          </h1>
          <p className="text-theme-500 font-bold tracking-tight text-xs md:text-sm flex gap-2 flex-wrap">
            <span className="hover:text-theme-400 transition-colors cursor-default">{props.about_philosophy_title}</span>
            <span className="text-theme-muted">•</span>
            <span className="hover:text-theme-400 transition-colors cursor-default">{props.about_vision_mission_title}</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <HoverableWords className={`text-sm md:text-base leading-relaxed ${textClass}`}>
              {formatCJK(props.about_text_1, props.lang)}
            </HoverableWords>
            <div className="p-4 rounded-xl bg-theme-surface-strong border border-theme-border hover:scale-[1.02] transition-transform duration-300 group">
              <p className={`text-xs font-bold text-theme-500 mb-2 group-hover:text-theme-400 transition-colors`}>{props.about_philosophy_title}</p>
              <HoverableWords className={`text-sm italic ${textClass} opacity-80 group-hover:opacity-100 transition-opacity`}>
                {formatCJK(props.about_philosophy, props.lang)}
              </HoverableWords>
            </div>
          </div>
          <div className="space-y-4">
            <HoverableWords className={`text-sm md:text-base leading-relaxed ${textClass}`}>
              {formatCJK(props.about_text_2, props.lang)}
            </HoverableWords>
            <div className="space-y-3">
               {[props.about_principle_1, props.about_principle_2, props.about_principle_3].filter(p => p && p.trim() !== "").map((p, i) => (
                 <motion.div 
                    key={i} 
                    className="flex gap-3 items-start group cursor-default"
                    whileHover={{ x: 4 }}
                 >
                   <span className="w-1.5 h-1.5 rounded-full bg-theme-500 mt-1.5 shrink-0 group-hover:bg-theme-400 group-hover:scale-125 transition-all" />
                   <HoverableWords className={`text-xs md:text-sm ${textClass} opacity-90 group-hover:opacity-100 transition-all`}>
                      {formatCJK(p, props.lang)}
                   </HoverableWords>
                 </motion.div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AboutSection(props: AboutSubSectionProps) {
  const { responsiveJustifyClass, justifyClass, titleClass, textClass } = useAboutLayout(props);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!props.carouselPhotos || props.carouselPhotos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % props.carouselPhotos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [props.carouselPhotos]);

  return (
    <FadeInSection slideIndex={1} totalSlides={4} initialVisible={true}>
        <div className={`flex flex-col-reverse xl:flex-row print:flex-row justify-center items-center gap-8 ${props.isCompact ? 'lg:gap-8' : 'lg:gap-16'} max-w-6xl mx-auto w-full`}>
          <div className={`flex-1 ${responsiveJustifyClass} max-w-prose print:max-w-none`}>
            <h1 className={`${props.isCompact ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'} font-extrabold ${titleClass} mb-6 hover:opacity-85 transition-opacity tracking-tight`}>
              <span className="nav-active-gacor">{props.about_title}</span>
            </h1>
            <div className="space-y-4">
              <HoverableWords className={`${props.isCompact ? 'text-sm md:text-base' : 'text-lg md:text-xl'} ${textClass} ${justifyClass}`}>
                {formatCJK(props.about_text_1, props.lang)}
              </HoverableWords>
              <HoverableWords className={`${props.isCompact ? 'text-sm md:text-base' : 'text-lg md:text-xl'} ${textClass} ${justifyClass}`}>
                {formatCJK(props.about_text_2, props.lang)}
              </HoverableWords>
            </div>
          </div>

          <div className="flex-shrink-0 relative group transform-gpu">
            <div
              className={`relative ${props.isCompact ? 'w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56' : 'w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px]'} flex justify-center items-center overflow-hidden transform-gpu`}
            >
              <AnimatePresence mode="wait">
                {mounted && props.carouselPhotos && props.carouselPhotos.length > 0 ? (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1.01 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="relative w-full h-full flex justify-center items-center"
                >
                  <Image
                    src={`/images/photo_faran_aiki/${props.carouselPhotos[currentIndex]}`}
                    alt={props.faran_photo}
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
                    quality={60}
                    priority={true}
                    fetchPriority="high"
                  />
                </motion.div>
                ) : (
                    <div className="w-full h-full bg-theme-surface-strong animate-pulse rounded-full" />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </FadeInSection>
  );
}

export function PhilosophySection(props: AboutSubSectionProps) {
    const { responsiveJustifyClass, justifyClass, titleClass, textClass, isPresentationMode } = useAboutLayout(props);
    return (
        <FadeInSection slideIndex={2} totalSlides={4}>
        <div id="philosophy" className={`flex flex-col-reverse xl:flex-row-reverse print:flex-row-reverse justify-center items-center gap-8 ${props.isCompact ? 'lg:gap-8' : 'lg:gap-16'} max-w-6xl mx-auto w-full`}>
          <div className={`flex-1 ${responsiveJustifyClass} max-w-prose print:max-w-none`}>
            <h2 className={`${props.isCompact ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl'} font-bold ${titleClass} mb-6 hover:opacity-85 transition-opacity`}>
              <span className="nav-active-gacor">{props.about_philosophy_title}</span>
            </h2>
            <HoverableWords
              className={`${props.isCompact ? 'text-sm md:text-base' : 'text-lg md:text-xl'} ${textClass} ${justifyClass} font-medium`}
            >
              {formatCJK(props.about_philosophy, props.lang)}
            </HoverableWords>
          </div>

          <div className="flex-shrink-0 transform-gpu">
            <div className={`relative ${props.isCompact ? 'w-32 h-32 md:w-40 md:h-40' : 'w-56 h-56 md:w-72 md:h-72'} transform-gpu`}>
            <Image
            src={`/images/move_forward.webp`}
            alt="Move Forward Philosophy - Muhammad Faran Aiki Software Engineer"
            fill
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(288, 288))}`}
            sizes="(max-width: 768px) 128px, 288px"
            quality={60}
            priority={isPresentationMode}
            className="object-contain md:animate-float transition-[colors,transform,opacity] duration-500 ease-in-out opacity-90 hover:opacity-100 md:hover:-rotate-3 drop-shadow-xl md:hover:drop-shadow-[0_0_20px_var(--accent-shadow)]"
            />
            </div>          </div>
        </div>
      </FadeInSection>
    );
}

export function PrinciplesSection(props: AboutSubSectionProps) {
    const { responsiveJustifyClass, justifyClass, titleClass, textClass, isPresentationMode } = useAboutLayout(props);
    return (
        <FadeInSection slideIndex={3} totalSlides={4}>
        <div id="principles" className={`flex flex-col-reverse xl:flex-row print:flex-row justify-center items-center gap-8 ${props.isCompact ? 'lg:gap-8' : 'lg:gap-16'} max-w-6xl mx-auto w-full`}>
          <div className={`flex-1 ${responsiveJustifyClass} max-w-prose print:max-w-none`}>
            <h2 className={`${props.isCompact ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl'} font-bold ${titleClass} mb-6 hover:opacity-85 transition-opacity`}>
              <span className="nav-active-gacor">{props.about_principle_title}</span>
            </h2>
            <div className="space-y-4">
              {[props.about_principle_1, props.about_principle_2, props.about_principle_3].filter(p => p && p.trim() !== "").map((p, i) => (
                <HoverableWords
                    key={i}
                    className={`${props.isCompact ? 'text-sm md:text-base' : 'text-lg md:text-xl'} ${textClass} ${justifyClass}`}
                >
                    {formatCJK(p, props.lang)}
                </HoverableWords>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 transform-gpu">
            <div className={`relative ${props.isCompact ? 'w-32 h-32 md:w-40 md:h-40' : 'w-56 h-56 md:w-72 md:h-72'} transform-gpu`}>
              <Image
                src={`/images/tree.webp`}
                alt="Guiding Principles Tree - Muhammad Faran Aiki Portfolio"
                fill
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(288, 288))}`}
                sizes="(max-width: 768px) 128px, 288px"
                quality={60}
                priority={isPresentationMode}
                className="object-contain transition-[colors,opacity,transform] duration-500 ease-in-out opacity-90 hover:opacity-100 hover:scale-105 hover:rotate-2 drop-shadow-xl hover:drop-shadow-[0_0_20px_var(--accent-shadow)]"
              />
            </div>
          </div>
        </div>
      </FadeInSection>
    );
}

export function VisionMissionSection(props: AboutSubSectionProps) {
    const { responsiveJustifyClass, justifyClass, titleClass, textClass, isPresentationMode } = useAboutLayout(props);
    return (
        <FadeInSection slideIndex={4} totalSlides={4}>
        <div id="vision-mission" className={`flex flex-col-reverse xl:flex-row-reverse print:flex-row-reverse justify-center items-center gap-8 ${props.isCompact ? 'lg:gap-8' : 'lg:gap-16'} max-w-6xl mx-auto w-full`}>
          <div className={`flex-1 ${responsiveJustifyClass} max-w-prose print:max-w-none`}>
            <h2 className={`${props.isCompact ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl'} font-bold ${titleClass} mb-6 hover:opacity-85 transition-opacity`}>
              <span className="nav-active-gacor">{props.about_vision_mission_title}</span>
            </h2>
            <div className="space-y-4">
              <HoverableWords
                  className={`${props.isCompact ? 'text-sm md:text-base' : 'text-lg md:text-xl'} ${textClass} ${justifyClass}`}
              >
                  {formatCJK(props.about_vision_mission_1, props.lang)}
              </HoverableWords>
              <HoverableWords
                  className={`${props.isCompact ? 'text-sm md:text-base' : 'text-lg md:text-xl'} ${textClass} ${justifyClass}`}
              >
                  {formatCJK(props.about_vision_mission_2, props.lang)}
              </HoverableWords>
              <HoverableWords
                  className={`${props.isCompact ? 'text-sm md:text-base' : 'text-lg md:text-xl'} ${textClass} ${justifyClass}`}
              >
                  {formatCJK(props.about_vision_mission_3, props.lang)}
              </HoverableWords>
            </div>
          </div>

          <div className="flex-shrink-0 transform-gpu">
            <div className={`relative ${props.isCompact ? 'w-32 h-32 md:w-40 md:h-40' : 'w-56 h-56 md:w-72 md:h-72'} transform-gpu`}>
              <Image
                src="/images/vission_mission.webp"
                alt="Muhammad Faran Aiki Vision and Mission Eye Icon"
                fill
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(288, 288))}`}
                sizes="(max-width: 768px) 128px, 288px"
                quality={60}
                priority={isPresentationMode}
                className="object-contain md:animate-float transition-[colors,transform,opacity] duration-500 ease-in-out opacity-90 hover:opacity-100 hover:scale-110 hover:brightness-110 drop-shadow-xl hover:drop-shadow-[0_0_20px_var(--accent-shadow)]"
              />
            </div>
          </div>
        </div>
      </FadeInSection>
    );
}

export default function AboutMe(props: AboutMeProps) {
  const { isPresentationMode } = useAboutLayout(props);

  return (
    <div className={`w-full ${props.isCompact ? 'py-4' : 'py-8'} md:px-5 ${isPresentationMode ? 'presentation-container' : ''}`}>
      <AboutSection {...props} />
      {!isPresentationMode && <SectionSeparator isCompact={props.isCompact} />}
      
      <PhilosophySection {...props} />
      {!isPresentationMode && <SectionSeparator isCompact={props.isCompact} />}
      
      <PrinciplesSection {...props} />
      {!isPresentationMode && <SectionSeparator isCompact={props.isCompact} />}
      
      <VisionMissionSection {...props} />
    </div>
  );
}
