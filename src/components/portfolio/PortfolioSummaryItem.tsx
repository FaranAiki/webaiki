"use client";

import React, { useState } from 'react';
import { Calendar, ExternalLink, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
// import HoverableWords from '../shared/HoverableWords';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../providers/SettingsContext';

interface PortfolioSummaryItemProps {
  title: string;
  company: string;
  date: string;
  description: string | string[];
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

  const getBrief = (desc: string | string[]) => {
    if (Array.isArray(desc)) {
      return desc.length > 0 ? desc[0] : "";
    }
    if (!desc) return "";
    const firstSentence = desc.split('.')[0];
    return firstSentence ? firstSentence.trim() + "." : "";
  };

  const brief = getBrief(description);
  const showContent = isOpen || isExpandAll || isAtsMode;

  if (isAtsMode) {
    const cleanTitle = cleanText(title);
    const cleanCompany = cleanText(company);
    const cleanDate = cleanText(date);
    
    // For ATS, if description is array and isFullDescription is true, show bullet points
    const renderATSDescription = () => {
      if (isFullDescription && Array.isArray(description)) {
        return (
          <ul className="list-none space-y-1 mt-1 text-xs text-[var(--text-muted)] leading-relaxed">
            {description.map((item, idx) => (
              <li key={idx}>• {cleanText(item)}</li>
            ))}
          </ul>
        );
      }
      
      const textToClean = isFullDescription && !Array.isArray(description) ? description : brief;
      const cleanBrief = cleanText(textToClean);
      if (!cleanBrief) return null;
      
      return (
        <div className="pt-0.5 pb-0">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            {cleanBrief}
          </p>
        </div>
      );
    };

    return (
      <div className="portfolio-summary-item py-0 relative group">
        <div className="portfolio-item-header leading-tight">
          <h3 className="font-bold text-foreground text-xs portfolio-item-title m-0 inline">
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-foreground inline"
              >
                {cleanTitle}
              </a>
            ) : (
              cleanTitle
            )}
          </h3>
          <span className="text-[var(--text-muted)] text-[11px] select-none mx-1">|</span>
          <span className="text-foreground text-[11px] font-medium tracking-tight portfolio-item-company inline">{cleanCompany}</span>
          <span className="text-[var(--text-muted)] text-[11px] select-none mx-1">|</span>
          <span className="text-[var(--text-muted)] text-[11px] font-medium tracking-tight portfolio-item-date inline">{cleanDate}</span>
          {onRemove && (
            <button
              onClick={onRemove}
              className="ml-2 inline-flex items-center justify-center p-0.5 text-[var(--text-muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity no-print"
              title="Hide this item"
              aria-label="Hide item"
            >
              <Trash2 size={10} />
            </button>
          )}
        </div>
        {renderATSDescription()}
      </div>
    );
  }

  const renderNormalDescription = () => {
    if (Array.isArray(description)) {
      return (
        <ul className="list-disc pl-4 space-y-1 mt-1 text-xs md:text-sm text-[var(--text-muted)] leading-relaxed">
          {description.map((item, idx) => (
            <li key={idx}><span>{item}</span></li>
          ))}
        </ul>
      );
    }

    const textToClean = isFullDescription ? description : brief;
    const cleanBrief = cleanText(textToClean);
    
    return (
      <div className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed">
        {cleanBrief}
      </div>
    );
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="group cursor-pointer transition-all duration-300 border-transparent hover:border-theme-500 pl-3 -ml-3 py-2 min-h-[44px] portfolio-summary-item"
      onClick={() => setIsOpen(!isOpen)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsOpen(!isOpen);
        }
      }}
      aria-expanded={showContent}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 portfolio-item-header">
        <h3 className="font-bold text-foreground group-hover:text-theme-500 transition-colors leading-tight portfolio-item-title text-base">
          {title}
        </h3>

        <div className="flex items-center gap-1 shrink-0 portfolio-item-actions">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ariaLabelTemplate ? `${ariaLabelTemplate}${title}` : `Visit external link for ${title}`}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-theme-500/10 rounded-md transition-colors portfolio-item-link"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={16} className="text-theme-muted" />
              </a>
            )}
            <div className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-theme-muted portfolio-item-chevron">
                {showContent ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 text-sm md:text-xs font-medium tracking-wider portfolio-item-meta">
        <span className="text-theme-800 dark:text-theme-200 portfolio-item-company">{company}</span>
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
                {renderNormalDescription()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
