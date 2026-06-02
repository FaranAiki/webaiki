"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { PresentationProvider, SlideNumberFormat } from "./PresentationContext";
import { SettingsProvider } from "./SettingsContext";
import SultanPrint from "./SultanPrint";

interface ProvidersProps {
  children: React.ReactNode;
  initialIsPresentationMode?: boolean;
  initialSlideNumberFormat?: SlideNumberFormat;
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

import QueryProvider from "./QueryProvider";
import SmoothScroll from "./SmoothScroll";

export function Providers({ 
  children, 
  sultanLabels,
  initialIsPresentationMode,
  initialSlideNumberFormat
}: ProvidersProps) {
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
        <PresentationProvider 
          initialIsPresentationMode={initialIsPresentationMode}
          initialSlideNumberFormat={initialSlideNumberFormat}
        >
          <QueryProvider>
            {children}
          </QueryProvider>
        </PresentationProvider>
      </SettingsProvider>
    );
  }

  return (
    <SettingsProvider>
      <PresentationProvider
        initialIsPresentationMode={initialIsPresentationMode}
        initialSlideNumberFormat={initialSlideNumberFormat}
      >
        <QueryProvider>
          <SmoothScroll>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <SultanPrint labels={sultanLabels} />
            </ThemeProvider>
          </SmoothScroll>
        </QueryProvider>
      </PresentationProvider>
    </SettingsProvider>
  );
}
