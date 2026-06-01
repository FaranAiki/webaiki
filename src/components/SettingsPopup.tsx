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
  ChevronDown
} from 'lucide-react';
import { useTheme } from 'next-themes';

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
  };
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  inline?: boolean;
}

export default function SettingsPopup({ labels, isOpen: externalIsOpen, onOpenChange, inline = false }: SettingsPopupProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  
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
    resetSettings
  } = useSettings();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const textColor = isDark ? 'text-gray-300' : 'text-slate-700';
  const popupRef = useRef<HTMLDivElement>(null);
  const fontDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    setTextScale(Math.min(Math.max(textScale + delta, 50), 150));
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

  const renderContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
        <h3 className="text-lg font-bold flex items-center gap-2 nav-active-gacor">
          <Settings size={20} className="text-cyan-500" />
          {labels.Settings}
        </h3>
        <button 
          onClick={handleReset}
          className="text-xs font-medium text-cyan-500 hover:text-cyan-400 transition-colors flex items-center gap-1"
        >
          <RotateCcw size={12} />
          {labels.Reset_Settings}
        </button>
      </div>

      {/* Typography Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 tracking-wide">
          <Type size={14} />
          {labels.Typography}
        </div>
        
        {/* Custom Font Dropdown */}
        <div className="relative" ref={fontDropdownRef}>
          <button
            onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
            className={`
              w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${isDark ? 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}
              border border-transparent hover:border-cyan-500/50
              ${fonts.find(f => f.name === font)?.class || ''}
            `}
          >
            <span className="truncate pr-2">{font === 'Default' ? labels.Font_Default : font}</span>
            <ChevronDown size={18} className={`shrink-0 transition-transform duration-200 ${isFontDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isFontDropdownOpen && (
            <div className={`
              absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto z-[70]
              ${isDark ? 'bg-gray-800 border-gray-700 shadow-black/40' : 'bg-white border-gray-200 shadow-gray-200/50'} 
              border rounded-xl shadow-xl custom-scrollbar
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
                      ? 'bg-cyan-500 text-white' 
                      : isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}
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
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 tracking-wide">
          <AlignLeft size={14} />
          {labels.Alignment}
        </div>
        <div className={`flex ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-100 border-gray-200'} p-1 rounded-xl border`}>
          {alignments.map((a) => (
            <button
              key={a.value}
              onClick={() => setTextAlign(a.value)}
              title={a.title}
              className={`
                flex-1 flex items-center justify-center p-2 rounded-lg transition-all duration-200
                ${textAlign === a.value 
                  ? 'bg-cyan-500 text-white shadow-md' 
                  : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}
              `}
            >
              {a.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Section */}
      <div className="space-y-5">
        {/* Text Scaling */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 tracking-wide">{labels.Text_Scaling}</span>
            <span className="text-xs font-mono text-cyan-500 font-bold">{textScale}%</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => adjustScale(-5)} className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
              <Minus size={16} />
            </button>
            <input 
              type="range" min="50" max="150" step="5" value={textScale}
              onChange={(e) => setTextScale(parseInt(e.target.value))}
              className="flex-1 accent-cyan-500 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <button onClick={() => adjustScale(5)} className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Letter Spacing */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 tracking-wide">{labels.Letter_Spacing}</span>
            <span className="text-xs font-mono text-cyan-500 font-bold">{letterSpacing}px</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => adjustSpacing(-0.1)} className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
              <Minus size={16} />
            </button>
            <input 
              type="range" min="-2" max="10" step="0.1" value={letterSpacing}
              onChange={(e) => setLetterSpacing(parseFloat(e.target.value))}
              className="flex-1 accent-cyan-500 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <button onClick={() => adjustSpacing(0.1)} className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Line Height */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 tracking-wide">{labels.Line_Height}</span>
            <span className="text-xs font-mono text-cyan-500 font-bold">{lineHeight}</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => adjustLineHeight(-0.1)} className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
              <Minus size={16} />
            </button>
            <input 
              type="range" min="0.8" max="3" step="0.1" value={lineHeight}
              onChange={(e) => setLineHeight(parseFloat(e.target.value))}
              className="flex-1 accent-cyan-500 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <button onClick={() => adjustLineHeight(0.1)} className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
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
        className={`group p-2.5 rounded-full hover:${isDark ? 'bg-white/10' : 'bg-gray-100'} transition-all duration-300 hover-gacor ${isOpen ? 'nav-active-gacor' : textColor}`}
        aria-label={labels.Settings}
      >
        <Settings 
          size={22} 
          className={`transition-all duration-300 ${isOpen ? 'rotate-90' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className={`
          absolute right-0 top-full mt-3 
          w-[calc(100vw-2rem)] sm:w-80 
          max-w-[320px] sm:max-w-none
          ${isDark ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'} 
          backdrop-blur-xl border rounded-2xl shadow-2xl z-50 p-6
          animate-in fade-in zoom-in-95 duration-200 origin-top-right
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
          background: ${isDark ? '#374151' : '#e5e7eb'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0891b2;
        }
      `}</style>
    </div>
  );
}
