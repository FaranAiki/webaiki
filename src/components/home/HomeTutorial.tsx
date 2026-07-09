"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function HomeTutorial() {
  const [step, setStep] = useState<'idle' | 'hero' | 'search' | 'done'>('idle');
  const [rect, setRect] = useState<{ x: number, y: number, w: number, h: number } | null>(null);

  useEffect(() => {
    const handleStart = () => {
      if (step === 'idle') {
        setStep('hero');
        window.removeEventListener('mousemove', handleStart);
        window.removeEventListener('touchstart', handleStart);
      }
    };

    window.addEventListener('mousemove', handleStart);
    window.addEventListener('touchstart', handleStart);

    return () => {
      window.removeEventListener('mousemove', handleStart);
      window.removeEventListener('touchstart', handleStart);
    };
  }, [step]);

  useEffect(() => {
    if (step === 'hero') {
      const el = document.getElementById('tutorial-hero-target');
      if (el) {
        const bounds = el.getBoundingClientRect();
        setRect({ x: bounds.x - 10, y: bounds.y - 10, w: bounds.width + 20, h: bounds.height + 20 });
      }

      const timer = setTimeout(() => setStep('search'), 600); // 0.6s total to give 0.1s gap
      return () => clearTimeout(timer);
    } else if (step === 'search') {
      const el = document.getElementById('tutorial-search-target');
      if (el) {
        const bounds = el.getBoundingClientRect();
        setRect({ x: bounds.x - 10, y: bounds.y - 10, w: bounds.width + 20, h: bounds.height + 20 });
      }

      const timer = setTimeout(() => setStep('done'), 600);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (step === 'idle' || step === 'done' || !rect) return null;

  const perimeter = 2 * (rect.w + rect.h);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <svg className="w-full h-full">
        <defs>
          <linearGradient id="nav-gacor-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--gacor-1, #3b82f6)" />
            <stop offset="50%" stopColor="var(--gacor-2, #8b5cf6)" />
            <stop offset="100%" stopColor="var(--gacor-3, #ec4899)" />
          </linearGradient>
        </defs>
          <motion.rect
            key={step}
            x={rect.x}
            y={rect.y}
            width={rect.w}
            height={rect.h}
            fill="none"
            stroke="url(#nav-gacor-gradient)"
            strokeWidth="4"
            rx="8"
            ry="8"
            initial={{ strokeDasharray: `150 ${perimeter}`, strokeDashoffset: perimeter, opacity: 0 }}
            animate={{ strokeDashoffset: -150, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.5, ease: "linear" }}
          />
      </svg>
    </div>
  );
}
