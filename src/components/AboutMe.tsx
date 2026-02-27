"use client";

import Image from 'next/image';
import HoverableWords from '@/components/HoverableWords';
import FadeInSection from '@/components/FadeInSection';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

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
};

const SectionSeparator = ({ isDark }: { isDark: boolean }) => (
  <div className="w-full max-w-4xl mx-auto my-16 md:my-24">
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
  faran_photo
}: AboutMeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!carouselPhotos || carouselPhotos.length <= 1) return;
    
    const interval = setInterval(() => {
      setIsFading(true);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselPhotos.length);
        setIsFading(false); 
      }, 300); 

    }, 4000); 

    return () => clearInterval(interval);
  }, [carouselPhotos]);

  if (!mounted) {
    return <div className="w-full px-10 py-10 min-h-screen opacity-0"></div>;
  }

  const isDark = resolvedTheme === 'dark';

  // Enhanced Contrast & Typography Classes
  const titleClass = isDark ? 'text-white' : 'text-gray-900';
  const textClass = isDark ? 'text-gray-200' : 'text-gray-800'; 
  const borderClass = isDark ? 'border-white/10' : 'border-gray-200';

  return (
    <div className="w-full py-8 md:px-5">
       
      {/* About Me Section */}
      <FadeInSection>
        <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-8 lg:gap-16 max-w-6xl mx-auto">
          <div className="flex-1 text-center md:text-justify max-w-prose">
            <h1 className={`text-4xl md:text-5xl font-extrabold ${titleClass} mb-6 hover:opacity-85 transition-opacity tracking-tight`}>
              {about_title}
            </h1>
            <div className="space-y-4">
              <HoverableWords className={`text-lg md:text-xl leading-relaxed ${textClass} text-justify`}>
                {about_text_1}
              </HoverableWords>
              <HoverableWords className={`text-lg md:text-xl leading-relaxed ${textClass} text-justify`}>
                {about_text_2}
              </HoverableWords>
            </div>
          </div>

          <div className="flex-shrink-0 relative group">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-cyan-500/30 blur-3xl rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-700"></div>
              {carouselPhotos && carouselPhotos.length > 0 && (
              <Image
                src={`/images/photo_faran_aiki/${carouselPhotos[currentIndex]}`}
                alt={faran_photo}
                fill
                className={`
                  object-cover rounded-2xl
                  transition-[colors,transform] duration-700 ease-out
                  shadow-2xl border ${borderClass}
                  hover:scale-[1.02] hover:shadow-cyan-500/40
                  ${isFading ? 'opacity-80 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}
                `}
                sizes="(max-width: 768px) 256px, 320px"
                quality={85}
                priority
              />
              )}
            </div>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection delay={100}>
        <SectionSeparator isDark={isDark} />
      </FadeInSection>

      {/* Philosophy Section */}
      <FadeInSection>
        <div className="flex flex-col-reverse md:flex-row-reverse justify-center items-center gap-8 lg:gap-16 max-w-6xl mx-auto">
          <div className="flex-1 text-center md:text-justify max-w-prose">
            <h2 className={`text-3xl md:text-4xl font-bold ${titleClass} mb-6 hover:opacity-85 transition-opacity`}>
              {about_philosophy_title}
            </h2>
            <HoverableWords 
              className={`text-lg md:text-xl leading-relaxed ${textClass} text-justify font-medium`} 
              prophover={`transition-[colors,transform] inline-block duration-200 ease-in-out hover:text-cyan-600 ${isDark ? 'dark:hover:text-cyan-300' : ''} hover:scale-105 cursor-pointer`}
            >
              {about_philosophy}
            </HoverableWords>
          </div>

          <div className="flex-shrink-0">
            <div className="relative w-56 h-56 md:w-72 md:h-72">
              <Image
                src={`/images/move_forward.png`}
                alt="Move Forward Philosophy"
                fill
                sizes="(max-width: 768px) 224px, 288px"
                quality={85}
                className="object-contain animate-float transition-all duration-500 ease-in-out opacity-90 hover:opacity-100 hover:-rotate-3 drop-shadow-xl hover:drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]"
              />
            </div>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection delay={100}>
        <SectionSeparator isDark={isDark} />
      </FadeInSection>

      {/* Principles Section */}
      <FadeInSection>
        <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-8 lg:gap-16 max-w-6xl mx-auto">
          <div className="flex-1 text-center md:text-justify max-w-prose">
            <h2 className={`text-3xl md:text-4xl font-bold ${titleClass} mb-6 hover:opacity-85 transition-opacity`}>
              {about_principle_title}
            </h2>
            <div className="space-y-4">
              <HoverableWords 
                  className={`text-lg md:text-xl leading-relaxed ${textClass} text-justify`} 
                  prophover='transition-all inline-block duration-200 ease-in-out hover:translate-x-1 hover:text-cyan-600 cursor-pointer'
              >
                  {about_principle_1}
              </HoverableWords>
              <HoverableWords 
                  className={`text-lg md:text-xl leading-relaxed ${textClass} text-justify`} 
                  prophover='transition-all inline-block duration-200 ease-in-out hover:translate-x-1 hover:text-cyan-600 cursor-pointer'
              >
                  {about_principle_2}
              </HoverableWords>
              {/* Added Principle 3 */}
              <HoverableWords 
                  className={`text-lg md:text-xl leading-relaxed ${textClass} text-justify`} 
                  prophover='transition-all inline-block duration-200 ease-in-out hover:translate-x-1 hover:text-cyan-600 cursor-pointer'
              >
                  {about_principle_3}
              </HoverableWords>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="relative w-56 h-56 md:w-72 md:h-72">
              <Image
                src={`/images/tree.png`}
                alt="Guiding Principles Tree"
                fill
                sizes="(max-width: 768px) 224px, 288px"
                quality={85}
                className="object-contain transition-all duration-500 ease-in-out opacity-90 hover:opacity-100 hover:scale-105 hover:rotate-2 drop-shadow-xl hover:drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]"
              />
            </div>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection delay={100}>
        <SectionSeparator isDark={isDark} />
      </FadeInSection>

      {/* Vision & Mission Section */}
      <FadeInSection>
        <div className="flex flex-col-reverse md:flex-row-reverse justify-center items-center gap-8 lg:gap-16 max-w-6xl mx-auto">
          <div className="flex-1 text-center md:text-justify max-w-prose">
            <h2 className={`text-3xl md:text-4xl font-bold ${titleClass} mb-6 hover:opacity-85 transition-opacity`}>
              {about_vision_mission_title}
            </h2>
            <div className="space-y-4">
              <HoverableWords 
                  className={`text-lg md:text-xl leading-relaxed ${textClass} text-justify`} 
                  prophover={`transition-all inline-block duration-200 ease-in-out hover:scale-105 hover:text-cyan-600 ${isDark ? 'dark:hover:text-cyan-300' : ''} cursor-pointer`}
              >
                  {about_vision_mission_1}
              </HoverableWords>
              <HoverableWords 
                  className={`text-lg md:text-xl leading-relaxed ${textClass} text-justify`} 
                  prophover={`transition-all inline-block duration-200 ease-in-out hover:scale-105 hover:text-cyan-600 ${isDark ? 'dark:hover:text-cyan-300' : ''} cursor-pointer`}
              >
                  {about_vision_mission_2}
              </HoverableWords>
              {/* Added Vision Mission 3 */}
              <HoverableWords 
                  className={`text-lg md:text-xl leading-relaxed ${textClass} text-justify`} 
                  prophover={`transition-all inline-block duration-200 ease-in-out hover:scale-105 hover:text-cyan-600 ${isDark ? 'dark:hover:text-cyan-300' : ''} cursor-pointer`}
              >
                  {about_vision_mission_3}
              </HoverableWords>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="relative w-56 h-56 md:w-72 md:h-72">
              <Image
                src={`/images/vission_mission.png`}
                alt="Vision and Mission"
                fill
                sizes="(max-width: 768px) 224px, 288px"
                quality={85}
                className="object-contain animate-float transition-all duration-500 ease-in-out opacity-90 hover:opacity-100 hover:scale-110 hover:brightness-110 drop-shadow-xl hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              />
            </div>
          </div>
        </div>
      </FadeInSection>
    </div>
  );
}
