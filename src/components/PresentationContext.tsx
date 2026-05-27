"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface PresentationContextType {
  isPresentationMode: boolean;
  togglePresentationMode: () => void;
}

const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

export function PresentationProvider({ children }: { children: React.ReactNode }) {
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  // Load state from localStorage on mount and handle resizing
  useEffect(() => {
    const saved = localStorage.getItem("presentation_mode");
    if (saved === "true") {
      setIsPresentationMode(true);
    }
    
    const checkScreenSize = () => {
      const large = window.innerWidth >= 768; // md breakpoint
      setIsLargeScreen(large);
      
      if (!large) {
        setIsPresentationMode(false);
      } else if (saved === "true") {
        setIsPresentationMode(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const togglePresentationMode = () => {
    if (!isLargeScreen) return; // Disable toggling on small screens

    setIsPresentationMode((prev) => {
      const next = !prev;
      localStorage.setItem("presentation_mode", String(next));
      return next;
    });
  };

  useEffect(() => {
    if (isPresentationMode) {
      document.body.classList.add('presentation-mode');
      
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
          if (current.scrollHeight > current.clientHeight) {
            const style = window.getComputedStyle(current);
            if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
              const isAtTop = current.scrollTop <= 0;
              const isAtBottom = Math.abs(current.scrollHeight - current.clientHeight - current.scrollTop) < 1;
              
              if (e.deltaY < 0 && !isAtTop) return; // Scrolling up and not at top
              if (e.deltaY > 0 && !isAtBottom) return; // Scrolling down and not at bottom
            }
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

        // Modern approach: Using the native browser print functionality.
        // This is much more robust than library snapshots because it uses the 
        // browser's native PDF rendering engine, preserving true text and layout.
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'p') {
          e.preventDefault();
          
          // Trigger the browser's native print dialog.
          // In presentation mode, @media print CSS rules (in globals.css) will
          // handle background rendering, page breaks, and hiding UI elements.
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
    }
  }, [isPresentationMode]);

  return (
    <PresentationContext.Provider value={{ isPresentationMode, togglePresentationMode }}>
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
