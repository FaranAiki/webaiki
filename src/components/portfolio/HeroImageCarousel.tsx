"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { m as motion, AnimatePresence } from 'framer-motion';

export function HeroImageCarousel({ photos, alt }: { photos: string[], alt: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!photos || photos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [photos]);

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 z-10 w-full h-full"
      >
        <Image
          src={`/images/photo_faran_aiki/${photos[currentIndex]}`}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 300px, 400px"
          quality={75}
        />
      </motion.div>
    </AnimatePresence>
  );
}
