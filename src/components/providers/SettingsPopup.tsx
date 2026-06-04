"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSettings, fonts, TextAlign } from './SettingsContext';
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
  Palette
} from 'lucide-react';

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
    Color_Mono: string;
    Advanced_Section: string;
    ATS_Friendly: string;
    Expand_All: string;
  };
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  inline?: boolean;
}

export default function SettingsPopup({ labels, isOpen: externalIsOpen, onOpenChange, inline = false }: SettingsPopupProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
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
    resetSettings
  } = useSettings();
  
  // Use CSS variables and Tailwind dark: variants for styling to avoid hydration mismatch
  const textColorClass = "text-[var(--text-muted)]";
  const popupRef = useRef<HTMLDivElement>(null);
  const fontDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(event.target as Node)) {
        setIsFontDropdownOpen(false);
      }
    };

    if (isOpen || isFontDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isFontDropdownOpen, setIsOpen]);

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
    { name: 'mono', class: 'bg-[#64748b]', label: labels.Color_Mono },
  ];

  const currentFontClass = fonts.find(f => f.name === font)?.class || '';

  const renderContent = () => (
    <div className="space-y-6" data-lenis-prevent>
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

      {/* Color Variant Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-theme-muted tracking-wide">
          <Palette size={14} />
          {labels.Color_Variant}
        </div>
        <div className="flex gap-3">
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
            `}>
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

        {/* Advanced & Printing Section */}
        <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-theme-muted tracking-wide">
          <Settings size={14} />
          {labels.Advanced_Section}
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input 
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
        </div>
        </div>

        {/* Controls Section */}
      <div className="space-y-5">
        {/* Text Scaling */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-theme-muted tracking-wide">{labels.Text_Scaling}</span>
            <span className={`text-xs font-bold text-theme-500 ${currentFontClass}`}>{textScale}%</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => adjustScale(-5)} className={`p-2 rounded-lg bg-theme-surface-strong hover:bg-theme-surface-strong/80 text-theme-muted`}>
              <Minus size={16} />
            </button>
            <input 
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
            <span className="text-xs font-bold text-theme-muted tracking-wide">{labels.Letter_Spacing}</span>
            <span className={`text-xs font-bold text-theme-500 ${currentFontClass}`}>{letterSpacing}px</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => adjustSpacing(-0.1)} className={`p-2 rounded-lg bg-theme-surface-strong hover:bg-theme-surface-strong/80 text-theme-muted`}>
              <Minus size={16} />
            </button>
            <input 
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
            <span className="text-xs font-bold text-theme-muted tracking-wide">{labels.Line_Height}</span>
            <span className={`text-xs font-bold text-theme-500 ${currentFontClass}`}>{lineHeight}</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => adjustLineHeight(-0.1)} className={`p-2 rounded-lg bg-theme-surface-strong hover:bg-theme-surface-strong/80 text-theme-muted`}>
              <Minus size={16} />
            </button>
            <input 
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
          className={`
          absolute right-0 top-full mt-3 
          w-[calc(100vw-2rem)] sm:w-80 
          max-w-[320px] sm:max-w-none
          bg-theme-surface/95 dark:bg-theme-bg-dark/95 border-theme-border dark:border-theme-border shadow-2xl shadow-theme-shadow dark:shadow-theme-shadow
          md:backdrop-blur-xl border rounded-2xl z-50 p-6
          animate-fade-in origin-top-right ring-1 ring-black/5
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
