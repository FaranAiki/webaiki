"use client";

import { useState, useEffect, useRef } from 'react';

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

// idk gemini generated this shit
export default function FadeInSection({ children, delay = 0, className = "" }: FadeInSectionProps) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`presentation-section transition-[opacity,transform,filter] duration-500 ease-out transform will-change-[opacity,transform,filter] ${className} ${
        isVisible
          ? 'opacity-100 translate-y-0 blur-0'
          : 'opacity-0 translate-y-8 blur-sm' 
      }`}
    >
      {children}
    </div>
  );
}
