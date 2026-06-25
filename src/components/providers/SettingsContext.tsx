"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Inter, 
  Roboto, 
  Open_Sans, 
  Lato, 
  Montserrat, 
  Merriweather, 
  Playfair_Display,
  Source_Sans_3,
  JetBrains_Mono,
  Roboto_Mono,
  Fira_Code,
  Dancing_Script,
  Great_Vibes,
  Caveat,
  Bebas_Neue,
  Space_Grotesk,
  Comfortaa
} from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', preload: false });
const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-roboto', preload: false });
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-open-sans', preload: false });
const lato = Lato({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-lato', preload: false });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', preload: false });
const merriweather = Merriweather({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-merriweather', preload: false });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', preload: false });
const sourceSans = Source_Sans_3({ subsets: ['latin'], variable: '--font-source-sans', preload: false });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', preload: false });
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-roboto-mono', preload: false });
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code', preload: false });
const dancingScript = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing-script', preload: false });
const greatVibes = Great_Vibes({ weight: ['400'], subsets: ['latin'], variable: '--font-great-vibes', preload: false });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat', preload: false });
const bebasNeue = Bebas_Neue({ weight: ['400'], subsets: ['latin'], variable: '--font-bebas-neue', preload: false });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', preload: false });
const comfortaa = Comfortaa({ subsets: ['latin'], variable: '--font-comfortaa', preload: false });

export const fonts = [
  { name: 'Default', variable: '', class: '' },
  // Modern Sans-Serif (The "Gacor" ones)
  { name: 'Inter', variable: inter.variable, class: inter.className },
  { name: 'Space Grotesk', variable: spaceGrotesk.variable, class: spaceGrotesk.className },
  { name: 'Montserrat', variable: montserrat.variable, class: montserrat.className },
  { name: 'Open Sans', variable: openSans.variable, class: openSans.className },
  { name: 'Roboto', variable: roboto.variable, class: roboto.className },
  { name: 'Lato', variable: lato.variable, class: lato.className },
  { name: 'Source Sans 3', variable: sourceSans.variable, class: sourceSans.className },
  { name: 'Comfortaa', variable: comfortaa.variable, class: comfortaa.className },
  { name: 'Bebas Neue', variable: bebasNeue.variable, class: bebasNeue.className },
  
  // High-End Serifs
  { name: 'Playfair Display', variable: playfair.variable, class: playfair.className },
  { name: 'Merriweather', variable: merriweather.variable, class: merriweather.className },

  // Gacor Monospace (Coding vibe)
  { name: 'JetBrains Mono', variable: jetbrainsMono.variable, class: jetbrainsMono.className },
  { name: 'Fira Code', variable: firaCode.variable, class: firaCode.className },
  { name: 'Roboto Mono', variable: robotoMono.variable, class: robotoMono.className },

  // Artistic & Decorative
  { name: 'Dancing Script', variable: dancingScript.variable, class: dancingScript.className },
  { name: 'Caveat', variable: caveat.variable, class: caveat.className },
  { name: 'Great Vibes', variable: greatVibes.variable, class: greatVibes.className },

  // The Meme / Legend
  { name: 'Comic Sans', variable: '--font-comic-sans', class: 'font-comic-sans' },
];

export type TextAlign = 'default' | 'left' | 'center' | 'right' | 'justify';
export type PortfolioFilter = 'all' | 'top' | string;

interface SettingsContextType {
  font: string;
  setFont: (font: string) => void;
  textAlign: TextAlign;
  setTextAlign: (align: TextAlign) => void;
  textScale: number;
  setTextScale: (scale: number) => void;
  letterSpacing: number;
  setLetterSpacing: (spacing: number) => void;
  lineHeight: number;
  setLineHeight: (height: number) => void;
  color: string;
  setColor: (color: string) => void;
  isAtsMode: boolean;
  setIsAtsMode: (ats: boolean) => void;
  isExpandAll: boolean;
  setIsExpandAll: (expand: boolean) => void;
  isFullDescription: boolean;
  setIsFullDescription: (full: boolean) => void;
  portfolioFilter: PortfolioFilter;
  setPortfolioFilter: (filter: PortfolioFilter) => void;
  colorRGB: { r: number, g: number, b: number };
  resetSettings: () => void;
}

