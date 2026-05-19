"use client";

import { useState, useEffect, useRef } from 'react';
import { usePresentation } from './PresentationContext';

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  slideIndex?: number;
  totalSlides?: number;
}

// idk gemini generated this shit
export default function FadeInSection({ 
  children, 
  delay = 0, 
  className = "", 
  slideIndex, 
  totalSlides 
}: FadeInSectionProps) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);
  const { isPresentationMode } = usePresentation();

  useEffect(() => {
    const element = domRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Update state based on intersection
          setVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" 
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, []);

  // Helper to convert number to binary string with optional padding
  const toBinary = (num: number, total: number) => {
    const binary = num.toString(2);
    const maxBinaryLen = total.toString(2).length;
    return binary.padStart(maxBinaryLen, '0');
  };

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`presentation-section relative transition-[opacity,transform,filter] duration-500 ease-out transform will-change-[opacity,transform,filter] ${className} ${
        isVisible
          ? 'opacity-100 translate-y-0 blur-0'
          : 'opacity-0 translate-y-8 blur-sm' 
      }`}
    >
      {children}
      {isPresentationMode && slideIndex && totalSlides && (
        <div className="absolute bottom-8 right-8 pointer-events-none z-50">
          <div className="flex items-center gap-2 px-3 py-1 border border-cyan-500/20 rounded text-sm bg-white/5">
            <span className="text-white font-medium tracking-tight">
              {toBinary(slideIndex, totalSlides)}
            </span>
            <span className="text-gray-500">/</span>
            <span className="text-cyan-500/80 font-medium">
              {toBinary(totalSlides, totalSlides)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
