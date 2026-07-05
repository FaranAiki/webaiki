"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image'
import { m as motion, AnimatePresence } from 'framer-motion';
const SLIDE_DURATION = 10000;
/*
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function GeometricPattern({isDark}: GeometricPatternProps) {
  // Commented out to prevent JS parsing/execution overhead as it is unused and slows down performance
}
*/

export type BackgroundProps = {
  carousel: string[];
  showOverlay?: boolean;
};

export default function Background({ carousel, showOverlay = true }: BackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  // Preload first few images for smoother initial experience
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set([0, 1]));
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!carousel || carousel.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % carousel.length;

        // Add the new index to our loaded set so it gets rendered and fetched
        setLoadedIndices((prev) => {
          if (prev.has(nextIndex)) return prev;
          const newSet = new Set(prev);
          newSet.add(nextIndex);
          return newSet;
        });

        return nextIndex;
      });
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [carousel]);

  const isDark = mounted && resolvedTheme === 'dark';
  const overlayClass = !mounted
    ? "from-theme-surface/85 via-theme-surface/90 to-theme-surface/95" // Default for SSR
    : isDark
      ? "from-theme-surface/90 via-theme-surface/91 to-theme-surface/93"
      : "from-theme-surface/90 via-theme-surface/91 to-theme-surface/93";

  return (
    <div className={`presentation-background sticky top-0 left-0 w-full h-screen -mb-[100vh] z-[-1] pointer-events-none transform-gpu contain-strict overflow-hidden bg-theme-bg dark:bg-theme-bg-dark transition-colors duration-1000`}>

      <div className={`w-full h-full absolute inset-0 transform-gpu`} style={{ backfaceVisibility: 'hidden' }}>
        <AnimatePresence mode="wait">
            <motion.div
                key={currentIndex}
                initial={{ opacity: currentIndex === 0 ? 0.8 : 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={`blur-[4px] absolute inset-0 w-full h-full scale-105 transform-gpu will-change-[opacity]` }
                style={{ backfaceVisibility: 'hidden' }}
            >
                {loadedIndices.has(currentIndex) && (
                  <Image
                      fill={true}
                      src={`/images/background/${carousel[currentIndex]}`}
                      alt={`Background image ${currentIndex + 1} - Muhammad Faran Aiki Portfolio`}
                      className="w-full h-full object-cover"
                      sizes="100vw"
                      quality={85}
                      priority={currentIndex === 0}
                      loading={currentIndex === 0 ? "eager" : "lazy"}
                      fetchPriority={currentIndex === 0 ? "high" : "auto"}
                  />
                )}
            </motion.div>
        </AnimatePresence>

        {showOverlay && (
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            className={`absolute inset-0 transform-gpu bg-gradient-to-b ${overlayClass}`}
            style={{ backfaceVisibility: 'hidden' }}
            transition={{ duration: 1 }}
          />
        )}

        {/* mounted && <GeometricPattern isDark={isDark}/> */}
      </div>
    </div>
  );
}
