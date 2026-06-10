"use client";

import { ThemeProvider } from "next-themes";
import React from "react";
import { PresentationProvider, SlideNumberFormat } from "./PresentationContext";
import { SettingsProvider } from "./SettingsContext";
import SultanPrint from "../interactive/SultanPrint";

interface ProvidersProps {
  children: React.ReactNode;
  initialIsPresentationMode?: boolean;
  initialSlideNumberFormat?: SlideNumberFormat;
  loadingLabel?: string;
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
import LoadingOverlay from "../layout/LoadingOverlay";

export function Providers({ 
  children, 
  sultanLabels,
  loadingLabel,
  initialIsPresentationMode,
  initialSlideNumberFormat
}: ProvidersProps) {
  return (
    <SettingsProvider>
      <PresentationProvider
        initialIsPresentationMode={initialIsPresentationMode}
        initialSlideNumberFormat={initialSlideNumberFormat}
      >
        <QueryProvider>
          <SmoothScroll>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <LoadingOverlay label={loadingLabel} />
              {children}
              <SultanPrint labels={sultanLabels} />
            </ThemeProvider>
          </SmoothScroll>
        </QueryProvider>
      </PresentationProvider>
    </SettingsProvider>
  );
}
