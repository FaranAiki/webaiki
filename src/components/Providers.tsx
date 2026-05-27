"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { PresentationProvider } from "./PresentationContext";
import { SettingsProvider } from "./SettingsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Only render the provider after mounting to prevent hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return children as-is (or a loading state) during server-render/initial client render
    // to avoid markup mismatches.
    return (
      <SettingsProvider>
        <PresentationProvider>{children}</PresentationProvider>
      </SettingsProvider>
    );
  }

  return (
    <SettingsProvider>
      <PresentationProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </PresentationProvider>
    </SettingsProvider>
  );
}
