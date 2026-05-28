"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useSettings, fonts, TextAlign } from './SettingsContext';
import { 
  Settings, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Minus,
  Plus,
  X,
  Baseline,
  ArrowUpDown,
  Check,
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
}

export default function SettingsPopup({ labels }: SettingsPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
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
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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
        className={`group p-2.5 rounded-full hover:${isDark ? 'bg-white/10' : 'bg-gray-100'} transition-colors duration-300`}
        aria-label={labels.Settings}
      >
        <Settings 
          size={22} 
          className={`${isDark ? 'text-gray-300' : 'text-slate-700'} group-hover:text-cyan-600 transition-colors duration-300 ${isOpen ? 'rotate-90' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className={`absolute top-full right-0 mt-3 w-80 md:w-96 ${isDark ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'} backdrop-blur-md border rounded-2xl shadow-2xl z-50 p-6 animate-fade-in ring-1 ring-black/5 max-h-[85vh] overflow-y-auto no-scrollbar`}>
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-inherit pb-2 z-10">
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{labels.Settings}</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleReset}
                title={labels.Reset_Settings}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  isDark 
                    ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20' 
                    : 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100 border border-cyan-100'
                }`}
              >
                <RotateCcw size={14} />
                <span>{labels.Reset_Settings}</span>
              </button>
              <button onClick={() => setIsOpen(false)} className={`p-1 rounded-full hover:${isDark ? 'bg-gray-800' : 'bg-gray-100'} transition-colors`}>
                <X size={18} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Font Selection List */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Type size={16} className="text-cyan-500" />
                <label className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{labels.Typography}</label>
              </div>
              <div className={`flex flex-col gap-1 max-h-40 overflow-y-auto pr-2 custom-scrollbar rounded-xl p-1 border ${isDark ? 'border-gray-800 bg-gray-950/30' : 'border-gray-100 bg-gray-50/50'}`}>
                {fonts.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => setFont(f.name)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
                      font === f.name
                        ? 'bg-cyan-500/10 text-cyan-500 font-bold border border-cyan-500/20'
                        : `${isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-white hover:shadow-sm'} border border-transparent`
                    } ${f.class}`}
                  >
                    <span className="text-sm truncate">{f.name === 'Default' ? labels.Font_Default : f.name}</span>
                    {font === f.name && <Check size={14} className="flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Alignment Icons Only */}
            <div>
              <label className={`block text-sm font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{labels.Alignment}</label>
              <div className={`flex p-1 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-200/50 border border-gray-200 shadow-inner'}`}>
                {alignments.map((item) => (
                  <button
                    key={item.value}
                    title={item.title}
                    onClick={() => setTextAlign(item.value)}
                    className={`flex-1 flex justify-center items-center py-2.5 rounded-lg transition-all ${
                      textAlign === item.value
                        ? `${isDark ? 'bg-gray-700' : 'bg-white shadow-sm'} text-cyan-500 scale-105 font-bold`
                        : 'text-gray-500 hover:text-cyan-400'
                    }`}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Scaling Controls Group */}
            <div className="space-y-6 pt-2 border-t border-gray-100 dark:border-gray-800">
              {/* Text Scale */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Type size={16} className="text-cyan-500" />
                    <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{labels.Text_Scaling}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setTextScale(100)}
                      title={labels.Reset_Settings}
                      className={`p-1 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-500 hover:text-cyan-400' : 'hover:bg-gray-100 text-gray-400 hover:text-cyan-600'}`}
                    >
                      <RotateCcw size={12} />
                    </button>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">{textScale}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => adjustScale(-5)} className="text-gray-400 hover:text-cyan-500 transition-colors"><Minus size={16} /></button>
                  <input 
                    type="range" min="50" max="150" step="5" value={textScale} 
                    onChange={(e) => setTextScale(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none"
                  />
                  <button onClick={() => adjustScale(5)} className="text-gray-400 hover:text-cyan-500 transition-colors"><Plus size={16} /></button>
                </div>
              </div>

              {/* Letter Spacing */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Baseline size={16} className="text-cyan-500" />
                    <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{labels.Letter_Spacing}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setLetterSpacing(0)}
                      title={labels.Reset_Settings}
                      className={`p-1 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-500 hover:text-cyan-400' : 'hover:bg-gray-100 text-gray-400 hover:text-cyan-600'}`}
                    >
                      <RotateCcw size={12} />
                    </button>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">{letterSpacing}px</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => adjustSpacing(-0.1)} className="text-gray-400 hover:text-cyan-500 transition-colors"><Minus size={16} /></button>
                  <input 
                    type="range" min="-1" max="5" step="0.1" value={letterSpacing} 
                    onChange={(e) => setLetterSpacing(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none"
                  />
                  <button onClick={() => adjustSpacing(0.1)} className="text-gray-400 hover:text-cyan-500 transition-colors"><Plus size={16} /></button>
                </div>
              </div>

              {/* Line Height */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown size={16} className="text-cyan-500" />
                    <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{labels.Line_Height}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setLineHeight(1.5)}
                      title={labels.Reset_Settings}
                      className={`p-1 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-500 hover:text-cyan-400' : 'hover:bg-gray-100 text-gray-400 hover:text-cyan-600'}`}
                    >
                      <RotateCcw size={12} />
                    </button>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">{lineHeight}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => adjustLineHeight(-0.1)} className="text-gray-400 hover:text-cyan-500 transition-colors"><Minus size={16} /></button>
                  <input 
                    type="range" min="0.8" max="3" step="0.1" value={lineHeight} 
                    onChange={(e) => setLineHeight(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none"
                  />
                  <button onClick={() => adjustLineHeight(0.1)} className="text-gray-400 hover:text-cyan-500 transition-colors"><Plus size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
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
