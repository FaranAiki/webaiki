"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { getImageProps } from 'next/image';
import { m as motion, AnimatePresence } from 'framer-motion';
const SLIDE_DURATION = 10000;

export type BackgroundProps = {
  carousel: { desktop: string[]; mobile: string[] };
  showOverlay?: boolean;
};

export default function Background({ carousel, showOverlay = true }: BackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set([0, 1]));
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const dLen = Math.max(1, carousel.desktop?.length || 1);
  const mLen = Math.max(1, carousel.mobile?.length || 1);
  const maxIndex = dLen * mLen;

  useEffect(() => {
    if ((!carousel.desktop || carousel.desktop.length === 0) && (!carousel.mobile || carousel.mobile.length === 0)) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % maxIndex;
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
  }, [carousel, maxIndex]);

  const isDark = mounted && resolvedTheme === 'dark';
  const overlayClass = !mounted
    ? "from-theme-surface/85 via-theme-surface/90 to-theme-surface/95" // Default for SSR
    : isDark
      ? "from-theme-surface/90 via-theme-surface/91 to-theme-surface/93"
      : "from-theme-surface/90 via-theme-surface/91 to-theme-surface/93";

  const safeDesktopIndex = currentIndex % dLen;
  const safeMobileIndex = currentIndex % mLen;
  const desktopImage = carousel.desktop?.[safeDesktopIndex];
  const mobileImage = carousel.mobile?.[safeMobileIndex];

  let pictureElement = null;

  if (loadedIndices.has(currentIndex) && desktopImage && mobileImage) {
    const commonProps = {
      alt: `Background image ${currentIndex + 1} - Muhammad Faran Aiki Portfolio`,
      fill: true,
      sizes: "100vw",
      quality: 85,
      priority: currentIndex === 0,
      loading: (currentIndex === 0 ? "eager" : "lazy") as "eager" | "lazy",
      fetchPriority: (currentIndex === 0 ? "high" : "auto") as "high" | "auto",
    };

    const {
      props: { srcSet: desktopSrcSet },
    } = getImageProps({ ...commonProps, src: `/images/background/${desktopImage}` });

    const {
      props: { srcSet: mobileSrcSet, src: mobileSrc, alt, loading, fetchPriority, sizes },
    } = getImageProps({ ...commonProps, src: `/images/background/${mobileImage}` });

    pictureElement = (
      <picture>
        <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
        <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
        <img
          src={mobileSrc}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          sizes={sizes}
          className="w-full h-full object-cover"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </picture>
    );
  }

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
                {pictureElement}
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
      </div>
    </div>
  );
}
