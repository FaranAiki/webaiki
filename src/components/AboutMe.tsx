"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';

const carouselPhotos = [
  "/images/fa_photo_red.jpg",
  "/images/fa_photo_teknik_informatika.jpg",
  "/images/fa_photo_nerd.jpg",
  "/images/fa_photo_batik.jpg"
];

export default function AboutMe() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Carousel things
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselPhotos.length);
    }, 5000); // 5000 milidetik = 5 detik

    return () => clearInterval(interval);
  }, []);

  return (
    // Generated using Gemini cuz I am too lazy to format lol
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-8 max-w-4xl mx-auto">    
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            About Me
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-lg">
            Muhammad Faran Aiki (April 8, 2007) is currently a university student in School of Electrical Engineering and Informatics - Computation (SEEI-C), Bandung Institute of Technology.
          </p>
        </div>
        
        <div className="order-first md:order-last flex-shrink-0">
          <Image
            src={carouselPhotos[currentIndex]}
            alt="Foto Muhammad Faran Aiki"
            width={200}
            height={200}
            className="transition-all shadow-lg border-4 opacity-90 hover:opacity-100 scale-95 hover:scale-100"
            priority
          />
        </div>
        
      </div>
  );
}


