"use client";

// This is used in the Header.tsx

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { setCookies } from "@/app/actions";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8" />; 
  }

  const handleThemeChange = (newTheme: string) => {
    if (typeof document === 'undefined') return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = document as any;

    // Check if View Transitions API is supported
    if ('startViewTransition' in doc) {
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

  const isDark = resolvedTheme === 'dark';
  
  // Desktop
  const desktopContainerClass = isDark 
    ? "bg-gray-800 border-gray-700" 
    : "bg-white border-gray-300 shadow-sm";

  // Icon for the single button mode
  const CurrentIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <>
      {/* Mobile/Tablet (md only): Single Click-Click Button */}
      {/* Visible up to lg breakpoint (so that it is visible on md) */}
      <button
        onClick={cycleTheme}
        className={`hidden md:block lg:hidden p-2 rounded-full transition-[transform,colors] duration-300 border ${
          isDark 
            ? "bg-gray-800 border-gray-700 text-yellow-400 hover:bg-gray-700" 
            : "bg-white border-gray-300 text-orange-500 hover:bg-gray-100 shadow-sm"
        }`}
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
              ? "bg-gray-100 text-blue-500 shadow-sm ring-1 ring-gray-200"
              : "text-gray-400 hover:text-gray-600"
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
              ? "bg-gray-100 text-orange-500 shadow-sm ring-1 ring-gray-200"
              : "text-gray-400 hover:text-gray-600"
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
              ? "bg-gray-700 text-yellow-400 shadow-sm ring-1 ring-gray-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
          aria-label="Switch to dark theme"
        >
          <Moon size={16} />
        </button>
      </div>
    </>
  );
}
