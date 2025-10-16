"use client";

import Image from 'next/image';
import HoverableWords from '@/components/HoverableWords'
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

export default function AboutMe( {carouselPhotos, about_text, about_title,
                                 about_philosophy_title, about_philosophy,
                                 about_principle_title, about_principle,
                                 about_vision_mission_title, about_vision_mission,
                                 faran_photo} : AboutMeProps ) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Carousel things
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselPhotos.length);
        setIsFading(false); // Start fading in the new image
      }, 300); // Match this duration with the CSS transition duration below

    }, 4000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [carouselPhotos.length]);

  return (
    // Base generated using Gemini cuz I am too lazy to format lol
    // Why should I separate this from the main file bruh, should I remove AboutMe component and make this a page instead?
    <div>
    <div className="flex flex-col md:flex-row pt-2 justify-center items-center gap-8 md:gap-8 max-w-4xl mx-auto animate-fade-in duration-300">
        <div className="text-center md:text-justify">
          <h1 className="transition-all text-4xl md:text-5xl pt-4 font-bold text-white hover:opacity-85">
            {about_title}
          </h1>
          <HoverableWords className="text-justify mt-4 text-lg text-gray-250 max-w-lg">
            {about_text}
          </HoverableWords>
        </div>

        <div className="order-first md:order-last flex-shrink-0">
          <Image
            src={`/images/photo_faran_aiki/${carouselPhotos[currentIndex]}`}
            alt={faran_photo}
            width={200}
            height={200}
            className={`
              transition-all duration-300
              shadow-lg border-4 scale-95 hover:scale-100 hover:shadow-gray-500/50
              duration-500 ease-in-out
              ${isFading ? 'opacity-0' : 'opacity-90 hover:opacity-100'}
            `}
            priority
          />
        </div>
    </div>

    {/* Section with move_forward.png */}
    <div className="flex flex-col md:flex-row pt-6 justify-center items-center gap-8 md:gap-8 max-w-4xl mx-auto animate-fade-in">
        <div className="text-center md:text-justify">
          <h2 className="transition-all text-3xl md:text-4xl pt-4 font-bold text-white hover:opacity-85" >
            {about_philosophy_title}
          </h2>
          <HoverableWords className="text-justify mt-4 text-lg text-gray-250 max-w-lg" prophover='transition-all inline-block duration-200 ease-in-out hover:text-cyan-300 hover:font-semibold cursor-pointer'>
            {about_philosophy}
          </HoverableWords>
        </div>
        <div className="order-first md:order-last flex-shrink-0">
          <Image
            src={`/images/move_forward.png`}
            alt="Move Forward Philosophy"
            width={200}
            height={200}
            className="animate-float transition-all duration-300 ease-in-out shadow-lg border-4 opacity-90 hover:opacity-100 scale-95 hover:scale-100 hover:-rotate-2 hover:shadow-lg hover:shadow-blue-500/50"
            priority
          />
        </div>
    </div>


    <div className="flex flex-col md:flex-row pt-6 justify-center items-center gap-8 md:gap-8 max-w-4xl mx-auto animate-fade-in">
        <div className="text-center md:text-justify">
          <h2 className="transition-all text-3xl md:text-4xl pt-4 font-bold text-white hover:opacity-85">
            {about_principle_title}
          </h2>
          <HoverableWords className="text-justify mt-4 text-lg text-gray-250 max-w-lg" prophover='transition-all inline-block duration-100 ease-in-out hover:scale-95 hover:italic hover:opacity-90 cursor-pointer'>
            {about_principle}
          </HoverableWords>
        </div>

        <div className="order-first md:order-last flex-shrink-0">
          <Image
            src={`/images/tree.png`}
            alt="Guiding Principles Tree"
            width={200}
            height={200}
            className="transition-all duration-300 ease-in-out shadow-lg border-4 opacity-90 hover:opacity-100 scale-95 hover:scale-100 hover:shadow-2xl hover:rotate-2  hover:shadow-emerald-500/60"
            priority
          />
        </div>
    </div>

    <div className="flex flex-col md:flex-row pt-6 justify-center items-center gap-8 md:gap-8 max-w-4xl mx-auto animate-fade-in">
        <div className="text-center md:text-justify">
          <h2 className="transition-all text-3xl md:text-4xl pt-4 font-bold text-white hover:opacity-85">
            {about_vision_mission_title}
          </h2>
          <HoverableWords className="text-justify mt-4 text-lg text-gray-250 max-w-lg" prophover='transition-all inline-block duration-100 ease-in-out hover:scale-95 hover:italic hover:opacity-90 cursor-pointer hover:text-cyan-300 '>
            {about_vision_mission}
          </HoverableWords>
        </div>
        <div className="order-first md:order-last flex-shrink-0">
          <Image
            src={`/images/vission_mission.png`}
            alt="Vision and Mission"
            width={200}
            height={200}
            className="transition-all animate-float duration-300 ease-in-out shadow-lg border-4 opacity-90 hover:opacity-100 scale-95 hover:scale-100 hover:brightness-110 hover:shadow-lg hover:shadow-purple-500/50"
            priority
          />
        </div>
    </div>


    <div className="opacity-70 hover:opacity-100 transition-all duration-250 justify-center items-center pt-4 gap-8 md:gap-8 max-4xl animate-fade-in">
      {/*<PdfViewer className="hover:pt-6 hover:scale-105" file="/ats_cv.pdf" /> */}
    </div>
  </div>
  );
}

