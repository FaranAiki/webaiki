"use client";

import { useState, useEffect, useRef } from 'react';

interface GlitchSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function GlitchSection({ children, delay = 0, className = "" }: GlitchSectionProps) {
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
    <>
      <style jsx>{`
        @keyframes glitch-entry {
          0% { opacity: 0; transform:  translateY(20px) skew(20deg); filter: grayscale(1) blur(5px); }
          20% { opacity: 0.5; transform: translateY(-10px) skew(-20deg); filter: invert(0.1); }
          40% { opacity: 0.8; transform: translateY(5px) skew(10deg); filter: contrast(2); }
          60% { opacity: 0.9; transform: translateY(-2px) skew(-5deg); filter: grayscale(0); }
          80% { transform: translateY(0) skew(2deg); }
          100% { opacity: 1; transform: translateY(0) skew(0deg); filter: none; }
        }
      `}</style>
      
      <div
        ref={domRef}
        style={{ 
            animationDelay: `${delay}ms`,
            // Only apply animation when visible
            animation: isVisible ? 'glitch-entry 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both' : 'none',
            opacity: isVisible ? 1 : 0 // Fallback to ensure it stays hidden before animation
        }}
        className={`${className}`}
      >
        {children}
      </div>
    </>
  );
}
