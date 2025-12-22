"use client";

import { useState, useEffect, useRef } from 'react';

interface PopRotateSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

// gemini generated this shit
export default function PopRotateSection({ children, delay = 0, className = "" }: PopRotateSectionProps) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = domRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      // Uses a bouncy cubic-bezier for the 'Pop' effect
      className={`transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${className} ${
        isVisible
          ? 'opacity-100 scale-100 rotate-0 translate-y-0 blur-0'
          : 'opacity-0 scale-75 rotate-6 translate-y-12 blur-sm' 
      }`}
    >
      {children}
    </div>
  );
}
