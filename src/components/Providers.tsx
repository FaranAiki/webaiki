"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { PresentationProvider } from "./PresentationContext";
import { SettingsProvider } from "./SettingsContext";
import SultanPrint from "./SultanPrint";

interface ProvidersProps {
  children: React.ReactNode;
  sultanLabels?: {
    Creating: string;
    Ready: string;
    Failed: string;
    Description: string;
    Download: string;
    Estimating: string;
    Dismiss: string;
    Cancel: string;
  };
}

export function Providers({ children, sultanLabels }: ProvidersProps) {
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
          <SultanPrint labels={sultanLabels} />
        </ThemeProvider>
      </PresentationProvider>
    </SettingsProvider>
  );
}
