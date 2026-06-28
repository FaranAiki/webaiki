"use client";

import { m as motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { signatures } from "@/lib/signatures";

interface LoadingOverlayProps {
  label?: string;
  isBot?: boolean;
}

// Trigger HMR update
export default function LoadingOverlay({ label, isBot = false }: LoadingOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [internalVisible, setInternalVisible] = useState(!isBot);
  const [hasStarted, setHasStarted] = useState(false);
  
  const isGlobalLoading = useAppStore((state) => state.isGlobalLoading);
  const setScrollLocked = useAppStore((state) => state.setScrollLocked);

  const isVisible = internalVisible || isGlobalLoading;

  useEffect(() => {
    if (isBot) {
      setMounted(true);
      return;
    }

    setMounted(true);
  }, [isBot]);

  useEffect(() => {
    if (isVisible) {
      setScrollLocked(true);
    } else {
      setScrollLocked(false);
    }
    return () => {
      setScrollLocked(false);
    };
  }, [isVisible, setScrollLocked]);

  useEffect(() => {
    // Start animation slightly after mount to ensure smoothness
    const startTimer = setTimeout(() => setHasStarted(true), 100);

    if (mounted && hasStarted) {
      // Handwriting animation total duration:
      // (signatures.length - 1) * 0.025 [delay] + 0.1 [duration] = 1.075 + 0.1 = 1.175s
      // Plus Euler-Mascheroni constant delay: 0.577s (γ ≈ 0.5772156649)
      // Total: 1.175 + 0.577 = 1.752s
      const exitTimer = setTimeout(() => setInternalVisible(false), 1752);

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
          <div className="relative w-full max-w-72 md:max-w-[500px] h-auto px-4">
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
                        duration: 0.1,
                        delay: i * 0.025,
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
