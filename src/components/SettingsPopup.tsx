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
  RotateCcw
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
}

export default function SettingsPopup({ labels, isOpen: externalIsOpen, onOpenChange }: SettingsPopupProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

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
          absolute right-0 top-full mt-3 w-80 
          ${isDark ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'} 
          backdrop-blur-xl border rounded-2xl shadow-2xl z-50 p-6
          animate-in fade-in zoom-in-95 duration-200 origin-top-right
        `}>
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 border-gray-700/50">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
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
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest">
                <Type size={14} />
                {labels.Typography}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {fonts.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => setFont(f.name)}
                    className={`
                      px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                      ${font === f.name 
                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                        : isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                    `}
                    style={{ fontFamily: `var(${f.variable})` }}
                  >
                    {f.name === 'Default' ? labels.Font_Default : f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Alignment Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest">
                <AlignLeft size={14} />
                {labels.Alignment}
              </div>
              <div className="flex bg-gray-800/50 p-1 rounded-xl border border-gray-700/50">
                {alignments.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => setTextAlign(a.value)}
                    title={a.title}
                    className={`
                      flex-1 flex items-center justify-center p-2 rounded-lg transition-all duration-200
                      ${textAlign === a.value 
                        ? 'bg-cyan-500 text-white shadow-md' 
                        : 'text-gray-400 hover:text-white'}
                    `}
                  >
                    {a.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls Section */}
            <div className="space-y-6">
              {/* Text Scaling */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{labels.Text_Scaling}</span>
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
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{labels.Letter_Spacing}</span>
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
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{labels.Line_Height}</span>
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
