"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const lenisRef = useRef<import("lenis").default | null>(null);
  const isScrollLocked = useAppStore((state) => state.isScrollLocked);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let cancelled = false;
    let lenis: import("lenis").default | null = null;
    // Defer the Lenis bundle so it is not part of the initial JS chunk (keeps SSR + first paint light)
    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        lerp: 0.1, // Replaced heavy duration/easing math with lightweight linear interpolation
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.15,
        // Fix for mobile and desktop lag: let native touch handle scroll, or sync it correctly.
        syncTouch: false,
        touchMultiplier: 1,
        autoRaf: true, // Let Lenis handle RAF natively (v1.1+)
      });
      lenisRef.current = lenis;
    });

    // Handle anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && anchor.hash && anchor.origin === window.location.origin) {
        const targetElement = document.querySelector(anchor.hash);
        if (targetElement) {
          e.preventDefault();
          lenisRef.current?.scrollTo(targetElement as HTMLElement);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelled = true;
      lenisRef.current?.destroy();
      lenisRef.current = null;
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [mounted]);

  useEffect(() => {
    if (!lenisRef.current) return;
    
    if (isScrollLocked) {
      lenisRef.current.stop();
      document.documentElement.classList.add('overflow-hidden');
    } else {
      lenisRef.current.start();
      document.documentElement.classList.remove('overflow-hidden');
    }
  }, [isScrollLocked]);

  return <>{children}</>;
}
