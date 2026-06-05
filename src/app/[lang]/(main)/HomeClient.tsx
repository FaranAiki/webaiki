"use client";

import React, { useState, useEffect } from 'react';
import TrackingIcon, { TrackerType } from "@/components/interactive/TrackingIcon";
import FadeInSection from "@/components/shared/FadeInSection";
import { motion, AnimatePresence } from 'framer-motion';

interface HomeClientProps {
  lang: string;
  dict: any;
}

export default function HomeClient({ lang, dict }: HomeClientProps) {
  const [isReady, setIsReady] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  const cyclingData: { word: string; type: TrackerType }[] = [
    { word: dict.Word_See || "see", type: 'see' },
    { word: dict.Word_Do || "do", type: 'do' },
    { word: dict.Word_Know || "know", type: 'know' },
    { word: dict.Word_Search || "search", type: 'search' }
  ];

  useEffect(() => {
    const checkLoading = () => {
      const loadingOverlay = document.querySelector('.fixed.inset-0.z-\\[100\\]');
      if (!loadingOverlay) {
        setIsReady(true);
      } else {
        const observer = new MutationObserver(() => {
          if (!document.querySelector('.fixed.inset-0.z-\\[100\\]')) {
            setIsReady(true);
            observer.disconnect();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        const fallback = setTimeout(() => {
          setIsReady(true);
          observer.disconnect();
        }, 3000);
        return () => {
          observer.disconnect();
          clearTimeout(fallback);
        };
      }
    };
    checkLoading();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % cyclingData.length);
    }, 3000); // 3 second interval
    return () => clearInterval(interval);
  }, [isReady, cyclingData.length]);

  const baseText = dict.What_Do_You_Want_To_Base || "What do you want to {word}?";
  const parts = baseText.split("{word}");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const partVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <main className="min-h-[85vh] flex flex-col items-center justify-center pt-24 overflow-hidden">
      <div className="w-full max-w-6xl">
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">

          {/* The Main Question Section */}
          <div className="relative flex-1 z-10 text-center md:text-left">
              <motion.h1
                className="text-4xl md:text-6xl font-black tracking-tighter"
                variants={containerVariants}
                initial="hidden"
                animate={isReady ? "visible" : "hidden"}
              >
                <motion.span variants={partVariants} className="inline-block whitespace-pre-wrap nav-active-gacor">{parts[0]}</motion.span>

                {/* Dynamic Word Container - Using a more stable inline-flex approach */}
                <span className="inline-flex relative vertical-middle mx-[0.1em] h-[1.1em] min-w-[1.5ch]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={wordIndex}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 24, opacity: 1 }}
                      exit={{ y: -30, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute left-0 bottom-0 text-theme-500 whitespace-nowrap nav-active-gacor"
                    >
                      {cyclingData[wordIndex].word}
                    </motion.span>
                  </AnimatePresence>
                </span>

                <motion.span variants={partVariants} className="inline-block whitespace-pre-wrap nav-active-gacor">{parts[1]}</motion.span>
              </motion.h1>
          </div>

          {/* Dynamic Interactive Icon Section (Floating Right) */}
          <div className="flex-shrink-0 relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={wordIndex}
                    initial={{ opacity: 0, scale: 0.8, rotate: -15, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.1, rotate: 15, filter: 'blur(10px)' }}
                    transition={{ duration: 0.6, ease: "anticipate" }}
                    className="absolute"
                >
                    <TrackingIcon type={cyclingData[wordIndex].type} />
                </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Quick Navigation / Explore Section */}
        <FadeInSection delay={isReady ? 1.2 : 0}>
            <div className="mt-24 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-4 w-full no-print">
                {[
                    { name: dict.Identity, href: `/${lang}/identity` },
                    { name: dict.Website, href: `/${lang}/website` },
                    { name: dict.Portfolio, href: `/${lang}/portfolio` },
                    { name: dict.College, href: `/${lang}/college` }
                ].map((item: any) => (
                    <a
                        key={item.href}
                        href={item.href}
                        className="px-6 py-5 rounded-2xl bg-theme-surface-strong border border-theme-border hover:border-theme-500 transition-all text-center font-bold group shadow-sm hover:shadow-theme-shadow"
                    >
                        <span className="group-hover:text-theme-500 transition-colors tracking-widest text-xs">
                            {item.name}
                        </span>
                    </a>
                ))}
            </div>
        </FadeInSection>
      </div>
    </main>
  );
}
