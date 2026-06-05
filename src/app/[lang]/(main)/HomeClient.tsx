"use client";

import React, { useState, useEffect } from 'react';
import TrackingEye from "@/components/interactive/TrackingEye";
import FadeInSection from "@/components/shared/FadeInSection";
import { motion } from 'framer-motion';

interface HomeClientProps {
  lang: string;
  dict: any;
  questionText: string;
}

export default function HomeClient({ lang, dict, questionText }: HomeClientProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const words = questionText.split(' ');

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

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      filter: 'blur(10px)',
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  // Subtle floating animation for each word
  const floatingAnimation = (i: number) => ({
    y: [0, -5, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
      delay: i * 0.2,
    }
  });

  return (
    <main className="min-h-[85vh] flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-8 md:gap-12">

          {/* The Main Question Section */}
          <div className="relative flex-1 max-w-3xl">
              <motion.h1 
                className="text-5xl md:text-8xl font-black tracking-tighter leading-[1] nav-active-gacor relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate={isReady ? "visible" : "hidden"}
              >
                {words.map((word, index) => (
                  <motion.span 
                    key={index} 
                    className="inline-block mr-[0.2em]"
                    variants={wordVariants}
                    animate={isReady ? floatingAnimation(index) : {}}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>
          </div>

          {/* The Eye Section (Right side) */}
          <motion.div 
            className="flex-shrink-0 relative group translate-y-[-10%] md:translate-y-0"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={isReady ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ delay: 1, duration: 1, ease: "easeOut" }}
          >
              <TrackingEye />
              <div className="absolute -inset-8 bg-theme-500/5 rounded-full blur-3xl -z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </motion.div>

        </div>

        {/* Quick Navigation / Explore Section */}
        <FadeInSection delay={1.5}>
            <div className="mt-20 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
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
