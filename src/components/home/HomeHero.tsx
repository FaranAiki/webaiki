"use client";

import React, { useState } from 'react';
import CyclingWord from './CyclingWord';
import TrackingIconWrapper from './TrackingIconWrapper';
import type { TrackerType } from "@/components/interactive/TrackingIcon";

interface HomeHeroProps {
  dict: import('@/components/layout/Translator').TranslationDict;
  parts: string[];
}

export default function HomeHero({ dict, parts }: HomeHeroProps) {
  const [trackerType, setTrackerType] = useState<TrackerType>('see');

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="relative flex-1 z-1 text-center lg:text-left xs:pt-12 md:pt-6 lg:pt-0">
        <h2 id="tutorial-hero-target" className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-black dark:text-white">
          <span className="inline-block whitespace-pre-wrap nav-active-gacor">{parts[0]}</span>
          <CyclingWord dict={dict} onTypeChange={setTrackerType} />
          <span className="inline-block whitespace-pre-wrap nav-active-gacor">{parts[1]}</span>
        </h2>
      </div>
      <div className="hidden md:flex flex-shrink-0 relative md:w-64 md:h-64 items-center justify-center">
        <TrackingIconWrapper currentType={trackerType} />
      </div>
    </div>
  );
}
