"use client";

// This is used in the Header.tsx

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8" />; 
  }

  const handleThemeChange = (newTheme: string) => {
    if (typeof document === 'undefined') return;

    // Proper type for View Transitions API
    const doc = document as Document & {
      startViewTransition?: (callback: () => Promise<void> | void) => {
        ready: Promise<void>;
        finished: Promise<void>;
        updateCallbackDone: Promise<void>;
        skipTransition: () => void;
      };
    };

    // Check if View Transitions API is supported
    if (doc.startViewTransition) {
      doc.startViewTransition(() => {
        setTheme(newTheme);
      });
    } else {
      // Fallback: use the helper class for smooth transition in non-supporting browsers
      doc.documentElement.classList.add('theme-transitioning');
      setTheme(newTheme);

      setTimeout(() => {
        doc.documentElement.classList.remove('theme-transitioning');
      }, 500);
    }
  };
  const cycleTheme = () => {
    if (theme === 'light') handleThemeChange('dark');
    else if (theme === 'dark') handleThemeChange('system');
    else handleThemeChange('light');
  };

  // Desktop
  const desktopContainerClass = "bg-theme-surface border-theme-border shadow-theme-shadow";

  // Icon for the single button mode
  const CurrentIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <>
      {/* Mobile/Tablet (md only): Single Click-Click Button */}
      {/* Visible up to lg breakpoint (so that it is visible on md) */}
      <button
        onClick={cycleTheme}
        className={`hidden md:block lg:hidden p-2 rounded-full transition-[transform,colors] duration-300 border bg-theme-surface border-theme-border shadow-theme-shadow text-theme-500 hover:bg-theme-surface-strong`}
        aria-label="Toggle Theme"
      >
        <CurrentIcon size={20} />
      </button>

      {/* Desktop (!md): Full Toggle Switch */}
      <div className={`block md:hidden lg:flex items-center space-x-2 rounded-full p-1 border ${desktopContainerClass} transition-colors duration-300`}>
        <button
          type="button"
          onClick={() => handleThemeChange("system")}
          className={`p-1.5 rounded-full transition-[colors,transform] duration-200 ${
            theme === "system"
              ? "bg-theme-surface-strong text-theme-500 shadow-sm ring-1 ring-theme-border"
              : "text-theme-muted hover:text-theme-600"
          }`}
          aria-label="Switch to system theme"
        >
          <Monitor size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleThemeChange("light")}
          className={`p-1.5 rounded-full transition-[colors,transform] duration-200 ${
            theme === "light"
              ? "bg-theme-surface-strong text-orange-500 shadow-sm ring-1 ring-theme-border"
              : "text-theme-muted hover:text-theme-600"
          }`}
          aria-label="Switch to light theme"
        >
          <Sun size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleThemeChange("dark")}
          className={`p-1.5 rounded-full transition-[colors,transform] duration-200 ${
            theme === "dark"
              ? "bg-theme-surface-strong text-yellow-400 shadow-sm ring-1 ring-theme-border"
              : "text-theme-muted hover:text-theme-600"
          }`}
          aria-label="Switch to dark theme"
        >
          <Moon size={16} />
        </button>
      </div>
    </>
  );
}
