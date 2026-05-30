"use client";

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

  // Helper to format number based on current format
  const formatNumber = (num: number, total: number) => {
    if (slideNumberFormat === 'binary') {
        const binary = num.toString(2);
        const maxBinaryLen = total.toString(2).length;
        return binary.padStart(maxBinaryLen, '0');
    } else if (slideNumberFormat === 'hex') {
        return `0x${num.toString(16).toUpperCase()}`;
    }
    return num.toString(10);
  };

  return (
    <motion.div
      initial={initialVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ 
        duration: 0.6, 
        delay: delay / 1000,
        ease: [0.215, 0.61, 0.355, 1] // easeOutCubic
      }}
      className={`presentation-section relative ${className}`}
    >
      {children}
      {isPresentationMode && slideIndex && totalSlides && (
        <div className="absolute bottom-8 right-8 z-50">
          <div 
            onClick={(e) => {
              e.stopPropagation();
              cycleSlideNumberFormat();
            }}
            className="flex items-center gap-2 px-3 py-1 border border-cyan-500/20 rounded text-sm bg-white/5 font-mono cursor-pointer hover:bg-white/10 hover:border-cyan-500/40 transition-all select-none"
            title="Click to toggle format (Decimal -> Hex -> Binary)"
          >
            <span className="text-white font-medium tabular-nums">
              {formatNumber(slideIndex, totalSlides)}
            </span>
            <span className="text-gray-500">/</span>
            <span className="text-cyan-500/80 font-medium tabular-nums">
              {formatNumber(totalSlides, totalSlides)}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
