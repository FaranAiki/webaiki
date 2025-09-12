"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';

// TODO MAKE THIS SHIT SMOOTHER
const images = [
  'https://placehold.co/1920x1080/000000/FFFFFF?text=Background+1',
  'https://placehold.co/1920x1080/1a1a1a/FFFFFF?text=Background+2',
  'https://placehold.co/1920x1080/2a2a2a/FFFFFF?text=Background+3',
];

const SLIDE_DURATION = 5000; // Duration per slide 
// --- ---

export default function BackgroundCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-[-1]">
      {images.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Background image ${index + 1}`}
          layout="fill"
          objectFit="cover"
          quality={100}
          priority={index === 0} // Prioritaskan gambar pertama agar dimuat lebih cepat
          className={`transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-50' : 'opacity-0'
          }`}
        />
      ))}
      {/* Lapisan overlay gelap agar teks lebih mudah dibaca */}
      <div className="absolute inset-0 bg-black opacity-50" />
    </div>
  );
}
