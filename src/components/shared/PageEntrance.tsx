"use client";

import React from 'react';

interface PageEntranceProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * A lightweight entrance animation component for pages.
 * Uses GPU-accelerated properties (opacity and transform) for maximum performance.
 */
export default function PageEntrance({ 
  children, 
  className = "", 
  delay = 0 
}: PageEntranceProps) {
  // Using native CSS animation for better LCP (Largest Contentful Paint) performance.
  // Framer Motion delays rendering until hydration, which causes a large "Element render delay" penalty in Lighthouse.
  const style = delay > 0 ? { animationDelay: `${delay}s`, opacity: 0 } : undefined;
  
  return (
    <div
      className={`animate-page-entrance ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
