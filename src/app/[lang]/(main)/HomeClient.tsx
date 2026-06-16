"use client";

import React, { useState, useEffect } from 'react';
import TrackingIcon, { TrackerType } from "@/components/interactive/TrackingIcon";
import FadeInSection from "@/components/shared/FadeInSection";
import SearchBar from "@/components/shared/SearchBar";
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { NewsItem } from '@/lib/types';
import Link from 'next/link';
import { Newspaper, ArrowRight, User, Calendar } from 'lucide-react';
import Image from 'next/image';

interface HomeClientProps {
  lang: string;
  dict: Record<string, string>;
  initialNews?: NewsItem[];
}

export default function HomeClient({ lang, dict, initialNews = [] }: HomeClientProps) {
  const [isReady, setIsReady] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  const cyclingData: { word: string; type: TrackerType }[] = [
    { word: dict.Word_See || "See", type: 'see' },
    { word: dict.Word_Do || "Do", type: 'do' },
    { word: dict.Word_Know || "Know", type: 'know' },
    { word: dict.Word_Search || "Search", type: 'search' }
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
        }, 1500); // Reduced from 3000ms for faster interaction
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

  const baseText = dict.What_Do_You_Want_To_Base || "What do you want to {word}";
  const parts = baseText.split("{word}");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const partVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0, 0, 0.2, 1] } // standard easeOut as numeric array for strict typing
    }
  };

  return (
    <main className="min-h-[50vh] flex flex-col items-center justify-center pt-24 md:pt-12 pb-12">
      <div className="w-full max-w-6xl overflow-visible">
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">

          {/* The Main Question Section */}
          <div className="relative flex-1 z-1 text-center lg:text-left xs:pt-12 md:pt-6 lg:pt-0">
              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter"
                variants={containerVariants}
                initial="hidden"
                animate={isReady ? "visible" : "hidden"}
              >
                <motion.span variants={partVariants} className="inline-block whitespace-pre-wrap nav-active-gacor">{parts[0]}</motion.span>

                {/* Dynamic Word Container - Using a ghost element to set width for proper expansion */}
                <span className="inline-flex relative vertical-middle overflow-visible">
                  {/* Invisible Ghost Element to reserve horizontal space */}
                  <span className="invisible select-none pointer-events-none whitespace-nowrap nav-active-gacor">
                    {cyclingData[wordIndex].word.trim()}
                  </span>

                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={wordIndex}
                      initial={{ x: 0, y: 30, opacity: 0 }}
                      animate={{ x: 0, y: 0, opacity: 1 }}
                      exit={{ y: -30, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute inset-0 flex items-center justify-center lg:justify-start text-theme-500 whitespace-nowrap nav-active-gacor lowercase"
                    >
                      {cyclingData[wordIndex].word}
                    </motion.span>
                  </AnimatePresence>
                </span>

                <motion.span variants={partVariants} className="inline-block whitespace-pre-wrap nav-active-gacor">{parts[1]}</motion.span>
              </motion.h1>
          </div>

          {/* Dynamic Interactive Icon Section (Floating Right) */}
          <div className="flex-shrink-0 relative w-24 h-24 md:w-64 md:h-64 flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={wordIndex}
                    initial={{ opacity: 0, scale: 0.8, rotate: -15, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.1, rotate: 15, filter: 'blur(10px)' }}
                    transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute"
                >
                    <TrackingIcon type={cyclingData[wordIndex].type} />
                </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Quick Navigation / Explore Section */}
        {/*
        <FadeInSection delay={isReady ? 1.2 : 0}>
            <div className="mt-24 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-4 w-full no-print">
                {[
                    { name: dict.Identity, href: `/${lang}/identity` },
                    { name: dict.Website, href: `/${lang}/website` },
                    { name: dict.Portfolio, href: `/${lang}/portfolio` },
                    { name: dict.College, href: `/${lang}/college` }
                ].map((item: { name: string; href: string }) => (
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
        */}

        {/* Search Bar Section */}
        <FadeInSection delay={isReady ? 1.4 : 0}>
          <section className="w-full no-print" aria-labelledby="search-heading">
            {/*Make sure to change the Search Faran Aiki Content to language locales*/}
            <h2 id="search-heading" className="sr-only">Search Faran Aiki Content</h2>
            <SearchBar dict={dict} scope="all" />
          </section>
        </FadeInSection>

        {/* Latest Activity Section */}
        <FadeInSection delay={isReady ? 1.6 : 0}>
          <section className="mt-20 w-full no-print">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-theme-500/10 text-theme-500 shadow-sm border border-theme-500/20">
                  <Newspaper size={24} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black nav-active-gacor tracking-tight">
                  {dict.Latest_Activity || "Latest Activity"}
                </h2>
              </div>
              <Link
                href={`/${lang}/news`}
                className="flex items-center gap-2 text-sm font-bold text-theme-500 hover:text-theme-400 transition-colors group"
              >
                {dict.All || "All"}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {initialNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {initialNews.slice(0, 3).map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 + idx * 0.1 }}
                    className="group flex flex-col bg-theme-surface border border-theme-border rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-full"
                  >
                    {item.image ? (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-theme-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    ) : (
                      <div className="h-48 bg-theme-surface-strong flex items-center justify-center text-theme-muted/30">
                        <Newspaper size={48} />
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3 text-sm font-bold tracking-widest text-theme-muted opacity-70">
                        <Calendar size={12} />
                        {new Date(item.createdAt).toLocaleDateString(lang, {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>

                      <h3 className="text-xl font-black text-foreground group-hover:text-theme-500 transition-colors mb-3 line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-theme-muted text-sm line-clamp-3 mb-6 flex-1">
                        {item.content}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-theme-border/50">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full overflow-hidden border border-theme-border bg-theme-surface-strong flex items-center justify-center">
                            {item.author.avatarUrl ? (
                              <Image src={item.author.avatarUrl} alt="author" width={24} height={24} />
                            ) : (
                              <User size={12} className="text-theme-muted" />
                            )}
                          </div>
                          <span className="text-sm font-bold text-theme-500">{item.author.name || "Admin"}</span>
                        </div>

                        <Link
                          href={`/${lang}/news`}
                          className="text-sm font-black tracking-widest text-theme-muted group-hover:text-theme-500 transition-colors"
                        >
                          {dict.Read_More || "Read More"}
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-3xl border border-dashed border-theme-border flex flex-col items-center justify-center text-center">
                <Newspaper size={40} className="text-theme-muted/20 mb-4" />
                <p className="text-theme-muted font-bold">{dict.No_News || "No news yet."}</p>
              </div>
            )}
          </section>
        </FadeInSection>
      </div>
    </main>
  );
}
