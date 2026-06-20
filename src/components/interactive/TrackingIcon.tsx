"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { HandMetal, Lightbulb, Search } from 'lucide-react';

export type TrackerType = 'see' | 'do' | 'know' | 'search';

interface TrackerProps {
    type: TrackerType;
}

export default function TrackingIcon({ type }: TrackerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const trackX = useSpring(mouseX, springConfig);
  const trackY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

      // Limit movement within the icon
      const limit = type === 'see' ? 18 : 10;
      const moveX = Math.cos(angle) * limit;
      const moveY = Math.sin(angle) * limit;

      mouseX.set(moveX);
      mouseY.set(moveY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, type]);

  const renderContent = () => {
    switch (type) {
      case 'see':
        return (
            <div className="relative w-24 h-16 md:w-48 md:h-28">
                <svg viewBox="0 0 100 60" className="w-full h-full fill-none stroke-current" strokeWidth="2.5">
                    <path d="M10,30 Q50,0 90,30 Q50,60 10,30 Z" />
                </svg>
                <motion.div style={{ x: trackX, y: trackY }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 md:w-16 md:h-16 bg-current rounded-full" />
                </motion.div>
            </div>
        );
      case 'do':
        return (
            <div className="relative w-24 h-24 md:w-40 md:h-40 flex items-center justify-center">
                <HandMetal size={80} strokeWidth={1} className="opacity-20 md:w-32 md:h-32" />
                <motion.div style={{ x: trackX, y: trackY }} className="absolute inset-0 flex items-center justify-center pointer-events-none text-theme-500">
                    <HandMetal size={64} strokeWidth={2} className="md:w-24 md:h-24 shadow-theme-shadow" />
                </motion.div>
            </div>
        );
      case 'know':
        return (
            <div className="relative w-24 h-24 md:w-40 md:h-40 flex items-center justify-center">
                <Lightbulb size={80} strokeWidth={1} className="opacity-20 md:w-32 md:h-32" />
                <motion.div style={{ x: trackX, y: trackY }} className="absolute inset-0 flex items-center justify-center pointer-events-none text-theme-500">
                    <div className="relative">
                        <Lightbulb size={64} strokeWidth={2} className="md:w-24 md:h-24" />
                        <div className="absolute inset-0 blur-lg bg-theme-500/30 -z-10" />
                    </div>
                </motion.div>
            </div>
        );
      case 'search':
        return (
            <div className="relative w-24 h-24 md:w-40 md:h-40 flex items-center justify-center">
                <Search size={80} strokeWidth={1} className="opacity-20 md:w-32 md:h-32" />
                <motion.div style={{ x: trackX, y: trackY }} className="absolute inset-0 flex items-center justify-center pointer-events-none text-theme-500">
                    <Search size={64} strokeWidth={2} className="md:w-24 md:h-24" />
                </motion.div>
            </div>
        );
    }
  };

  return (
    <div ref={containerRef} className="relative flex items-center justify-center text-theme-500">
        {renderContent()}
        <div className="absolute inset-0 bg-theme-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
    </div>
  );
}
