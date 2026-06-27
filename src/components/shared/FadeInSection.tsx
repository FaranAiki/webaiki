"use client";

import React from 'react';
import { m as motion } from 'framer-motion';
import { usePresentation } from '../providers/PresentationContext';

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  slideIndex?: number;
  totalSlides?: number;
  initialVisible?: boolean;
}

export default function FadeInSection({
  children,
  delay = 0,
  className = "",
  slideIndex,
  totalSlides,
  initialVisible = false
}: FadeInSectionProps) {
  const { isPresentationMode, slideNumberFormat, cycleSlideNumberFormat } = usePresentation();


  const formatNumber = (num: number | undefined, total: number | undefined) => {
    if (num === undefined || total === undefined) return '';

    if (slideNumberFormat === 'binary') {
        return num.toString(2).padStart(total.toString(2).length, '0');
    } else if (slideNumberFormat === 'hex') {
        return `0x${num.toString(16).toUpperCase()}`;
    }

    // Default decimal
    const totalDigits = total.toString().length;
    return num.toString().padStart(totalDigits, '0');
  };

  // CSS will handle skipping animations on mobile to ensure SSR works.
  
  return (
    <motion.div
      initial={initialVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: delay / 1000, ease: "easeOut" }}
      className={`relative overflow-visible ${className} ${isPresentationMode ? 'presentation-section' : ''}`}
    >
      {isPresentationMode ? (
        <div className="relative w-full h-full flex items-center justify-center text-black dark:text-white">
          {children}

          {slideIndex && (
            <div className="absolute bottom-0 right-0 m-6 md:m-12 z-[100]">
              <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    cycleSlideNumberFormat();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-theme-600/30 backdrop-blur-md border border-theme-400/30 shadow-[0_0_20px_var(--accent-shadow)] hover:bg-theme-600/50 transition-all duration-300 cursor-pointer group hover:scale-105"
              >
                <span className="text-white font-black tabular-nums tracking-tighter group-hover:text-theme-200 transition-colors">
                  {formatNumber(slideIndex, totalSlides)}
                </span>
                <span className="text-white/40">/</span>
                <span className="text-white/80 font-medium tabular-nums">
                  {formatNumber(totalSlides, totalSlides)}
                </span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {children}
        </>
      )}
    </motion.div>
  );
  }
