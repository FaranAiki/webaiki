"use client";

import React, { useState } from 'react';
import { Calendar, ExternalLink, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import HoverableWords from '../shared/HoverableWords';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../providers/SettingsContext';

interface PortfolioSummaryItemProps {
  title: string;
  company: string;
  date: string;
  description: string;
  url?: string;
  onRemove?: () => void;
  ariaLabelTemplate?: string;
}

const cleanText = (text: string) => {
  if (!text) return "";
  return text.replace(/\r?\n|\r|\t/g, ' ').replace(/\s+/g, ' ').trim();
};

export default function PortfolioSummaryItem({
  title,
  company,
  date,
  description,
  url,
  onRemove,
  ariaLabelTemplate
}: PortfolioSummaryItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isExpandAll, isAtsMode, isFullDescription } = useSettings();

  const getBrief = (text: string) => {
    if (!text) return "";
    const firstSentence = text.split('.')[0];
    return firstSentence ? firstSentence.trim() + "." : "";
  };

  const brief = getBrief(description);
  const showContent = isOpen || isExpandAll || isAtsMode;

  if (isAtsMode) {
    const cleanTitle = cleanText(title);
    const cleanCompany = cleanText(company);
    const cleanDate = cleanText(date);
    const cleanBrief = cleanText(isFullDescription ? description : brief);

    return (
      <div className="portfolio-summary-item py-0 relative group">
        <div className="flex flex-wrap items-baseline gap-x-1 portfolio-item-header">
          <h3 className="font-bold text-foreground text-xs portfolio-item-title m-0">
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-foreground"
              >
                {cleanTitle}
              </a>
            ) : (
              cleanTitle
            )}
          </h3>
          <span className="text-[var(--text-muted)] text-[11px] select-none">|</span>
          <span className="text-foreground text-[11px] font-medium tracking-tight portfolio-item-company">{cleanCompany}</span>
          <span className="text-[var(--text-muted)] text-[11px] select-none">|</span>
          <span className="text-[var(--text-muted)] text-[11px] font-medium tracking-tight portfolio-item-date">{cleanDate}</span>
          {onRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="ml-auto p-1 hover:bg-red-500/10 rounded-md transition-colors text-theme-muted hover:text-red-500 no-print cursor-pointer opacity-0 group-hover:opacity-100 align-middle self-center"
              title="Remove entry"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
        {cleanBrief && (
          <div className="pt-0.5 pb-0">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {cleanBrief}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="group cursor-pointer transition-all duration-300 border-transparent hover:border-theme-500 pl-3 -ml-3 py-1 portfolio-summary-item"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 portfolio-item-header">
        <h3 className="font-bold text-foreground group-hover:text-theme-500 transition-colors leading-tight portfolio-item-title text-base">
          {title}
        </h3>

        <div className="flex items-center gap-2 shrink-0 portfolio-item-actions">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ariaLabelTemplate ? `${ariaLabelTemplate}${title}` : `Visit external link for ${title}`}
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

      <div className="flex flex-wrap items-center gap-x-3 text-sm md:text-xs font-medium tracking-wider portfolio-item-meta">
        <span className="text-theme-600 dark:text-theme-400 portfolio-item-company">{company}</span>
        <span className="text-[var(--text-muted)] flex items-center gap-1 portfolio-item-date">
          <Calendar size={10} />
          {date}
        </span>
      </div>

      <AnimatePresence initial={false}>
        {showContent && brief && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-1.5 pb-1">
                <HoverableWords className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed">
                  {isFullDescription ? description : brief}
                </HoverableWords>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
