"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { TranslationDict } from "@/components/layout/Translator";

// Dynamically import the heavy terminal content only when needed.
// ssr: false ensures it is never included in the initial HTML.
const TerminalContent = dynamic(() => import("./TerminalContent"), { ssr: false });

interface TerminalPageRoute {
  slug: string;
  label: string;
}

interface TerminalOverlayProps {
  lang: string;
  dict: TranslationDict;
  username: string | null;
  pageRoutes: TerminalPageRoute[];
}

export default function TerminalOverlay(props: TerminalOverlayProps) {
  const [hasRequested, setHasRequested] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Global listener to open/close the terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on backtick key (`) or Ctrl + \
      if (
        (e.key === '`' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) ||
        (e.ctrlKey && e.key === '\\')
      ) {
        e.preventDefault();
        setHasRequested(true);
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Only render the heavy chunk if the user has requested it at least once in this session.
  if (!hasRequested) return null;

  return <TerminalContent {...props} isOpen={isOpen} setIsOpen={setIsOpen} />;
}
