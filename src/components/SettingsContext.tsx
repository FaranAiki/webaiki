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

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
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
  { name: 'Comic Sans', variable: '--font-comic-sans', class: 'font-comic-sans' },
  { name: 'Inter', variable: inter.variable, class: inter.className },
  { name: 'Space Grotesk', variable: spaceGrotesk.variable, class: spaceGrotesk.className },
  { name: 'Bebas Neue', variable: bebasNeue.variable, class: bebasNeue.className },
  { name: 'Comfortaa', variable: comfortaa.variable, class: comfortaa.className },
  { name: 'Roboto', variable: roboto.variable, class: roboto.className },
  { name: 'Open Sans', variable: openSans.variable, class: openSans.className },
  { name: 'Lato', variable: lato.variable, class: lato.className },
  { name: 'Montserrat', variable: montserrat.variable, class: montserrat.className },
  { name: 'Merriweather', variable: merriweather.variable, class: merriweather.className },
  { name: 'Playfair Display', variable: playfair.variable, class: playfair.className },
  { name: 'Source Sans 3', variable: sourceSans.variable, class: sourceSans.className },
  { name: 'JetBrains Mono', variable: jetbrainsMono.variable, class: jetbrainsMono.className },
  { name: 'Roboto Mono', variable: robotoMono.variable, class: robotoMono.className },
  { name: 'Fira Code', variable: firaCode.variable, class: firaCode.className },
  { name: 'Dancing Script', variable: dancingScript.variable, class: dancingScript.className },
  { name: 'Great Vibes', variable: greatVibes.variable, class: greatVibes.className },
  { name: 'Caveat', variable: caveat.variable, class: caveat.className },
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
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [font, setFont] = useState('Default');
  const [textAlign, setTextAlign] = useState<TextAlign>('default');
  const [textScale, setTextScale] = useState(100);
  const [letterSpacing, setLetterSpacing] = useState(0); 
  const [lineHeight, setLineHeight] = useState(1.5);
  const [mounted, setMounted] = useState(false);

  const resetSettings = () => {
    setFont('Default');
    setTextAlign('default');
    setTextScale(100);
    setLetterSpacing(0);
    setLineHeight(1.5);
  };

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
    
    // 1. Font Class on BODY (Global)
    fonts.forEach(f => {
      if (f.class) body.classList.remove(f.class);
    });
    const activeFont = fonts.find(f => f.name === font);
    if (activeFont && activeFont.class) {
      body.classList.add(activeFont.class);
    }

    // 2. Body Settings (Global)
    // Scale via CSS variable on body
    body.style.setProperty('--text-scale-factor', (textScale / 100).toString());
    
    // Alignment (applied to body, but might need to be careful with UI elements)
    body.style.textAlign = textAlign === 'default' ? '' : textAlign;
    
    // Spacing & Height
    body.style.setProperty('--app-letter-spacing', `${letterSpacing}px`);
    body.style.setProperty('--app-line-height', lineHeight.toString());
  }, [font, textAlign, textScale, letterSpacing, lineHeight, mounted]);

  return (
    <SettingsContext.Provider value={{ 
      font, setFont, 
      textAlign, setTextAlign, 
      textScale, setTextScale,
      letterSpacing, setLetterSpacing,
      lineHeight, setLineHeight,
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
