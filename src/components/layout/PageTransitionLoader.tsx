"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { m as motion, AnimatePresence } from "framer-motion";
import LogoIcon from "@/components/ui/LogoIcon";
import { useAppStore } from "@/lib/store";
import { createPortal } from "react-dom";

import { getThemeLogoFilter } from "@/lib/utils";

export default function PageTransitionLoader({ label }: { label: string }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const colorTheme = useAppStore((state) => state.color);
  const isGlobalLoading = useAppStore((state) => state.isGlobalLoading);

  useEffect(() => {
    if (isGlobalLoading) {
      setIsNavigating(true);
      setProgress(0);
      setIsFinished(false);
      return undefined;
    } else {
      // Finish loading when global loading is explicitly set to false
      setProgress(100);
      setIsFinished(true);
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setTimeout(() => {
          setProgress(0);
          setIsFinished(false);
        }, 150);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isGlobalLoading]);

  const prevPathnameRef = useRef(pathname);
  const prevSearchParamsRef = useRef(searchParams?.toString());

  // Handle route change completion
  useEffect(() => {
    const currentSearch = searchParams?.toString();
    const hasPathChanged = pathname !== prevPathnameRef.current;
    const hasSearchChanged = currentSearch !== prevSearchParamsRef.current;

    if (isNavigating && (hasPathChanged || hasSearchChanged)) {
      setProgress(100);
      setIsFinished(true);
      
      const timer = setTimeout(() => {
        setIsNavigating(false);
        // Reset after fade out
        setTimeout(() => {
          setProgress(0);
          setIsFinished(false);
        }, 150);
      }, 50); // Fast exit, don't hold the user hostage
      
      prevPathnameRef.current = pathname;
      prevSearchParamsRef.current = currentSearch;
      
      return () => clearTimeout(timer);
    }
    
    if (!isNavigating) {
      prevPathnameRef.current = pathname;
      prevSearchParamsRef.current = currentSearch;
    }
    return undefined;
  }, [pathname, searchParams, isNavigating]);

  // Handle progressive fake loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isNavigating && !isFinished) {
      // Start with an initial burst
      setProgress(15);
      interval = setInterval(() => {
        setProgress((oldProgress) => {
          const remaining = 100 - oldProgress;
          // Faster step, max out at 90%
          if (oldProgress >= 90) return 90;
          return oldProgress + remaining * 0.15;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isNavigating, isFinished]);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      
      const href = target.getAttribute('href');
      if (!href) return;
      
      // Don't intercept target="_blank"
      if (target.getAttribute('target') === '_blank') return;
      
      // Handle anchor links
      if (href.startsWith('#')) return;

      const currentUrl = new URL(window.location.href);
      const targetUrl = new URL(href, window.location.origin);
      
      // External links don't trigger internal loader
      if (currentUrl.origin !== targetUrl.origin) return;

      // Don't intercept files (downloads or direct media access)
      if (target.hasAttribute('download')) return;
      if (/\.(pdf|xml|json|txt|csv|zip|tar|gz|rar|png|jpe?g|gif|svg|avif|webp|mp4|webm)$/i.test(targetUrl.pathname)) return;

      // Same page navigation (e.g. hash changes)
      if (currentUrl.pathname === targetUrl.pathname && currentUrl.search === targetUrl.search) {
        return;
      }
      
      // Exclude special meta/ctrl key clicks
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      setIsNavigating(true);
      setProgress(0);
    };

    document.addEventListener('click', handleAnchorClick);
    
    // Handle BFCache (Back-Forward Cache) restores
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setIsNavigating(false);
        setProgress(0);
        setIsFinished(false);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  // Safety fallback timeout: if navigating takes too long (e.g., a silent download or failed redirect),
  // forcefully reset the loader after 8 seconds so the user isn't permanently stuck.
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isNavigating && !isFinished) {
      timeoutId = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
        setIsFinished(false);
      }, 8000);
    }
    return () => clearTimeout(timeoutId);
  }, [isNavigating, isFinished]);

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const content = (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 w-screen h-[100dvh] z-[10000] flex items-center justify-center bg-theme-bg/80 dark:bg-theme-bg-dark/80 backdrop-blur-sm pointer-events-auto"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}
        >
          <div className="relative flex flex-col items-center gap-6 px-10 py-8 rounded-[2rem] bg-theme-surface/60 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20 dark:border-white/10 backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/5 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-theme-500/20 blur-3xl rounded-full pointer-events-none" />

            {/* Unified Logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center animate-pulse pointer-events-none z-10 md:top-[calc(50%-14px)]">
               <LogoIcon 
                 className="w-12 h-12 md:w-7 md:h-7 opacity-80 md:opacity-70 dark:opacity-100 md:dark:opacity-90 drop-shadow-2xl md:drop-shadow-none"
               />
            </div>

            {/* Desktop View - Circular */}
            <div className="hidden md:flex relative items-center justify-center w-16 h-16">

              {/* Progress SVG */}
              <svg className="w-full h-full transform -rotate-90 overflow-visible">
                <defs>
                  <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--gacor-1)" />
                    <stop offset="50%" stopColor="var(--gacor-2)" />
                    <stop offset="100%" stopColor="var(--gacor-3)" />
                  </linearGradient>
                </defs>
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  className="stroke-theme-muted/10 dark:stroke-theme-muted/20"
                  strokeWidth="3.5"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  className="transition-all duration-300 ease-out"
                  strokeWidth="3.5"
                  fill="none"
                  stroke="url(#loadingGradient)"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 6px var(--accent-shadow))' }}
                />
              </svg>
            </div>

            {/* Mobile View - Linear */}
            <div className="flex md:hidden flex-col items-center justify-center gap-4 w-[200px]">
              <div className="w-full h-1.5 bg-theme-muted/10 dark:bg-theme-muted/20 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--gacor-1)] via-[var(--gacor-2)] to-[var(--gacor-3)] transition-all duration-300 ease-out rounded-full"
                  style={{ 
                    width: `${progress}%`,
                    boxShadow: '0 0 12px var(--accent-shadow)' 
                  }}
                />
              </div>
            </div>

            <p className="font-bold text-sm tracking-widest text-theme-foreground/90 opacity-90 text-center">
              {label}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  
  // Mount directly to documentElement (<html>) to avoid any transforms on <body>
  // that would trap position: fixed and break viewport positioning.
  return createPortal(
    content,
    document.documentElement
  );
}
