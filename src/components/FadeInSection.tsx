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

  // Calculate horizontal position for the counter (0% to 100%)
  const counterPosition = slideIndex && totalSlides && totalSlides > 1
    ? ((slideIndex - 1) / (totalSlides - 1)) * 100
    : 50;

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
        <div 
          className="absolute bottom-12 left-0 w-full px-12 pointer-events-none"
          style={{ 
            display: 'flex', 
            justifyContent: 'center'
          }}
        >
          <div 
            className="transition-all duration-500 ease-out"
            style={{ 
              width: '100%',
              display: 'flex',
              justifyContent: counterPosition === 0 ? 'flex-start' : counterPosition === 100 ? 'flex-end' : 'center',
              transform: counterPosition > 0 && counterPosition < 100 ? `translateX(${counterPosition - 50}%)` : 'none'
            }}
          >
            <span className="text-cyan-500 font-mono text-sm font-black bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 backdrop-blur-sm shadow-sm">
              {slideIndex} / {totalSlides}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
