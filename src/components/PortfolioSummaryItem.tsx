"use client";

import React, { useState } from 'react';
import { Calendar, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import HoverableWords from './HoverableWords';
import { motion, AnimatePresence } from 'framer-motion';

interface PortfolioSummaryItemProps {
  title: string;
  company: string;
  date: string;
  description: string;
  url?: string;
}

export default function PortfolioSummaryItem({ 
  title, 
  company, 
  date, 
  description, 
  url 
}: PortfolioSummaryItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getBrief = (text: string) => {
    if (!text) return "";
    const firstSentence = text.split('.')[0];
    return firstSentence ? firstSentence.trim() + "." : "";
  };

  const brief = getBrief(description);

  return (
    <div 
      className="group space-y-1 cursor-pointer transition-all duration-300"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-foreground group-hover:text-theme-500 transition-colors leading-tight">
              {title}
            </h3>
            {url && (
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={14} className="text-theme-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}
        </div>
        <div className="text-theme-muted pt-1">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium">
        <span className="text-theme-500">{company}</span>
        <span className="text-[var(--text-muted)] flex items-center gap-1">
           <Calendar size={12} />
           {date}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && brief && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-2">
                <HoverableWords className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {brief}
                </HoverableWords>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
