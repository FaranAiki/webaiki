"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export type SlideNumberFormat = 'decimal' | 'hex' | 'binary';

interface PresentationContextType {
  isPresentationMode: boolean;
  togglePresentationMode: () => void;
  slideNumberFormat: SlideNumberFormat;
  cycleSlideNumberFormat: () => void;
}

const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

interface PresentationProviderProps {
  children: React.ReactNode;
  initialIsPresentationMode?: boolean;
  initialSlideNumberFormat?: SlideNumberFormat;
}

export function PresentationProvider({ 
  children, 
  initialIsPresentationMode = false,
  initialSlideNumberFormat = 'binary'
}: PresentationProviderProps) {
  const [isPresentationMode, setIsPresentationMode] = useState(initialIsPresentationMode);
  const [slideNumberFormat, setSlideNumberFormat] = useState<SlideNumberFormat>(initialSlideNumberFormat);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Disable presentation mode on home page, /portfolio and /all routes
  useEffect(() => {
    const isHomePage = !pathname || pathname === '/' || /^\/[a-z]{2}$/.test(pathname) || /^\/[a-z]{2}\/$/.test(pathname);
    if (isHomePage || pathname?.endsWith('/portfolio') || pathname?.endsWith('/all')) {
      setIsPresentationMode(false);
      if (mounted) localStorage.setItem("presentation_mode", "false");
    }
  }, [pathname, mounted]);

  // Load state from localStorage on mount and handle resizing
  useEffect(() => {
    if (!mounted) return;

    // Helper to get from cookie or localStorage
    const getSetting = (key: string) => {
      const cookies = document.cookie.split('; ').reduce((acc: import('@/components/layout/Translator').TranslationDict, current) => {
        const [name, value] = current.split('=');
        if (name && value) acc[name.trim()] = value;
        return acc;
      }, {});
      
      if (cookies[key]) return decodeURIComponent(cookies[key]);
      return localStorage.getItem(key);
    };

    const savedFormat = getSetting("presentation_slide_format") as SlideNumberFormat;
    const savedMode = getSetting("presentation_mode");

    // Check if body already has the class (e.g., from Sultan Print injection)
    const hasBodyClass = document.body.classList.contains('presentation-mode');
    
    if (savedFormat && ['decimal', 'hex', 'binary'].includes(savedFormat)) {
      setSlideNumberFormat(savedFormat);
    }
    
    const checkScreenSize = () => {
      const large = window.innerWidth >= 768; // md breakpoint
      setIsLargeScreen(large);
      
      const isHomePage = !window.location.pathname || window.location.pathname === '/' || /^\/[a-z]{2}$/.test(window.location.pathname) || /^\/[a-z]{2}\/$/.test(window.location.pathname);
      const isPortfolioOrAll = isHomePage || window.location.pathname.endsWith('/portfolio') || window.location.pathname.endsWith('/all');

      if (!large || isPortfolioOrAll) {
        setIsPresentationMode(false);
      } else if (savedMode === "true" || hasBodyClass) {
        setIsPresentationMode(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [mounted]);

  const togglePresentationMode = () => {
    const isHomePage = !pathname || pathname === '/' || /^\/[a-z]{2}$/.test(pathname) || /^\/[a-z]{2}\/$/.test(pathname);
    const isPortfolioOrAll = isHomePage || pathname?.endsWith('/portfolio') || pathname?.endsWith('/all');
    if (!isLargeScreen || isPortfolioOrAll) return; // Disable toggling on small screens, home, or portfolio/all

    setIsPresentationMode((prev) => {
      const next = !prev;
      localStorage.setItem("presentation_mode", String(next));
      return next;
    });
  };

  const cycleSlideNumberFormat = () => {
    setSlideNumberFormat((prev) => {
      let next: SlideNumberFormat;
      if (prev === 'decimal') next = 'hex';
      else if (prev === 'hex') next = 'binary';
      else next = 'decimal';
      
      localStorage.setItem("presentation_slide_format", next);
      return next;
    });
  };

  useEffect(() => {
    if (isPresentationMode) {
      document.body.classList.add('presentation-mode');
      
      // Inject landscape orientation style for printing
      const styleId = 'presentation-print-style';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = '@media print { @page { size: landscape; } }';
        document.head.appendChild(style);
      }
      
      const handleWheel = (e: WheelEvent) => {
        const target = e.target as HTMLElement;
        const main = document.querySelector('main');
        if (!main) return;

        // If the wheel event is outside the main content area (e.g., navbar, header),
        // let it behave normally so vertical scrolling works if needed.
        if (!main.contains(target)) return;

        // If we are over a vertically scrollable element inside main, 
        // prioritize its internal scroll unless it's already at the boundaries.
        let current: HTMLElement | null = target;
        while (current && current !== main) {
          // A quick heuristic instead of getComputedStyle to avoid layout thrashing
          const hasScroll = current.scrollHeight > current.clientHeight;
          if (hasScroll && (current.style.overflowY === 'auto' || current.style.overflowY === 'scroll' || current.classList.contains('overflow-y-auto') || current.classList.contains('overflow-y-scroll'))) {
              const isAtTop = current.scrollTop <= 0;
              const isAtBottom = Math.abs(current.scrollHeight - current.clientHeight - current.scrollTop) < 1;
              
              if (e.deltaY < 0 && !isAtTop) return; // Scrolling up and not at top
              if (e.deltaY > 0 && !isAtBottom) return; // Scrolling down and not at bottom
          }
          current = current.parentElement;
        }

        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          main.scrollLeft += e.deltaY;
          e.preventDefault();
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        const main = document.querySelector('main');
        if (!main) return;

        // Ctrl + P: Browser Print
        if (e.ctrlKey && !e.altKey && e.key.toLowerCase() === 'p') {
          e.preventDefault();
          window.print();
          return;
        }

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
          main.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
          e.preventDefault();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          main.scrollBy({ left: -window.innerWidth, behavior: 'smooth' });
          e.preventDefault();
        }
      };

      window.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.classList.remove('presentation-mode');
      const styleId = 'presentation-print-style';
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
      return undefined;
    }
  }, [isPresentationMode]);

  const contextValue = React.useMemo(() => ({
    isPresentationMode,
    togglePresentationMode,
    slideNumberFormat,
    cycleSlideNumberFormat
  }), [isPresentationMode, slideNumberFormat]);

  return (
    <PresentationContext.Provider value={contextValue}>
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation() {
  const context = useContext(PresentationContext);
  if (context === undefined) {
    throw new Error("usePresentation must be used within a PresentationProvider");
  }
  return context;
}
