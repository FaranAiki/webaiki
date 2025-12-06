"use client";

import Image from 'next/image';
import HoverableWords from '@/components/HoverableWords';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

interface AboutMeProps {
  carouselPhotos: string[];
  about_text_1: string;
  about_text_2: string;
  about_title: string;
  about_philosophy_title: string;
  about_philosophy: string;
  about_principle_title: string;
  about_principle_1: string;
  about_principle_2: string;
  about_vision_mission_title: string;
  about_vision_mission_1: string;
  about_vision_mission_2: string;
  faran_photo: string;
}

const SectionSeparator = ({ isDark }: { isDark: boolean }) => (
  // Reduced vertical margin from my-16 to my-10 for tighter section spacing
  <div className="w-full max-w-4xl mx-auto my-10">
    <div className={`h-px bg-gradient-to-r from-transparent ${isDark ? 'via-gray-500/50' : 'via-black'} to-transparent`} />
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
  about_vision_mission_title,
  about_vision_mission_1,
  about_vision_mission_2,
  faran_photo
}: AboutMeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  
  // Use useTheme hook to get the actual resolved theme state (light/dark)
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Carousel things & Mount Check
  useEffect(() => {
    setMounted(true);

    if (carouselPhotos.length <= 1) return;
    
    const interval = setInterval(() => {
      setIsFading(true);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselPhotos.length);
        setIsFading(false); 
      }, 300); 

    }, 4000); 

    return () => clearInterval(interval);
  }, [carouselPhotos.length]);

  // Prevent hydration mismatch by rendering placeholder until mounted
  if (!mounted) {
    return <div className="w-full px-10 py-10 min-h-screen opacity-0"></div>;
  }

  // Determine dark mode state via JS
  const isDark = resolvedTheme === 'dark';

  // Dynamic Class Names based on JS state
  const titleClass = isDark ? 'text-white' : 'text-black';
  const textClass = isDark ? 'text-gray-300' : 'text-black';
  const borderClass = isDark ? 'border-white/10' : 'border-gray-200';

  return (
    <div className="w-full py-5 md:px-5">
       
      {/* About Me */}
      <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-6 max-w-5xl mx-auto animate-fade-in">
        <div className="flex-1 text-center md:text-justify">
          <h1 className={`text-4xl md:text-5xl font-bold ${titleClass} mb-4 hover:opacity-85 transition-opacity`}>
            {about_title}
          </h1>
          {/* Using textClass calculated from resolvedTheme to ensure correct color */}
          <div className="space-y-3">
            <HoverableWords className={`text-lg ${textClass} leading-relaxed text-justify`}>
              {about_text_1}
            </HoverableWords>
            <HoverableWords className={`text-lg ${textClass} leading-relaxed text-justify`}>
              {about_text_2}
            </HoverableWords>
          </div>
        </div>

        <div className="flex-shrink-0 relative">
          <div className="relative w-64 h-64 md:w-72 md:h-72">
             {/* Decorative backdrop blur */}
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full transform scale-90"></div>
            {carouselPhotos.length > 0 && (
            <Image
              src={`/images/photo_faran_aiki/${carouselPhotos[currentIndex]}`}
              alt={faran_photo}
              fill
              className={`
                object-cover rounded-xl
                transition-all duration-500 ease-in-out
                shadow-2xl border-2 ${borderClass}
                hover:scale-105 hover:shadow-blue-500/30
                ${isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
              `}
              priority
            />
            )}
          </div>
        </div>
      </div>

      <SectionSeparator isDark={isDark} />

      {/* Philosophy  */}
      <div className="flex flex-col-reverse md:flex-row-reverse justify-center items-center gap-8 max-w-5xl mx-auto animate-fade-in">
        <div className="flex-1 text-center md:text-justify">
          <h2 className={`text-3xl md:text-4xl font-bold ${titleClass} mb-4 hover:opacity-85 transition-opacity`}>
            {about_philosophy_title}
          </h2>
          <HoverableWords 
            className={`text-lg ${textClass} leading-relaxed text-justify md:text-justify`} 
            prophover={`transition-all inline-block duration-200 ease-in-out hover:text-cyan-600 ${isDark ? 'dark:hover:text-cyan-300' : ''} hover:font-semibold cursor-pointer`}
          >
            {about_philosophy}
          </HoverableWords>
        </div>

        <div className="flex-shrink-0">
          <div className="relative w-56 h-56 md:w-64 md:h-64">
            <Image
              src={`/images/move_forward.png`}
              alt="Move Forward Philosophy"
              fill
              className="object-contain animate-float transition-all duration-300 ease-in-out opacity-90 hover:opacity-100 hover:-rotate-2 drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              priority
            />
          </div>
        </div>
      </div>

      <SectionSeparator isDark={isDark} />

      {/* Principles */}
      <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-8 max-w-5xl mx-auto animate-fade-in">
        <div className="flex-1 text-center md:text-justify">
          <h2 className={`text-3xl md:text-4xl font-bold ${titleClass} mb-4 hover:opacity-85 transition-opacity`}>
            {about_principle_title}
          </h2>
          <div className="space-y-3">
            <HoverableWords 
                className={`text-lg ${textClass} leading-relaxed text-justify`} 
                prophover='transition-all inline-block duration-100 ease-in-out hover:scale-95 hover:italic hover:opacity-90 cursor-pointer'
            >
                {about_principle_1}
            </HoverableWords>
            <HoverableWords 
                className={`text-lg ${textClass} leading-relaxed text-justify`} 
                prophover='transition-all inline-block duration-100 ease-in-out hover:scale-95 hover:italic hover:opacity-90 cursor-pointer'
            >
                {about_principle_2}
            </HoverableWords>
          </div>
        </div>

        <div className="flex-shrink-0">
           <div className="relative w-56 h-56 md:w-64 md:h-64">
            <Image
              src={`/images/tree.png`}
              alt="Guiding Principles Tree"
              fill
              className="object-contain transition-all duration-300 ease-in-out opacity-90 hover:opacity-100 hover:scale-105 hover:rotate-2 drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
              priority
            />
          </div>
        </div>
      </div>

      <SectionSeparator isDark={isDark} />

      {/* Vision & Mission  */}
      <div className="flex flex-col-reverse md:flex-row-reverse justify-center items-center gap-8 max-w-5xl mx-auto animate-fade-in">
        <div className="flex-1 text-center md:text-justify">
          <h2 className={`text-3xl md:text-4xl font-bold ${titleClass} mb-4 hover:opacity-85 transition-opacity`}>
            {about_vision_mission_title}
          </h2>
          <div className="space-y-3">
            <HoverableWords 
                className={`text-lg ${textClass} leading-relaxed text-justify md:text-justify`} 
                prophover={`transition-all inline-block duration-100 ease-in-out hover:scale-95 hover:italic hover:opacity-90 cursor-pointer hover:text-cyan-600 ${isDark ? 'dark:hover:text-cyan-300' : ''}`}
            >
                {about_vision_mission_1}
            </HoverableWords>
            <HoverableWords 
                className={`text-lg ${textClass} leading-relaxed text-justify md:text-justify`} 
                prophover={`transition-all inline-block duration-100 ease-in-out hover:scale-95 hover:italic hover:opacity-90 cursor-pointer hover:text-cyan-600 ${isDark ? 'dark:hover:text-cyan-300' : ''}`}
            >
                {about_vision_mission_2}
            </HoverableWords>
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="relative w-56 h-56 md:w-64 md:h-64">
            <Image
              src={`/images/vission_mission.png`}
              alt="Vision and Mission"
              fill
              className="object-contain animate-float transition-all duration-300 ease-in-out opacity-90 hover:opacity-100 hover:scale-105 hover:brightness-110 drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
