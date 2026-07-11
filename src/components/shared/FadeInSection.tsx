"use client";

import React, { useMemo } from 'react';
import { usePresentation } from '../providers/PresentationContext';
import { useInView } from '@/hooks/useInView';

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

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize options to avoid continuous re-rendering
  const options = useMemo(() => ({ rootMargin: '100px' }), []);
  const { ref, isInView } = useInView<HTMLDivElement>(options);
  
  // CRITICAL: Make content fully visible on server (SSR) and before hydration.
  // This prevents the "blank canvas" issue on slow networks where JS takes a while to load.
  const isVisible = !mounted || initialVisible || isInView;
  
  const style = delay ? { transitionDelay: `${delay}ms` } : {};

  return (
    <div
      ref={ref}
      style={style}
      className={`relative overflow-visible transition-all duration-700 ease-out transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} 
        ${className} 
        ${isPresentationMode ? 'presentation-section' : ''}
      `}
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
                className="flex items-center gap-1.5 px-4 py-2 rounded-full shadow-lg dark:shadow-none border border-black/10 dark:border-white/10 hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <span className="text-black dark:text-white font-black tabular-nums tracking-tighter group-hover:text-theme-500 transition-colors">
                  {formatNumber(slideIndex, totalSlides)}
                </span>
                <span className="text-black/40 dark:text-white/40">/</span>
                <span className="text-black/80 dark:text-white/80 font-medium tabular-nums">
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
    </div>
  );
  }
