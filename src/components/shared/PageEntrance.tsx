"use client";

import React from 'react';
import { motion } from 'framer-motion';

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98] // Smooth "out-quint" like ease
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
