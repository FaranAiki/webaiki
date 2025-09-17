"use client";

import Image from 'next/image';
import HoverableWords from '@/components/HoverableWords'
import { useState, useEffect } from 'react';

export type AboutMeProps = {
  [carouselPhotos: string],
};

export default function AboutMe( {carouselPhotos} : AboutMeProps ) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // const carouselPhotos = getFaranAikiPhoto();

  // Carousel things
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselPhotos.length);
    }, 5000); // 5000 milidetik = 5 detik

    return () => clearInterval(interval);
  }, []);

  return (
    // Generated using Gemini cuz I am too lazy to format lol
    <div>
    <div className="flex flex-col md:flex-row pt-2 justify-center items-center gap-8 md:gap-8 max-w-4xl mx-auto animate-fade-in">    
        <div className="text-center md:text-justify">
          <h1 className="transition-all text-4xl md:text-5xl pt-4 font-bold text-white hover:opacity-85">
            About Me
          </h1>
          <HoverableWords className="mt-4 text-lg text-gray-250 max-w-lg">
            Muhammad Faran Aiki (April 8, 2007) is currently a university student in School of Electrical Engineering and Informatics - Computation (SEEI-C), Bandung Institute of Technology. He is an intern at Analitica as the Education Team starting at May 2025. Moreover, he is a certified-proven human anomaly.
          </HoverableWords>
        </div>
        
        <div className="order-first md:order-last justify-center flex-shrink-0">
          <Image
            src={`/images/photo_faran_aiki/${carouselPhotos[currentIndex]}`}
            alt="Foto Muhammad Faran Aiki"
            width={200}
            height={200}
            className="transition-all shadow-lg border-4 opacity-90 hover:opacity-100 scale-95 hover:scale-100 "
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


