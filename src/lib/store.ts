import { create } from "zustand";

interface AppState {
  isPresentationMode: boolean;
  setPresentationMode: (mode: boolean) => void;
  isAskMeOpen: boolean;
  setAskMeOpen: (isOpen: boolean) => void;
  isScrollLocked: boolean;
  setScrollLocked: (isLocked: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isPresentationMode: false,
  setPresentationMode: (mode) => set({ isPresentationMode: mode }),
  isAskMeOpen: false,
  setAskMeOpen: (isOpen) => set({ isAskMeOpen: isOpen }),
  isScrollLocked: false,
  setScrollLocked: (isLocked) => set({ isScrollLocked: isLocked }),
}));
