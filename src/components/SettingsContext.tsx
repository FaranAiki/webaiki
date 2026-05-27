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
  Source_Sans_3
} from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-roboto' });
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-open-sans' });
const lato = Lato({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-lato' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
const merriweather = Merriweather({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-merriweather' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const sourceSans = Source_Sans_3({ subsets: ['latin'], variable: '--font-source-sans' });

export const fonts = [
  { name: 'Default', variable: '', class: '' },
  { name: 'Inter', variable: inter.variable, class: inter.className },
  { name: 'Roboto', variable: roboto.variable, class: roboto.className },
  { name: 'Open Sans', variable: openSans.variable, class: openSans.className },
  { name: 'Lato', variable: lato.variable, class: lato.className },
  { name: 'Montserrat', variable: montserrat.variable, class: montserrat.className },
  { name: 'Merriweather', variable: merriweather.variable, class: merriweather.className },
  { name: 'Playfair Display', variable: playfair.variable, class: playfair.className },
  { name: 'Source Sans 3', variable: sourceSans.variable, class: sourceSans.className },
];

export type TextAlign = 'default' | 'left' | 'center' | 'right' | 'justify';

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
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [font, setFont] = useState('Default');
  const [textAlign, setTextAlign] = useState<TextAlign>('default');
  const [textScale, setTextScale] = useState(100);
  const [letterSpacing, setLetterSpacing] = useState(0); 
  const [lineHeight, setLineHeight] = useState(1.5);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedFont = localStorage.getItem('settings-font');
    const savedAlign = localStorage.getItem('settings-align') as TextAlign;
    const savedScale = localStorage.getItem('settings-scale');
    const savedSpacing = localStorage.getItem('settings-spacing');
    const savedLineHeight = localStorage.getItem('settings-lineheight');

    if (savedFont) setFont(savedFont);
    if (savedAlign) setTextAlign(savedAlign);
    if (savedScale) setTextScale(Number(savedScale));
    if (savedSpacing) setLetterSpacing(Number(savedSpacing));
    if (savedLineHeight) setLineHeight(Number(savedLineHeight));
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('settings-font', font);
    localStorage.setItem('settings-align', textAlign);
    localStorage.setItem('settings-scale', textScale.toString());
    localStorage.setItem('settings-spacing', letterSpacing.toString());
    localStorage.setItem('settings-lineheight', lineHeight.toString());

    const body = document.body;
    const mainContent = document.getElementById('main-content');
    
    // 1. Font Class on BODY (Global)
    fonts.forEach(f => {
      if (f.class) body.classList.remove(f.class);
    });
    const activeFont = fonts.find(f => f.name === font);
    if (activeFont && activeFont.class) {
      body.classList.add(activeFont.class);
    }

    // 2. Body-Only Settings (via #main-content)
    if (mainContent) {
      // Scale via CSS variable on the wrapper
      mainContent.style.setProperty('--text-scale-factor', (textScale / 100).toString());
      
      // Alignment
      mainContent.style.textAlign = textAlign === 'default' ? '' : textAlign;
      
      // Spacing & Height
      mainContent.style.setProperty('--app-letter-spacing', `${letterSpacing}px`);
      mainContent.style.setProperty('--app-line-height', lineHeight.toString());
    }
  }, [font, textAlign, textScale, letterSpacing, lineHeight, mounted]);

  return (
    <SettingsContext.Provider value={{ 
      font, setFont, 
      textAlign, setTextAlign, 
      textScale, setTextScale,
      letterSpacing, setLetterSpacing,
      lineHeight, setLineHeight
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
