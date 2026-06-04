"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useSettings } from '../providers/SettingsContext';

interface FaqItem {
  question: string;
  answer: string;
}

interface FAQProps {
  id?: string;
  title: string;
  items: FaqItem[];
  className?: string;
}

export default function FAQ({ id, title, items, className = "" }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { isExpandAll, isAtsMode } = useSettings();

  if (isAtsMode) return null;

  return (
    <div id={id} className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="relative group mb-10 pb-4 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-2 text-theme-500">
            <HelpCircle size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[var(--gacor-1)] via-[var(--gacor-2)] to-[var(--gacor-3)]">
            {title}
          </h2>
        </div>
        <div className="absolute bottom-0 left-0 h-0.5 w-24 bg-gradient-to-r from-[var(--gacor-1)] via-[var(--gacor-2)] to-[var(--gacor-3)] rounded-full" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item, index) => {
          const isItemOpen = openIndex === index || isExpandAll;
          return (
            <div 
              key={index}
              className={`group relative rounded-3xl overflow-hidden transition-all duration-500 ${
                isItemOpen 
                ? 'bg-theme-surface/75 shadow-[0_10px_40px_-10px_var(--accent-shadow)]' 
                : 'bg-theme-surface/50 hover:bg-theme-surface/80'
              }`}
            >
              {/* Subtle Border */}
              <div className={`absolute inset-0 p-[1.5px] rounded-3xl bg-gradient-to-br from-[var(--gacor-1)] via-[var(--gacor-2)] to-[var(--gacor-3)] transition-opacity duration-500 ${isItemOpen ? 'opacity-100' : 'opacity-10'}`} />
              
              <div className="relative h-full rounded-[23px] bg-theme-surface/75 transition-colors duration-500">
                <button
                  onClick={() => setOpenIndex(isItemOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left transition-all"
                  aria-expanded={isItemOpen}
                >
                  <div className="flex gap-4 items-center">
                    <span className={`hidden md:flex items-center justify-center w-8 h-8 rounded-full text-xs font-black transition-all duration-500 ${
                      isItemOpen 
                      ? 'bg-theme-500 text-white rotate-[360deg]' 
                      : 'bg-theme-surface-strong text-theme-muted group-hover:bg-theme-500/10 group-hover:text-theme-500'
                    }`}>
                      {index + 1}
                    </span>
                    <span className={`font-bold text-base md:text-lg tracking-tight transition-all duration-500 ${
                      isItemOpen 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-[var(--gacor-1)] via-[var(--gacor-2)] to-[var(--gacor-3)]' 
                      : 'text-foreground'
                    }`}>
                      {item.question}
                    </span>
                  </div>
                  <div className={`transition-all duration-500 ${
                    isItemOpen ? 'text-theme-500 rotate-180 scale-110' : 'text-theme-muted'
                  }`}>
                    <ChevronDown size={24} strokeWidth={2.5} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isItemOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="px-6 md:px-8 pb-8 md:pb-10 pt-2">
                        <div className="p-6 rounded-2xl bg-theme-surface-strong/75 border border-theme-border">
                          <p className="text-base md:text-lg leading-relaxed text-foreground font-medium opacity-100">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
