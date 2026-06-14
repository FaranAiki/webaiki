"use client";

import React, { useState } from 'react';
import { Calendar, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import HoverableWords from '../shared/HoverableWords';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../providers/SettingsContext';

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
  const { isExpandAll, isAtsMode } = useSettings();

  const getBrief = (text: string) => {
    if (!text) return "";
    const firstSentence = text.split('.')[0];
    return firstSentence ? firstSentence.trim() + "." : "";
  };

  const brief = getBrief(description);
  const showContent = isOpen || isExpandAll || isAtsMode;

  return (
    <div
      className={`group cursor-pointer transition-all duration-300 border-transparent hover:border-theme-500 pl-3 -ml-3 ${isAtsMode ? 'py-0' : 'py-1'} portfolio-summary-item`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={`flex flex-wrap items-center ${isAtsMode ? 'gap-x-1' : 'justify-between gap-2'} portfolio-item-header`}>
        <h3 className={`font-bold text-foreground group-hover:text-theme-500 transition-colors leading-tight portfolio-item-title ${isAtsMode ? 'text-xs' : 'text-base'}`}>
          {title}
        </h3>


        {isAtsMode && (
          <div className="flex items-center gap-x-2 text-[11px] font-medium tracking-tight portfolio-item-meta-ats">
            <span> | </span>
            <span className="text-theme-600 portfolio-item-company">{company}</span>
            <span> | </span>
            <span className="text-[var(--text-muted)] portfolio-item-date">{date}</span>
          </div>
        )}

        <div className="flex items-center gap-2 shrink-0 portfolio-item-actions">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:bg-theme-500/10 rounded-md transition-colors portfolio-item-link"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={14} className="text-theme-muted" />
              </a>
            )}
            <div className="text-theme-muted portfolio-item-chevron">
                {showContent ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
        </div>
      </div>

      {!isAtsMode && (
        <div className="flex flex-wrap items-center gap-x-3 text-sm md:text-xs font-medium tracking-wider portfolio-item-meta">
          <span className="text-theme-500 portfolio-item-company">{company}</span>
          <span className="text-[var(--text-muted)] flex items-center gap-1 portfolio-item-date">
            <Calendar size={10} />
            {date}
          </span>
        </div>
      )}


      <AnimatePresence initial={false}>
        {showContent && brief && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className={`${isAtsMode ? 'pt-0 pb-0' : 'pt-1.5 pb-1'}`}>
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
