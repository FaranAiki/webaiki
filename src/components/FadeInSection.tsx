"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePresentation } from './PresentationContext';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatNumber = (num: number | undefined, total: number | undefined) => {
    if (num === undefined || total === undefined) return '';
    
    if (slideNumberFormat === 'binary') {
        return num.toString(2).padStart(total.toString(2).length, '0');
    } else if (slideNumberFormat === 'hex') {
        return num.toString(16).toUpperCase();
    }
    
    // Default decimal
    const totalDigits = total.toString().length;
    return num.toString().padStart(totalDigits, '0');
  };

  // Skip animations on mobile for better performance
  if (isMobile && !isPresentationMode) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={initialVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: delay / 1000, ease: "easeOut" }}
      className={`relative ${className} ${isPresentationMode ? 'presentation-section' : ''}`}
    >
      {isPresentationMode ? (
        <div className="relative w-full h-full flex items-center justify-center">
          {children}

          {slideIndex && (
            <div className="absolute bottom-0 right-0 m-6 md:m-12 z-[100] print:hidden">
              <button 
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    cycleSlideNumberFormat();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-cyan-600/30 backdrop-blur-md border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:bg-cyan-600/50 transition-all duration-300 cursor-pointer group hover:scale-105"
              >
                <span className="text-white font-black tabular-nums tracking-tighter group-hover:text-cyan-200 transition-colors">
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

