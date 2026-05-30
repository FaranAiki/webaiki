"use client";

import { motion } from 'framer-motion';

interface PopRotateSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function PopRotateSection({ children, delay = 0, className = "" }: PopRotateSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75, rotate: 6, y: 48, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ 
        duration: 0.7, 
        delay: delay / 1000,
        ease: [0.34, 1.56, 0.64, 1] // bouncy ease
      }}
      className={`relative transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );
}
