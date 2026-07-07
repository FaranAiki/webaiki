import { create } from "zustand";

interface AppState {
  isPresentationMode: boolean;
  setPresentationMode: (mode: boolean) => void;
  isAskMeOpen: boolean;
  setAskMeOpen: (isOpen: boolean) => void;
  isScrollLocked: boolean;
  setScrollLocked: (isLocked: boolean) => void;
  isGlobalLoading: boolean;
  setGlobalLoading: (isLoading: boolean) => void;

  // Settings State
  font: string;
  setFont: (font: string) => void;
  textAlign: 'default' | 'left' | 'center' | 'right' | 'justify';
  setTextAlign: (align: 'default' | 'left' | 'center' | 'right' | 'justify') => void;
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
  portfolioFilter: 'all' | 'top' | string;
  setPortfolioFilter: (filter: 'all' | 'top' | string) => void;
  
  // User & Auth State
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  bookmarks: { itemType: string; itemId: string }[];
  setBookmarks: (bookmarks: { itemType: string; itemId: string }[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isPresentationMode: false,
  setPresentationMode: (mode) => set({ isPresentationMode: mode }),
  isAskMeOpen: false,
  setAskMeOpen: (isOpen) => set({ isAskMeOpen: isOpen }),
  isScrollLocked: false,
  setScrollLocked: (isLocked) => set({ isScrollLocked: isLocked }),
  isGlobalLoading: false,
  setGlobalLoading: (isLoading) => set({ isGlobalLoading: isLoading }),

  // Settings Default State
  font: 'Default',
  setFont: (font) => set({ font }),
  textAlign: 'default',
  setTextAlign: (textAlign) => set({ textAlign }),
  textScale: 100,
  setTextScale: (textScale) => set({ textScale }),
  letterSpacing: 0,
  setLetterSpacing: (letterSpacing) => set({ letterSpacing }),
  lineHeight: 1.5,
  setLineHeight: (lineHeight) => set({ lineHeight }),
  color: 'blue',
  setColor: (color) => set({ color }),
  isAtsMode: false,
  setIsAtsMode: (isAtsMode) => set({ isAtsMode }),
  isExpandAll: false,
  setIsExpandAll: (isExpandAll) => set({ isExpandAll }),
  isFullDescription: false,
  setIsFullDescription: (isFullDescription) => set({ isFullDescription }),
  portfolioFilter: 'top',
  setPortfolioFilter: (portfolioFilter) => set({ portfolioFilter }),

  // User & Auth Default State
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  bookmarks: [],
  setBookmarks: (bookmarks) => set({ bookmarks }),
}));
