"use client";

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { TrackerType } from "../../../components/interactive/TrackingIcon";
import FadeInSection from "@/components/shared/FadeInSection";

const TrackingIcon = dynamic(() => import("../../../components/interactive/TrackingIcon"), { ssr: false });
// SearchBar removed from here
import { m as motion, AnimatePresence, Variants } from 'framer-motion';
import { useAppStore } from '@/lib/store';

const DynamicHero = React.memo(({ dict, isReady, isLgScreen, isMdScreen, parts }: { dict: Record<string, string>, isReady: boolean, isLgScreen: boolean, isMdScreen: boolean, parts: string[] }) => {
  const [wordIndex, setWordIndex] = useState(0);

  const cyclingData: { word: string; type: TrackerType }[] = useMemo(() => [
    { word: dict.Word_See || "See", type: 'see' },
    { word: dict.Word_Do || "Do", type: 'do' },
    { word: dict.Word_Know || "Know", type: 'know' },
    { word: dict.Word_Search || "Search", type: 'search' }
  ], [dict]);

  useEffect(() => {
    if (!isReady) return;
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % cyclingData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isReady, cyclingData.length]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const partVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] } }
  };

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="relative flex-1 z-1 text-center lg:text-left xs:pt-12 md:pt-6 lg:pt-0">
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter"
            variants={containerVariants}
            initial={false}
            animate={isReady ? "visible" : "hidden"}
          >
            <motion.span variants={partVariants} className="inline-block whitespace-pre-wrap nav-active-gacor">{parts[0]}</motion.span>
            <span className="inline-flex relative align-middle overflow-visible">
              <span className="invisible select-none pointer-events-none whitespace-nowrap nav-active-gacor">
                {cyclingData[wordIndex].word.trim()}
              </span>
              <AnimatePresence mode="popLayout">
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
            </span>
            <motion.span variants={partVariants} className="inline-block whitespace-pre-wrap nav-active-gacor">{parts[1]}</motion.span>
          </motion.h2>
      </div>
      <div className="hidden md:flex flex-shrink-0 relative md:w-64 md:h-64 items-center justify-center">
        {isMdScreen && (
          <AnimatePresence mode="wait">
              <motion.div
                  key={wordIndex}
                  initial={{ opacity: 0, scale: 0.8, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.1, y: -15 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  className="absolute"
              >
                  <TrackingIcon type={cyclingData[wordIndex].type} />
              </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
});
DynamicHero.displayName = 'DynamicHero';

interface HomeClientProps {
  dict: Record<string, string>;
  children?: React.ReactNode;
}

export default function HomeClient({ dict, children }: HomeClientProps) {
  const [isReady, setIsReady] = useState(true);
  const [isLgScreen, setIsLgScreen] = useState(true);
  const [isMdScreen, setIsMdScreen] = useState(true);

  const isGlobalLoading = useAppStore((state) => state.isGlobalLoading);

  useEffect(() => {
    if (!isGlobalLoading) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [isGlobalLoading]);

  useEffect(() => {
    const handleResize = () => {
      setIsLgScreen(window.innerWidth >= 1024);
      setIsMdScreen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);



  const baseText = dict.What_Do_You_Want_To_Base || "What do you want to {word}";
  const parts = baseText.split("{word}");

  return (
    <main className="min-h-[50vh] flex flex-col items-center justify-center px-4 md:px-8 pt-24 md:pt-12 pb-12">
      <h1 className="sr-only">{dict.Search_About_Faran || "Search about Muhammad Faran Aiki"}</h1>
      <div className="w-full max-w-6xl overflow-visible">
          <DynamicHero dict={dict} isReady={isReady} isLgScreen={isLgScreen} isMdScreen={isMdScreen} parts={parts} />

        {/* Fake Search Bar to open Command Palette */}
        <FadeInSection delay={isReady ? 1.4 : 0}>
          <section className="w-full no-print mt-4 md:mt-8 flex justify-center" aria-labelledby="search-heading">
            <h2 id="search-heading" className="sr-only">{dict.Search_About_Faran || "Search Faran Aiki Content"}</h2>
            <button
              type="button"
              onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
              className="group relative flex w-full max-w-2xl items-center gap-3 rounded-full border border-theme-border bg-theme-surface-strong/50 px-6 py-4 text-left shadow-sm transition-all hover:border-theme-500 hover:bg-theme-surface hover:shadow-theme-shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-theme-muted group-hover:text-theme-500 transition-colors"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <span className="flex-1 text-[var(--text-muted)] text-sm font-medium tracking-wide">
                {dict.Command_Palette_Search_Placeholder || "Type a command or search portfolio..."}
              </span>
              <kbd className="hidden md:inline-flex h-6 items-center gap-1 font-mono text-[11px] font-black nav-active-gacor opacity-100 transition-colors tracking-widest">
                Ctrl + K
              </kbd>
            </button>
          </section>
        </FadeInSection>

        {/* Latest Activity Section */}
        <FadeInSection delay={isReady ? 1.6 : 0}>
          {children}
        </FadeInSection>
      </div>
    </main>
  );
}
