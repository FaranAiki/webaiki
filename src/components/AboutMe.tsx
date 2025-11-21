"use client";

import Image from 'next/image';
import HoverableWords from '@/components/HoverableWords';
import { useState, useEffect } from 'react';

interface AboutMeProps {
  carouselPhotos: string[];
  about_text: string;
  about_title: string;
  about_philosophy_title: string;
  about_philosophy: string;
  about_principle_title: string;
  about_principle: string;
  about_vision_mission_title: string;
  about_vision_mission: string;
  faran_photo: string;
}

const SectionSeparator = () => (
  <div className="w-full max-w-4xl mx-auto my-16">
    <div className="h-px bg-gradient-to-r from-transparent via-gray-500/50 to-transparent" />
  </div>
);

export default function AboutMe({
  carouselPhotos,
  about_text,
  about_title,
  about_philosophy_title,
  about_philosophy,
  about_principle_title,
  about_principle,
  about_vision_mission_title,
  about_vision_mission,
  faran_photo
}: AboutMeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Carousel things
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselPhotos.length);
        setIsFading(false); 
      }, 300); 

    }, 4000); 

    return () => clearInterval(interval);
  }, [carouselPhotos.length]);

  return (
    <div className="w-full px-10 py-10">
      
      {/* About Me */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-12 max-w-5xl mx-auto animate-fade-in">
        <div className="flex-1 text-center md:text-justify">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 hover:opacity-85 transition-opacity">
            {about_title}
          </h1>
          <HoverableWords className="text-lg text-gray-250 leading-relaxed text-justify">
            {about_text}
          </HoverableWords>
        </div>

        <div className="flex-shrink-0 relative">
          <div className="relative w-64 h-64 md:w-72 md:h-72">
             {/* Decorative backdrop blur */}
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full transform scale-90"></div>
            <Image
              src={`/images/photo_faran_aiki/${carouselPhotos[currentIndex]}`}
              alt={faran_photo}
              fill
              className={`
                object-cover rounded-xl
                transition-all duration-500 ease-in-out
                shadow-2xl border-2 border-white/10
                hover:scale-105 hover:shadow-blue-500/30
                ${isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
              `}
              priority
            />
          </div>
        </div>
      </div>

      <SectionSeparator />

      {/* Philosophy  */}
      <div className="flex flex-col md:flex-row-reverse justify-center items-center gap-12 max-w-5xl mx-auto animate-fade-in">
        <div className="flex-1 text-center md:text-justify">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 hover:opacity-85 transition-opacity">
            {about_philosophy_title}
          </h2>
          <HoverableWords 
            className="text-lg text-gray-250 leading-relaxed text-justify md:text-justify" 
            prophover='transition-all inline-block duration-200 ease-in-out hover:text-cyan-300 hover:font-semibold cursor-pointer'
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

      <SectionSeparator />

      {/* Principles */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-12 max-w-5xl mx-auto animate-fade-in">
        <div className="flex-1 text-center md:text-justify">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 hover:opacity-85 transition-opacity">
            {about_principle_title}
          </h2>
          <HoverableWords 
            className="text-lg text-gray-250 leading-relaxed text-justify" 
            prophover='transition-all inline-block duration-100 ease-in-out hover:scale-95 hover:italic hover:opacity-90 cursor-pointer'
          >
            {about_principle}
          </HoverableWords>
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

      <SectionSeparator />

      {/* Vision & Mission  */}
      <div className="flex flex-col md:flex-row-reverse justify-center items-center gap-12 max-w-5xl mx-auto animate-fade-in">
        <div className="flex-1 text-center md:text-justify">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 hover:opacity-85 transition-opacity">
            {about_vision_mission_title}
          </h2>
          <HoverableWords 
            className="text-lg text-gray-250 leading-relaxed text-justify md:text-justify" 
            prophover='transition-all inline-block duration-100 ease-in-out hover:scale-95 hover:italic hover:opacity-90 cursor-pointer hover:text-cyan-300'
          >
            {about_vision_mission}
          </HoverableWords>
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

      <div className="opacity-70 hover:opacity-100 transition-all duration-250 flex justify-center items-center py-8">
        {/* <PdfViewer className="hover:pt-6 hover:scale-105" file="/ats_cv.pdf" /> */}
      </div>
    </div>
  );
}
