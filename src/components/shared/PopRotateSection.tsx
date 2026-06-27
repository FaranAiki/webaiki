"use client";

import React, { useState, useEffect } from 'react';
import { m as motion } from 'framer-motion';

interface PopRotateSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  initialVisible?: boolean;
}

export default function PopRotateSection({ children, delay = 0, className = "", initialVisible = false }: PopRotateSectionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (mounted && isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={initialVisible ? { opacity: 1, scale: 1, rotate: 0, y: 0, filter: 'blur(0px)' } : { opacity: 0, scale: 0.8, rotate: -5, y: 30, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ 
        type: "spring",
        damping: 12,
        stiffness: 100,
        delay: delay / 1000 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
