"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type ScrollMode = 'vertical' | 'horizontal';

interface ScrollContextType {
  scrollMode: ScrollMode;
  isPaginated: boolean;
  setScrollMode: (mode: ScrollMode) => void;
  setIsPaginated: (isPaginated: boolean) => void;
  toggleScrollMode: () => void;
  togglePagination: () => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [scrollMode, setScrollMode] = useState<ScrollMode>('vertical');
  const [isPaginated, setIsPaginated] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('scrollMode') as ScrollMode;
    const savedPaginated = localStorage.getItem('isPaginated') === 'true';
    if (savedMode) setScrollMode(savedMode);
    if (savedPaginated) setIsPaginated(savedPaginated);
  }, []);

  useEffect(() => {
    localStorage.setItem('scrollMode', scrollMode);
    localStorage.setItem('isPaginated', isPaginated.toString());

    // Apply classes to body or html for global styling
    if (scrollMode === 'horizontal') {
      document.documentElement.classList.add('horizontal-mode');
    } else {
      document.documentElement.classList.remove('horizontal-mode');
    }

    if (isPaginated) {
      document.documentElement.classList.add('paginated-mode');
    } else {
      document.documentElement.classList.remove('paginated-mode');
    }
  }, [scrollMode, isPaginated]);

  const toggleScrollMode = () => {
    setScrollMode(prev => prev === 'vertical' ? 'horizontal' : 'vertical');
  };

  const togglePagination = () => {
    setIsPaginated(prev => !prev);
  };

  return (
    <ScrollContext.Provider value={{ 
      scrollMode, 
      isPaginated, 
      setScrollMode, 
      setIsPaginated, 
      toggleScrollMode, 
      togglePagination 
    }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
}
