"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface PresentationContextType {
  isPresentationMode: boolean;
  togglePresentationMode: () => void;
}

const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

export function PresentationProvider({ children }: { children: React.ReactNode }) {
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("presentation_mode");
    if (saved === "true") {
      setIsPresentationMode(true);
    }
  }, []);

  const togglePresentationMode = () => {
    setIsPresentationMode((prev) => {
      const next = !prev;
      localStorage.setItem("presentation_mode", String(next));
      return next;
    });
  };

  useEffect(() => {
    if (isPresentationMode) {
      document.body.classList.add('presentation-mode');
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
