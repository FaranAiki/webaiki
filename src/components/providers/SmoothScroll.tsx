"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { useAppStore } from "@/lib/store";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const isScrollLocked = useAppStore((state) => state.isScrollLocked);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Handle anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && anchor.hash && anchor.origin === window.location.origin) {
        const targetElement = document.querySelector(anchor.hash);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
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
