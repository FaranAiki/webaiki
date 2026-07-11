"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useSettings, fonts, TextAlign } from './SettingsContext';
import { ExperienceTag } from '@/lib/types';
import {
  Settings,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Plus,
  Minus,
  RotateCcw,
  ChevronDown,
  Palette,
  Filter,
  Languages,
  ALargeSmall,
  ArrowLeftRight,
  ArrowUpDown
} from 'lucide-react';
import Image from 'next/image';

interface SettingsPopupProps {
  labels: {
    Settings: string;
    Typography: string;
    Alignment: string;
    Text_Scaling: string;
    Letter_Spacing: string;
    Line_Height: string;
    Font_Default: string;
    Reset_Settings: string;
    Color_Variant: string;
    Color_Blue: string;
    Color_Pink: string;
    Color_Green: string;
    Color_Purple: string;
    Color_Orange: string;
    Color_Grey: string;
    Color_Mono: string;
    Color_Red: string;
    Color_Teal: string;
    Color_Gold: string;
    Advanced_Section: string;
    ATS_Friendly: string;
    Expand_All: string;
    Full_Description_Portfolio: string;
    Portfolio_Filter: string;
    Filter_All: string;
    Filter_Top: string;
    // Tag labels
    Education: string;
    Data: string;
    Human: string;
    Technology: string;
    Math: string;
    Management: string;
    Arts: string;
    Achievement: string;
    Language: string;
    Select_Language?: string;
  };
  current_lang?: string;
  onLanguageChange?: (langCode: string) => void;
  languages?: { code: string; name: string; flag: string }[];
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  inline?: boolean;
}

