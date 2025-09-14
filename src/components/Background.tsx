"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';

// TODO MAKE THIS EASIER
const images = [
  "/images/background_1.jpg", 
  "/images/background_2.jpg", 
  "/images/background_3.jpg", 
  "/images/background_4.jpg", 
  "/images/background_5.jpg", 
  "/images/background_6.jpg", 
];

const SLIDE_DURATION = 10000; // Duration per slide 
// --- ---

export default function Background() {
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
          priority={index === 0}
          className={`transition-opacity blur-xs duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-50' : 'opacity-0'
          }`}
        />
      ))}
      {/* Darken it to make texts easy to read */}
      <div className="absolute inset-0 bg-black opacity-50" />
    </div>
  );
}