import { useAppStore } from '@/lib/store';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    portfolioFilter, setPortfolioFilter
  } = useAppStore();

  const [mounted, setMounted] = useState(false);

  const resetSettings = () => {
    setFont('Default');
    setTextAlign('default');
    setTextScale(100);
    setLetterSpacing(0);
    setLineHeight(1.5);
    setColor('blue');
    setIsAtsMode(false);
    setIsExpandAll(false);
    setIsFullDescription(false);
    setPortfolioFilter('top');
  };

  const colorRGB = React.useMemo(() => {
    switch (color) {
      case 'pink':
        return { r: 219, g: 39, b: 119 }; // pink-600
      case 'green':
        return { r: 22, g: 163, b: 74 }; // green-600
      case 'purple':
        return { r: 147, g: 51, b: 234 }; // purple-600
      case 'orange':
        return { r: 234, g: 88, b: 12 }; // orange-600
      case 'mono':
        return { r: 100, g: 116, b: 139 }; // slate-500
      default:
        return { r: 8, g: 145, b: 178 }; // theme-600
    }
  }, [color]);

  useEffect(() => {
    // Helper to get from cookie or localStorage
    const getSetting = (key: string) => {
      // 1. Check cookies first (most recent from URL via middleware)
      const cookies = document.cookie.split('; ').reduce((acc: Record<string, string>, current) => {
        const [name, value] = current.split('=');
        if (name && value) acc[name.trim()] = value;
        return acc;
      }, {});
      
      if (cookies[key]) return decodeURIComponent(cookies[key]);
      
      // 2. Fallback to localStorage
      return localStorage.getItem(key);
    };

    const savedFont = getSetting('settings-font');
    const savedAlign = getSetting('settings-align') as TextAlign;
    const savedScale = getSetting('settings-scale');
    const savedSpacing = getSetting('settings-spacing');
    const savedLineHeight = getSetting('settings-lineheight');
    const savedColor = getSetting('color');
    const savedAts = getSetting('settings-ats');
    const savedExpand = getSetting('settings-expand-all');
    const savedFullDesc = getSetting('settings-full-desc');
    const savedFilter = getSetting('settings-portfolio-filter');

    if (savedFont) setFont(savedFont);
    if (savedAlign) setTextAlign(savedAlign);
    if (savedScale) setTextScale(Math.min(Math.max(Number(savedScale), 80), 120));
    if (savedSpacing) setLetterSpacing(Number(savedSpacing));
    if (savedLineHeight) setLineHeight(Number(savedLineHeight));
    if (savedColor) setColor(savedColor);
    if (savedAts) setIsAtsMode(savedAts === 'true');
    if (savedExpand) setIsExpandAll(savedExpand === 'true');
    if (savedFullDesc) setIsFullDescription(savedFullDesc === 'true');
    if (savedFilter) setPortfolioFilter(savedFilter as PortfolioFilter);
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('settings-font', font);
    localStorage.setItem('settings-align', textAlign);
    localStorage.setItem('settings-scale', textScale.toString());
    localStorage.setItem('settings-spacing', letterSpacing.toString());
    localStorage.setItem('settings-lineheight', lineHeight.toString());
    localStorage.setItem('color', color);
    localStorage.setItem('settings-ats', isAtsMode.toString());
    localStorage.setItem('settings-expand-all', isExpandAll.toString());
    localStorage.setItem('settings-full-desc', isFullDescription.toString());
    localStorage.setItem('settings-portfolio-filter', portfolioFilter);

    const root = document.documentElement;
    const body = document.body;
    
    // 1. Font Class on BODY (Global)
    fonts.forEach(f => {
      if (f.class) body.classList.remove(f.class);
    });
    const activeFont = fonts.find(f => f.name === font);
    if (activeFont && activeFont.class) {
      body.classList.add(activeFont.class);
    }

    // 2. Color Class on ROOT
    root.classList.remove('theme-pink', 'theme-blue', 'theme-green', 'theme-purple', 'theme-orange', 'theme-mono');
    root.classList.add(`theme-${color}`);

    // 3. Global Settings via CSS variables on root
    root.style.setProperty('--text-scale-factor', (textScale / 100).toString());
    root.style.setProperty('--app-letter-spacing', `${letterSpacing}px`);
    root.style.setProperty('--app-line-height', lineHeight.toString());
    
    // Alignment (applied to body)
    body.style.textAlign = textAlign === 'default' ? '' : textAlign;

    // ATS Mode and Expand All helpers
    if (isAtsMode) body.classList.add('ats-mode');
    else body.classList.remove('ats-mode');

    if (isExpandAll) body.classList.add('expand-all');
    else body.classList.remove('expand-all');

  }, [font, textAlign, textScale, letterSpacing, lineHeight, color, isAtsMode, isExpandAll, isFullDescription, portfolioFilter, mounted]);

  return (
  <SettingsContext.Provider value={{ 
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
    colorRGB,
    resetSettings
  }}>
    {children}
  </SettingsContext.Provider>
  );
  };
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
