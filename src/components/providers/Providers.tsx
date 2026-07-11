"use client";

import { ThemeProvider } from "next-themes";
import React, { createContext, useContext, useState, useEffect, Suspense } from "react";
import { PresentationProvider } from "./PresentationContext";
import { SettingsProvider } from "./SettingsContext";
import QueryProvider from "./QueryProvider";
import SmoothScroll from "./SmoothScroll";

import { usePathname, useSearchParams } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { LazyMotion } from "framer-motion";
const loadFeatures = () => import("framer-motion").then(res => res.domAnimation);
import UserBookmarkProvider from "./UserBookmarkProvider";

if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag while rendering React component")) {
      return;
    }
    originalError.apply(console, args);
  };
}

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
export function Providers({ children, nonce, isBot: _isBot }: { children: React.ReactNode; nonce?: string; isBot?: boolean }) {
  const [_loadingLabel, setLoadingLabel] = useState<string | undefined>(undefined);

  return (
    <ProvidersContext.Provider value={{ setLoadingLabel }}>
      <SettingsProvider>
        <PresentationProvider>
          <QueryProvider>
            <SmoothScroll>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem nonce={nonce}>
                <LazyMotion features={loadFeatures}>
                  <Suspense fallback={null}>
                    <GlobalLoadingReset />
                    <UserBookmarkProvider />
                  </Suspense>

                  {children}
                </LazyMotion>
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
