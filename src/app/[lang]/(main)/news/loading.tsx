"use client";

import React from 'react';
import { Newspaper } from 'lucide-react';

export default function NewsLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 pt-32 pb-16 min-h-[60vh] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        {/* News logo/icon with animated pulse */}
        <div className="p-4 rounded-3xl bg-theme-500/10 text-theme-500 shadow-sm border border-theme-500/20 animate-pulse">
          <Newspaper size={32} />
        </div>
        
        {/* Loading spinner */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-theme-muted/20" />
          <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-t-4 border-theme-500 animate-spin" />
        </div>

        {/* Loading text with proper Title Case */}
        <p className="text-theme-muted font-bold tracking-wider text-sm animate-pulse">
          Loading Latest News...
        </p>
      </div>
    </div>
  );
}
