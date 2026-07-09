"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import type { TrackerType } from "@/components/interactive/TrackingIcon";

interface CyclingWordProps {
  dict: import('@/components/layout/Translator').TranslationDict;
  onTypeChange?: (type: TrackerType) => void;
}

export default function CyclingWord({ dict, onTypeChange }: CyclingWordProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isLgScreen, setIsLgScreen] = useState(false);

  const cyclingData: { word: string; type: TrackerType }[] = useMemo(() => [
    { word: dict.Word_See || "See", type: 'see' },
    { word: dict.Word_Do || "Do", type: 'do' },
    { word: dict.Word_Know || "Know", type: 'know' },
    { word: dict.Word_Search || "Search", type: 'search' }
  ], [dict]);

  useEffect(() => {
    setIsReady(true);
    setIsLgScreen(window.innerWidth >= 1024);
    
    const handleResize = () => setIsLgScreen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % cyclingData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isReady, cyclingData.length]);

  // Tell parent the type whenever wordIndex changes
  useEffect(() => {
    if (isReady && onTypeChange) {
      onTypeChange(cyclingData[wordIndex].type);
    }
  }, [wordIndex, isReady, cyclingData, onTypeChange]);

  return (
    <span className="inline-flex relative align-middle overflow-visible">
      {/* Invisible placeholder to maintain width */}
      <span className="invisible select-none pointer-events-none whitespace-nowrap nav-active-gacor">
        {cyclingData[wordIndex].word.trim()}
      </span>
      {isReady && (
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={wordIndex}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: isLgScreen ? -4.75 : -2.75, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="absolute inset-0 flex items-center justify-center lg:justify-start text-theme-500 whitespace-nowrap nav-active-gacor lowercase"
          >
            {cyclingData[wordIndex].word}
          </motion.span>
        </AnimatePresence>
      )}
    </span>
  );
}
