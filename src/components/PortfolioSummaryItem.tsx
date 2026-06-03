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
      className="group cursor-pointer transition-all duration-300 border-l-2 border-transparent hover:border-theme-500 pl-3 -ml-3 py-1"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex justify-between items-center gap-2">
        <h3 className="font-bold text-base text-foreground group-hover:text-theme-500 transition-colors leading-tight">
          {title}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:bg-theme-500/10 rounded-md transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={14} className="text-theme-muted" />
              </a>
            )}
            <div className="text-theme-muted">
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 text-[10px] md:text-xs font-medium tracking-wider">
        <span className="text-theme-500">{company}</span>
        <span className="text-[var(--text-muted)] flex items-center gap-1">
           <Calendar size={10} />
           {date}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && brief && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-1.5 pb-1">
                <HoverableWords className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed">
                  {brief}
                </HoverableWords>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
