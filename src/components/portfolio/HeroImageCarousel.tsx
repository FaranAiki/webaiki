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

  // If we are at index 0, we render nothing (transparent) because the Server Component 
  // already rendered the first image at z-0. We only animate subsequent images on top.
  // Actually, animating the images via framer-motion is fine, we just make sure
  // it sits above the base image (z-10).
  return (
    <AnimatePresence mode="wait" initial={false}>
      {currentIndex > 0 && (
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4 }}
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
      )}
    </AnimatePresence>
  );
}
