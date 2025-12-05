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
    setTheme(newTheme);
    setCookies("theme", newTheme);
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
      {/* Mobile/Tablet (md and below): Single Click-Click Button */}
      {/* Visible up to lg breakpoint (so that it is visible on md) */}
      <button
        onClick={cycleTheme}
        className={`lg:hidden p-2 rounded-full transition-all duration-300 border ${
          isDark 
            ? "bg-gray-800 border-gray-700 text-yellow-400 hover:bg-gray-700" 
            : "bg-white border-gray-300 text-orange-500 hover:bg-gray-100 shadow-sm"
        }`}
        aria-label="Toggle Theme"
      >
        <CurrentIcon size={20} />
      </button>

      {/* Desktop (lg and up): Full Toggle Switch */}
      <div className={`hidden lg:flex items-center space-x-2 rounded-full p-1 border ${desktopContainerClass} transition-colors duration-300`}>
        <button
          type="button"
          onClick={() => handleThemeChange("light")}
          className={`p-1.5 rounded-full transition-all duration-200 ${
            theme === "light"
              ? "bg-gray-100 text-orange-500 shadow-sm ring-1 ring-gray-200"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
          aria-label="Light Mode"
        >
          <Sun size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleThemeChange("system")}
          className={`p-1.5 rounded-full transition-all duration-200 ${
            theme === "system"
              ? "bg-gray-100 dark:bg-gray-700 text-blue-500 shadow-sm ring-1 ring-gray-200 dark:ring-gray-600"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
          aria-label="System Mode"
        >
          <Monitor size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleThemeChange("dark")}
          className={`p-1.5 rounded-full transition-all duration-200 ${
            theme === "dark"
              ? "bg-gray-700 text-yellow-400 shadow-sm ring-1 ring-gray-600"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
          aria-label="Dark Mode"
        >
          <Moon size={16} />
        </button>
      </div>
    </>
  );
}
