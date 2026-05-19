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
    const initialMode = saved === "true";
    
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
        // Find the main element which has the horizontal scroll
        const main = document.querySelector('main');
        if (main) {
          // If the user scrolls vertically (deltaY), we scroll the main element horizontally (scrollLeft)
          // We use a multiplier for smoother/faster scrolling
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            main.scrollLeft += e.deltaY;
            e.preventDefault();
          }
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        const main = document.querySelector('main');
        if (!main) return;

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
