"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function TrackingEye() {
  const eyeRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the movement
  const springConfig = { damping: 25, stiffness: 200 };
  const pupilX = useSpring(mouseX, springConfig);
  const pupilY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current) return;

      const rect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
      
      // Calculate movement within the eye bounds
      const limit = 20; // Increased limit for larger eye
      const moveX = Math.cos(angle) * limit;
      const moveY = Math.sin(angle) * limit;

      mouseX.set(moveX);
      mouseY.set(moveY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div 
      ref={eyeRef}
      className="relative flex items-center justify-center text-theme-500"
    >
        <div className="relative w-24 h-16 md:w-48 md:h-28">
            {/* The Eye Shape (Custom SVG Outline) */}
            <svg 
              viewBox="0 0 100 60" 
              className="w-full h-full fill-none stroke-current" 
              strokeWidth="2.5"
            >
              <path d="M10,30 Q50,0 90,30 Q50,60 10,30 Z" />
              {/* Inner Circle Guideline (Optional, very faint) */}
              <circle cx="50" cy="30" r="18" className="opacity-10" />
            </svg>
            
            {/* The Pupil (Inner Circle) - Moving within the outline */}
            <motion.div
                style={{
                    x: pupilX,
                    y: pupilY,
                }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
                <div className="w-8 h-8 md:w-16 md:h-16 bg-current rounded-full" />
            </motion.div>
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-theme-500/10 rounded-full blur-3xl -z-10 animate-pulse will-change-transform will-change-[opacity]" />
    </div>
  );
}
