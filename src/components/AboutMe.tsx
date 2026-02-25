"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import FadeInSection from '@/components/FadeInSection';

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

export default function AboutMe(props: AboutMeProps) {
  const [currentPhoto, setCurrentPhoto] = useState(0);

  // Automatically cycle through carousel photos
  useEffect(() => {
    if (!props.carouselPhotos || props.carouselPhotos.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % props.carouselPhotos.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [props.carouselPhotos]);

  return (
    <div className="flex flex-col md:flex-row gap-12 items-start justify-center w-full max-w-6xl mx-auto">
      {/* Left Column: Carousel Image */}
      <FadeInSection className="w-full md:w-1/3 flex flex-col items-center md:sticky md:top-24">
        {props.carouselPhotos && props.carouselPhotos.length > 0 ? (
          <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
            {props.carouselPhotos.map((photo, index) => (
              <Image
                key={photo}
                src={`/images/photo_faran_aiki/${photo}`}
                alt={props.faran_photo}
                fill
                unoptimized
                className={`object-cover transition-opacity duration-1000 ease-in-out ${
                  index === currentPhoto ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="w-full aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-gray-500 dark:text-gray-400">No Photo Available</span>
          </div>
        )}
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic font-medium">
          {props.faran_photo}
        </p>
      </FadeInSection>

      {/* Right Column: Text Information */}
      <div className="w-full md:w-2/3 space-y-12">
        
        {/* About Me Section */}
        <FadeInSection>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 dark:text-white">
            {props.about_title}
          </h1>
          <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
            <p>{props.about_text_1}</p>
            <p>{props.about_text_2}</p>
          </div>
        </FadeInSection>

        {/* Philosophy Section */}
        <FadeInSection delay={100}>
          <h2 className="text-2xl font-bold mb-4 text-cyan-600 dark:text-cyan-400 border-b border-gray-200 dark:border-gray-800 pb-2">
            {props.about_philosophy_title}
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
            {props.about_philosophy}
          </p>
        </FadeInSection>

        {/* Principles and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Principles */}
          <FadeInSection delay={200}>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800 h-full shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {props.about_principle_title}
              </h2>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2 font-bold">•</span>
                  <span>{props.about_principle_1}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2 font-bold">•</span>
                  <span>{props.about_principle_2}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2 font-bold">•</span>
                  <span>{props.about_principle_3}</span>
                </li>
              </ul>
            </div>
          </FadeInSection>

          {/* Vision & Mission */}
          <FadeInSection delay={300}>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800 h-full shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {props.about_vision_mission_title}
              </h2>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2 font-bold">•</span>
                  <span>{props.about_vision_mission_1}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2 font-bold">•</span>
                  <span>{props.about_vision_mission_2}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-500 mr-2 font-bold">•</span>
                  <span>{props.about_vision_mission_3}</span>
                </li>
              </ul>
            </div>
          </FadeInSection>
        </div>

      </div>
    </div>
  );
}