export default function SettingsPopup({ 
  labels, 
  current_lang,
  onLanguageChange,
  languages,
  isOpen: externalIsOpen, 
  onOpenChange, 
  inline = false 
}: SettingsPopupProps) {
  const pathname = usePathname();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = useCallback((value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalIsOpen(value);
    }
  }, [onOpenChange]);

  const {
    font, setFont,
    textAlign, setTextAlign,
    textScale, setTextScale,
    letterSpacing, setLetterSpacing,
    lineHeight, setLineHeight,
    color, setColor,
    isAtsMode, setIsAtsMode,
    isExpandAll, setIsExpandAll,
    isFullDescription, setIsFullDescription,
    portfolioFilter, setPortfolioFilter,
    resetSettings
  } = useSettings();

  const isPortfolioPage = pathname?.includes('/portfolio');

  // Disable ATS mode if we leave the portfolio page
  useEffect(() => {
    if (!isPortfolioPage && isAtsMode) {
      setIsAtsMode(false);
    }
  }, [isPortfolioPage, isAtsMode, setIsAtsMode]);

  // Use CSS variables and Tailwind dark: variants for styling to avoid hydration mismatch
  const textColorClass = "text-[var(--text-muted)]";
  const popupRef = useRef<HTMLDivElement>(null);
  const fontDropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(event.target as Node)) {
        setIsFontDropdownOpen(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };

    if (isOpen || isFontDropdownOpen || isFilterDropdownOpen || isLangDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isFontDropdownOpen, isFilterDropdownOpen, isLangDropdownOpen, setIsOpen]);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleReset = () => {
    resetSettings();
  };

  const adjustScale = (delta: number) => {
    setTextScale(Math.min(Math.max(textScale + delta, 80), 120));
  };

  const adjustSpacing = (delta: number) => {
    setLetterSpacing(Math.round((Math.min(Math.max(letterSpacing + delta, -2), 10)) * 10) / 10);
  };

  const adjustLineHeight = (delta: number) => {
    setLineHeight(Math.round((Math.min(Math.max(lineHeight + delta, 0.8), 3)) * 10) / 10);
  };

  const alignments: { value: TextAlign; icon: React.ReactNode; title: string }[] = [
    { value: 'default', icon: <RotateCcw size={18} />, title: 'Default' },
    { value: 'left', icon: <AlignLeft size={18} />, title: 'Left' },
    { value: 'center', icon: <AlignCenter size={18} />, title: 'Center' },
    { value: 'right', icon: <AlignRight size={18} />, title: 'Right' },
    { value: 'justify', icon: <AlignJustify size={18} />, title: 'Justify' },
  ];
  const colors = [
    { name: 'blue', class: 'bg-[#0ea5e9]', label: labels.Color_Blue },
    { name: 'pink', class: 'bg-[#ec4899]', label: labels.Color_Pink },
    { name: 'green', class: 'bg-[#16a34a]', label: labels.Color_Green },
    { name: 'purple', class: 'bg-[#9333ea]', label: labels.Color_Purple },
    { name: 'orange', class: 'bg-[#ea580c]', label: labels.Color_Orange },
    { name: 'gold', class: 'bg-[#d97706]', label: labels.Color_Gold },
    { name: 'grey', class: 'bg-[#64748b]', label: labels.Color_Grey },
    { name: 'mono', class: 'bg-[#000000] border-gray-500 dark:bg-[#ffffff]', label: labels.Color_Mono },
    { name: 'red', class: 'bg-[#ef4444]', label: labels.Color_Red },
    { name: 'teal', class: 'bg-[#14b8a6]', label: labels.Color_Teal },
  ];

  const currentFontClass = fonts.find(f => f.name === font)?.class || '';

  const renderContent = () => (
    <div className="space-y-6 SettingsPopup_content">
      {/* Header */}
      <div className={`flex items-center justify-between border-b pb-4 border-theme-border`}>
        <h3 className="text-lg font-bold flex items-center gap-2 nav-active-gacor">
          <Settings size={20} className="text-theme-500" />
          {labels.Settings}
        </h3>
        <button
          onClick={handleReset}
          className="text-xs font-medium text-theme-500 hover:text-theme-400 transition-colors flex items-center gap-1"
        >
          <RotateCcw size={12} />
          {labels.Reset_Settings}
        </button>
      </div>

      {/* Language Selection Section */}
      {languages && current_lang && onLanguageChange && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-theme-muted tracking-wide">
            <Languages size={14} />
            {labels.Select_Language || labels.Language}
          </div>
          
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                bg-theme-surface-strong text-foreground border-theme-border hover:bg-theme-surface-strong/80
                border hover:border-theme-500/50
              `}
            >
              <div className="flex items-center gap-3 truncate">
                <div className="w-5 h-3.5 relative shrink-0">
                  <Image 
                    src={languages.find(l => l.code === current_lang)?.flag || ''} 
                    alt={current_lang} 
                    fill 
                    className="object-cover rounded-sm"
                    sizes="20px"
                  />
                </div>
                <span className="truncate pr-2">{languages.find(l => l.code === current_lang)?.name || current_lang}</span>
              </div>
              <ChevronDown size={18} className={`shrink-0 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangDropdownOpen && (
              <div className={`
                absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto z-[70]
                bg-theme-surface border-theme-border shadow-xl shadow-theme-shadow
                border rounded-xl custom-scrollbar
              `} data-lenis-prevent>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 text-left px-4 py-3 text-sm transition-colors
                      ${current_lang === lang.code
                        ? 'bg-theme-500 text-white font-bold'
                        : 'hover:bg-theme-surface-strong text-foreground'}
                    `}
                  >
                    <div className="w-5 h-3.5 relative shrink-0">
                      <Image 
                        src={lang.flag} 
                        alt={lang.name} 
                        fill 
                        className={`object-cover rounded-sm ${current_lang === lang.code ? '' : 'grayscale-[0.2]'}`}
                        sizes="20px"
                      />
                    </div>
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Color Variant Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-theme-muted tracking-wide">
          <Palette size={14} />
          {labels.Color_Variant}
        </div>
        <div className="grid grid-cols-5 gap-3">
          {colors.map((c) => (
            <button
              key={c.name}
              onClick={() => setColor(c.name)}
              className={`
                w-8 h-8 rounded-full border-2 transition-all duration-200
                ${c.class}
                ${color === c.name ? 'border-theme-border scale-110 shadow-lg' : 'border-transparent hover:scale-105'}
              `}
              title={c.label}
            />
          ))}
        </div>
      </div>

      {/* Typography Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-theme-muted tracking-wide">
          <Type size={14} />
          {labels.Typography}
        </div>

        {/* Custom Font Dropdown */}
        <div className="relative" ref={fontDropdownRef}>
          <button
            onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
            className={`
              w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              bg-theme-surface-strong text-foreground border-theme-border hover:bg-theme-surface-strong/80
              border hover:border-theme-500/50
              ${fonts.find(f => f.name === font)?.class || ''}
            `}
          >
            <span className="truncate pr-2">{font === 'Default' ? labels.Font_Default : font}</span>
            <ChevronDown size={18} className={`shrink-0 transition-transform duration-200 ${isFontDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isFontDropdownOpen && (
            <div className={`
              absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto z-[70]
              bg-theme-surface border-theme-border shadow-xl shadow-theme-shadow
              border rounded-xl custom-scrollbar
            `} data-lenis-prevent>
              {fonts.map((f) => (
                <button
                  key={f.name}
                  onClick={() => {
                    setFont(f.name);
                    setIsFontDropdownOpen(false);
                  }}
                  className={`
                    w-full text-left px-4 py-3 text-sm transition-colors
                    ${font === f.name
                      ? 'bg-theme-500 text-white'
                      : 'hover:bg-theme-surface-strong text-foreground'}
                    ${f.class || ''}
                  `}
                >
                  {f.name === 'Default' ? labels.Font_Default : f.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alignment Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-theme-muted tracking-wide">
          <AlignLeft size={14} />
          {labels.Alignment}
        </div>
        <div className={`flex bg-theme-surface-strong border-theme-border p-1 rounded-xl border`}>
          {alignments.map((a) => (
            <button
              key={a.value}
              onClick={() => setTextAlign(a.value)}
              title={a.title}
              className={`
                flex-1 flex items-center justify-center p-2 rounded-lg transition-all duration-200
                ${textAlign === a.value
                  ? 'bg-theme-500 text-white shadow-md'
                  : 'text-theme-muted hover:text-foreground'}
              `}
            >
              {a.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced & Printing Section - ONLY ON PORTFOLIO PAGE */}
      {isPortfolioPage && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-theme-muted tracking-wide">
            <Settings size={14} />
            {labels.Advanced_Section}
          </div>

          {/* Portfolio Filter Dropdown */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-theme-muted/80 tracking-widest">
              <Filter size={10} />
              {labels.Portfolio_Filter}
            </div>
            <div className="relative" ref={filterDropdownRef}>
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200
                  bg-theme-surface-strong text-foreground border-theme-border hover:bg-theme-surface-strong/80
                  border hover:border-theme-500/50
                `}
              >
                <span className="truncate pr-2">
                  {portfolioFilter === 'all' ? labels.Filter_All :
                   portfolioFilter === 'top' ? labels.Filter_Top :
                   labels[portfolioFilter as keyof typeof labels] || portfolioFilter}
                </span>
                <ChevronDown size={14} className={`shrink-0 transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isFilterDropdownOpen && (
                <div className={`
                  absolute left-0 right-0 mt-2 max-h-48 overflow-y-auto z-[70]
                  bg-theme-surface border-theme-border shadow-xl shadow-theme-shadow
                  border rounded-xl custom-scrollbar
                `} data-lenis-prevent>
                  <button
                    onClick={() => {
                      setPortfolioFilter('all');
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`
                      w-full text-left px-4 py-2 text-xs transition-colors
                      ${portfolioFilter === 'all'
                        ? 'bg-theme-500 text-white'
                        : 'hover:bg-theme-surface-strong text-foreground'}
                    `}
                  >
                    {labels.Filter_All}
                  </button>
                  <button
                    onClick={() => {
                      setPortfolioFilter('top');
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`
                      w-full text-left px-4 py-2 text-xs transition-colors
                      ${portfolioFilter === 'top'
                        ? 'bg-theme-500 text-white'
                        : 'hover:bg-theme-surface-strong text-foreground'}
                    `}
                  >
                    {labels.Filter_Top}
                  </button>
                  {Object.values(ExperienceTag).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setPortfolioFilter(tag);
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`
                        w-full text-left px-4 py-2 text-xs transition-colors
                        ${portfolioFilter === tag
                          ? 'bg-theme-500 text-white'
                          : 'hover:bg-theme-surface-strong text-foreground'}
                      `}
                    >
                      {labels[tag as keyof typeof labels] || tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  id="settings-ats-mode"
                  name="settings-ats-mode"
                  type="checkbox"
                  checked={isAtsMode}
                  onChange={(e) => setIsAtsMode(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${isAtsMode ? 'bg-theme-500' : 'bg-theme-surface-strong border border-theme-border'}`} />
                <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform duration-200 ${isAtsMode ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-theme-500 transition-colors">
                {labels.ATS_Friendly}
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  id="settings-expand-all"
                  name="settings-expand-all"
                  type="checkbox"
                  checked={isExpandAll}
                  onChange={(e) => setIsExpandAll(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${isExpandAll ? 'bg-theme-500' : 'bg-theme-surface-strong border border-theme-border'}`} />
                <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform duration-200 ${isExpandAll ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-theme-500 transition-colors">
                {labels.Expand_All}
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  id="settings-full-description"
                  name="settings-full-description"
                  type="checkbox"
                  checked={isFullDescription}
                  onChange={(e) => setIsFullDescription(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${isFullDescription ? 'bg-theme-500' : 'bg-theme-surface-strong border border-theme-border'}`} />
                <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform duration-200 ${isFullDescription ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-theme-500 transition-colors">
                {labels.Full_Description_Portfolio}
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Controls Section */}
      <div className="space-y-5">
        {/* Text Scaling */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs font-bold text-theme-muted tracking-wide">
              <ALargeSmall size={14} />
              {labels.Text_Scaling}
            </div>
            <span className={`text-xs font-bold text-theme-500 ${currentFontClass}`}>{textScale}%</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => adjustScale(-5)} className={`p-2 rounded-lg bg-theme-surface-strong hover:bg-theme-surface-strong/80 text-theme-muted`}>
              <Minus size={16} />
            </button>
            <input
              id="settings-text-scale"
              name="settings-text-scale"
              type="range" min="80" max="120" step="5" value={textScale}
              onChange={(e) => setTextScale(parseInt(e.target.value))}
              className="flex-1 accent-theme-500 h-1.5 bg-theme-border rounded-lg appearance-none cursor-pointer"
            />
            <button onClick={() => adjustScale(5)} className={`p-2 rounded-lg bg-theme-surface-strong hover:bg-theme-surface-strong/80 text-theme-muted`}>
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Letter Spacing */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs font-bold text-theme-muted tracking-wide">
              <ArrowLeftRight size={14} />
              {labels.Letter_Spacing}
            </div>
            <span className={`text-xs font-bold text-theme-500 ${currentFontClass}`}>{letterSpacing}px</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => adjustSpacing(-0.1)} className={`p-2 rounded-lg bg-theme-surface-strong hover:bg-theme-surface-strong/80 text-theme-muted`}>
              <Minus size={16} />
            </button>
            <input
              id="settings-letter-spacing"
              name="settings-letter-spacing"
              type="range" min="-2" max="10" step="0.1" value={letterSpacing}
              onChange={(e) => setLetterSpacing(parseFloat(e.target.value))}
              className="flex-1 accent-theme-500 h-1.5 bg-theme-border rounded-lg appearance-none cursor-pointer"
            />
            <button onClick={() => adjustSpacing(0.1)} className={`p-2 rounded-lg bg-theme-surface-strong hover:bg-theme-surface-strong/80 text-theme-muted`}>
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Line Height */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs font-bold text-theme-muted tracking-wide">
              <ArrowUpDown size={14} />
              {labels.Line_Height}
            </div>
            <span className={`text-xs font-bold text-theme-500 ${currentFontClass}`}>{lineHeight}</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => adjustLineHeight(-0.1)} className={`p-2 rounded-lg bg-theme-surface-strong hover:bg-theme-surface-strong/80 text-theme-muted`}>
              <Minus size={16} />
            </button>
            <input
              id="settings-line-height"
              name="settings-line-height"
              type="range" min="0.8" max="3" step="0.1" value={lineHeight}
              onChange={(e) => setLineHeight(parseFloat(e.target.value))}
              className="flex-1 accent-theme-500 h-1.5 bg-theme-border rounded-lg appearance-none cursor-pointer"
            />
            <button onClick={() => adjustLineHeight(0.1)} className={`p-2 rounded-lg bg-theme-surface-strong hover:bg-theme-surface-strong/80 text-theme-muted`}>
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (inline) {
    return (
      <div className="w-full">
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="relative" ref={popupRef}>
      <button
        onClick={toggleOpen}
        className={`group p-2.5 rounded-full hover:bg-theme-surface-strong transition-all duration-300 hover-gacor ${isOpen ? 'nav-active-gacor' : textColorClass}`}
        aria-label={labels.Settings}
      >
        <Settings
          size={22}
          className={`transition-all duration-300 ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          data-lenis-prevent
          style={{ overscrollBehavior: 'contain' }}
          className={`
          absolute right-0 top-full mt-3
          w-[calc(100vw-2rem)] sm:w-80
          max-w-[320px] sm:max-w-none
          bg-theme-surface/95 dark:bg-theme-bg-dark/95 border-theme-border dark:border-theme-border shadow-2xl shadow-theme-shadow dark:shadow-theme-shadow
          md:backdrop-blur-md bg-theme-surface/95 border rounded-2xl z-50 p-6
          animate-fade-in origin-top-right ring-1 ring-black/5
          max-h-[80vh] overflow-y-auto custom-scrollbar
        `}>
          {renderContent()}
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${mounted ? 'var(--theme-border)' : '#e5e7eb'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--theme-color-600);
        }
      `}</style>
    </div>
  );
}
