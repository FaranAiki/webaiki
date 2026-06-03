"use client";

import { motion } from 'framer-motion';

interface GlitchSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function GlitchSection({ children, delay = 0, className = "" }: GlitchSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, skewX: 20, filter: 'grayscale(1) blur(5px)' }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        skewX: 0, 
        filter: 'grayscale(0) blur(0px)',
        transition: {
          duration: 0.4,
          delay: delay / 1000,
          ease: "easeOut",
          // Complex keyframes for glitch effect
          times: [0, 0.2, 0.4, 0.6, 0.8, 1]
        }
      }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      className={`relative transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );
}
