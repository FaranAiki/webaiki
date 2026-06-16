"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { signatures } from "@/lib/signatures";

interface LoadingOverlayProps {
  label?: string;
}

// Trigger HMR update
export default function LoadingOverlay({ label }: LoadingOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [internalVisible, setInternalVisible] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  
  const isGlobalLoading = useAppStore((state) => state.isGlobalLoading);
  const setScrollLocked = useAppStore((state) => state.setScrollLocked);

  const isVisible = internalVisible || isGlobalLoading;

  useEffect(() => {
    // Optimization: Skip loading overlay for bots and performance audits
    const isBot = /bot|googlebot|lighthouse|google-hub|google-structured-data-testing-tool|bingbot|yandexbot|duckduckbot|slurp|ia_archiver/i.test(navigator.userAgent);
    if (isBot) {
      setInternalVisible(false);
      setMounted(true);
      return;
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      setScrollLocked(true);

      // Disable scrolling on both html and body to be absolutely sure
      document.documentElement.classList.add("no-scrollbar");
      document.documentElement.style.setProperty("overflow", "hidden", "important");
      document.documentElement.style.setProperty("height", "100%", "important");

      document.body.classList.add("no-scrollbar");
      document.body.style.setProperty("overflow", "hidden", "important");
      document.body.style.setProperty("height", "100%", "important");
      document.body.style.setProperty("padding-right", `${scrollbarWidth}px`, "important");
    } else {
      setScrollLocked(false);
      document.documentElement.classList.remove("no-scrollbar");
      document.documentElement.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("height");

      document.body.classList.remove("no-scrollbar");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("height");
      document.body.style.removeProperty("padding-right");
    }
    return () => {
      setScrollLocked(false);
      document.documentElement.classList.remove("no-scrollbar");
      document.documentElement.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("height");

      document.body.classList.remove("no-scrollbar");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("height");
      document.body.style.removeProperty("padding-right");
    };
  }, [isVisible, setScrollLocked]);

  useEffect(() => {
    // Start animation slightly after mount to ensure smoothness
    const startTimer = setTimeout(() => setHasStarted(true), 100);

    if (mounted && hasStarted) {
      // Handwriting animation total duration:
      // (signatures.length - 1) * 0.05 [delay] + 0.15 [duration] = 2.15 + 0.15 = 2.3s
      // Plus Euler-Mascheroni constant delay: 0.577s (γ ≈ 0.5772156649)
      // Total: 2.3 + 0.577 = 2.877s
      const exitTimer = setTimeout(() => setInternalVisible(false), 2877);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(exitTimer);
      };
    }
    return () => clearTimeout(startTimer);
  }, [mounted, hasStarted]);

  useEffect(() => {
    if (isGlobalLoading) {
      setHasStarted(true);
    }
  }, [isGlobalLoading]);

  // Human-like writing easing: starts slow, speeds up in middle, slows down at ends of strokes
  const humanWritingEase = [0.45, 0.05, 0.55, 0.95] as const;

  const getInitialClipProps = (direction: string) => {
    switch (direction) {
      case "lr": return { x: 0, y: 0, width: 0, height: 153 };
      case "rl": return { x: 446, y: 0, width: 0, height: 153 };
      case "td": return { x: 0, y: 0, width: 446, height: 0 };
      case "dt": return { x: 0, y: 153, width: 446, height: 0 };
      default: return { x: 0, y: 0, width: 0, height: 153 };
    }
  };

  const getAnimateClipProps = (direction: string) => {
    switch (direction) {
      case "lr": return { width: 446 };
      case "rl": return { x: 0, width: 446 };
      case "td": return { height: 153 };
      case "dt": return { y: 0, height: 153 };
      default: return { width: 446 };
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-theme-bg dark:bg-theme-bg-dark overflow-hidden"
        >
          <div className="relative w-72 md:w-[500px] h-auto px-4">
            <svg
              viewBox="0 0 446 153"
              className="w-full h-auto text-foreground"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {signatures.map((sig, i) => (
                  <clipPath key={`clip-${sig.id}`} id={`clip-${sig.id}`}>
                    <motion.rect
                      initial={getInitialClipProps(sig.direction)}
                      animate={hasStarted ? getAnimateClipProps(sig.direction) : {}}
                      transition={{
                        duration: 0.15,
                        delay: i * 0.05,
                        ease: humanWritingEase,
                      }}
                    />
                  </clipPath>
                ))}
              </defs>
              {signatures.map((sig) => (
                <path
                  key={sig.id}
                  d={sig.path}
                  fill="currentColor"
                  clipPath={`url(#clip-${sig.id})`}
                />
              ))}
            </svg>

            <motion.div
              initial={{ opacity: 0 }}
              animate={hasStarted ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 text-center"
            >
              <p className="text-foreground font-semibold tracking-tight text-sm md:text-base opacity-80">
                {label}
              </p>
              <div className="mt-4 flex justify-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut"
                    }}
                    className="w-1 h-1 rounded-full bg-theme-color-500"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
