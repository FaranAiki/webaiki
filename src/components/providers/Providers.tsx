"use client";

import { ThemeProvider } from "next-themes";
import React, { createContext, useContext, useState, useEffect } from "react";
import { PresentationProvider } from "./PresentationContext";
import { SettingsProvider } from "./SettingsContext";
import QueryProvider from "./QueryProvider";
import SmoothScroll from "./SmoothScroll";
import LoadingOverlay from "../layout/LoadingOverlay";
import { usePathname, useSearchParams } from "next/navigation";
import { useAppStore } from "@/lib/store";

interface ProvidersContextType {
  setLoadingLabel: (label: string) => void;
}

const ProvidersContext = createContext<ProvidersContextType | undefined>(undefined);

export function useProvidersConfig() {
  return useContext(ProvidersContext);
}

/**
 * Handles resetting global loading state on route changes
 */
function GlobalLoadingReset() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setGlobalLoading = useAppStore((state) => state.setGlobalLoading);

  useEffect(() => {
    // Small delay to ensure the new page content has started rendering
    const timer = setTimeout(() => {
      setGlobalLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [pathname, searchParams, setGlobalLoading]);

  return null;
}

/**
 * A stable outer provider that ensures hook execution order remains constant.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [loadingLabel, setLoadingLabel] = useState<string | undefined>(undefined);

  return (
    <ProvidersContext.Provider value={{ setLoadingLabel }}>
      <SettingsProvider>
        <PresentationProvider>
          <QueryProvider>
            <SmoothScroll>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <GlobalLoadingReset />
                <LoadingOverlay label={loadingLabel} />
                {children}
              </ThemeProvider>
            </SmoothScroll>
          </QueryProvider>
        </PresentationProvider>
      </SettingsProvider>
    </ProvidersContext.Provider>
  );
}

/**
 * Helper component for nested layouts to inject localized labels 
 * without re-rendering the provider tree.
 */
export function ProvidersConfigurator({ 
  loadingLabel
}: { 
  loadingLabel?: string; 
}) {
  const config = useProvidersConfig();
  
  useEffect(() => {
    if (config && loadingLabel) config.setLoadingLabel(loadingLabel);
  }, [loadingLabel, config]);

  return null;
}
