"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { m as motion, AnimatePresence } from 'framer-motion';
import type { TrackerType } from "@/components/interactive/TrackingIcon";

const TrackingIcon = dynamic(() => import("@/components/interactive/TrackingIcon"), { ssr: false });

export default function TrackingIconWrapper({ currentType }: { currentType: TrackerType }) {
  const [isMdScreen, setIsMdScreen] = useState(false);

  useEffect(() => {
    setIsMdScreen(window.innerWidth >= 768);
    const handleResize = () => setIsMdScreen(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMdScreen) return null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={currentType}
        initial={{ opacity: 0, scale: 0.8, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.1, y: -15 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="absolute"
      >
        <TrackingIcon type={currentType} />
      </motion.div>
    </AnimatePresence>
  );
}
