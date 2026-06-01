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
      className={`relative ${className}`}
    >
      {children}
      
      {isPresentationMode && slideIndex && (
        <div className="absolute bottom-8 right-8 z-[100] print:hidden">
          <button 
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                cycleSlideNumberFormat();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/40 backdrop-blur-md border border-blue-400/30 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:bg-blue-600/60 transition-all duration-300 cursor-pointer group hover:scale-105"
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
    </motion.div>
  );
}
