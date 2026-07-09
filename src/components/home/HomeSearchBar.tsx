"use client";

import React from 'react';
import FadeInSection from "@/components/shared/FadeInSection";

interface HomeSearchBarProps {
  dict: import('@/components/layout/Translator').TranslationDict;
}

export default function HomeSearchBar({ dict }: HomeSearchBarProps) {
  return (
    <FadeInSection initialVisible={true}>
      <section className="w-full no-print mt-4 md:mt-8 flex justify-center" aria-labelledby="search-heading">
        <h2 id="search-heading" className="sr-only">{dict.Search_About_Faran || "Search Faran Aiki Content"}</h2>
        <button
          type="button"
          onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="group relative flex w-full max-w-2xl items-center gap-3 rounded-full border border-theme-border bg-theme-surface-strong/50 px-6 py-4 text-left shadow-sm transition-all hover:border-theme-500 hover:bg-theme-surface hover:shadow-theme-shadow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-theme-muted group-hover:text-theme-500 transition-colors">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <span className="flex-1 text-[var(--text-muted)] text-sm font-medium tracking-wide">
            {dict.Command_Palette_Search_Placeholder || "Type a command or search portfolio..."}
          </span>
          <kbd className="hidden md:inline-flex h-6 items-center gap-1 font-mono text-[11px] font-black nav-active-gacor opacity-100 transition-colors tracking-widest">
            Ctrl + K
          </kbd>
        </button>
      </section>
    </FadeInSection>
  );
}
