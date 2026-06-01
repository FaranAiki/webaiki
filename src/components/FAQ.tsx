"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

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

  return (
    <div id={id} className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="relative group mb-10 pb-4 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-2 text-cyan-500">
            <HelpCircle size={28} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
            {title}
          </h2>
        </div>
        <div className="absolute bottom-0 left-0 h-0.5 w-24 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className={`group relative rounded-3xl overflow-hidden transition-all duration-500 ${
                isOpen 
                ? 'bg-white dark:bg-white/5 shadow-2xl shadow-cyan-500/10' 
                : 'hover:bg-white/50 dark:hover:bg-white/5'
              }`}
            >
              {/* Active Border Gradient */}
              <div className={`absolute inset-0 p-[1.5px] rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-10'}`} />
              
              <div className="relative h-full rounded-[23px] bg-gray-50 dark:bg-black/40 transition-colors duration-500">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left transition-all"
                  aria-expanded={isOpen}
                >
                  <div className="flex gap-4 items-center">
                    <span className={`hidden md:flex items-center justify-center w-8 h-8 rounded-full text-xs font-black transition-all duration-500 ${
                      isOpen 
                      ? 'bg-cyan-500 text-white rotate-[360deg]' 
                      : 'bg-black/5 dark:bg-white/10 text-gray-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-500'
                    }`}>
                      {index + 1}
                    </span>
                    <span className={`font-bold text-base md:text-lg tracking-tight transition-all duration-500 ${
                      isOpen 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600' 
                      : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {item.question}
                    </span>
                  </div>
                  <div className={`p-2 rounded-xl transition-all duration-500 ${
                    isOpen ? 'bg-cyan-500 text-white rotate-180 scale-110' : 'bg-black/5 dark:bg-white/10 text-gray-400'
                  }`}>
                    <ChevronDown size={20} strokeWidth={3} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="px-6 md:px-8 pb-8 md:pb-10 pt-2">
                        <div className="p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-sm">
                          <p className="text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-400 font-medium opacity-90">
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
