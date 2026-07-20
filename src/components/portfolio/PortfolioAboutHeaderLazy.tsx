"use client";

import dynamic from "next/dynamic";
import type { AboutMeProps } from "./AboutMe";

// Defer the heavy below-the-fold AboutMe (framer-motion + Image + intervals)
// from the initial hydration window. The LCP element on "/" is the hero
// text above, so skipping SSR here does not hurt LCP, while removing a
// large client subtree from the critical main-thread work (TBT).
// A layout-matching skeleton reserves space to avoid layout shift (CLS).
const PortfolioAboutHeader = dynamic(
  () => import("./AboutMe").then((mod) => mod.PortfolioAboutHeader),
  {
    ssr: false,
    loading: () => <AboutSkeleton />,
  }
);

function AboutSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6 animate-pulse">
      <div className="lg:col-span-4 flex justify-center lg:justify-start">
        <div className="w-48 h-48 md:w-64 md:h-64 lg:w-full lg:aspect-square rounded-3xl bg-theme-surface-strong/60" />
      </div>
      <div className="lg:col-span-8 space-y-6">
        <div className="h-10 w-2/3 rounded-lg bg-theme-surface-strong/60" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-theme-surface-strong/40" />
          <div className="h-4 w-11/12 rounded bg-theme-surface-strong/40" />
          <div className="h-4 w-5/6 rounded bg-theme-surface-strong/40" />
        </div>
        <div className="h-32 w-full rounded-xl bg-theme-surface-strong/50" />
        <div className="space-y-3">
          <div className="h-4 w-10/12 rounded bg-theme-surface-strong/40" />
          <div className="h-4 w-9/12 rounded bg-theme-surface-strong/40" />
        </div>
      </div>
    </div>
  );
}

export default function PortfolioAboutHeaderLazy(props: AboutMeProps) {
  return <PortfolioAboutHeader {...props} />;
}
