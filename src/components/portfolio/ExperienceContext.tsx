"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { useSettings } from '../providers/SettingsContext';
import { Job, Experience, LayoutType, PresentationLayoutType } from './ExperienceDisplayer'; // We'll export these types from ExperienceDisplayer or a types file later

interface ExperienceContextType {
    experiences: Experience[];
    paginatedExperiences: Experience[];
    activeJob: Job | null;
    setActiveJob: (job: Job | null) => void;
    currentLayout: LayoutType;
    setCurrentLayout: (layout: LayoutType) => void;
    presentationLayout: PresentationLayoutType;
    setPresentationLayout: (layout: PresentationLayoutType) => void;
    lang: string;
    isDark: boolean;
    isLoggedIn: boolean;
    bookmarkedItemIds: string[];
    
    // UI Classes
    mainText: string;
    descText: string;
    cardBorder: string;
    activeCardBg: string;
    inactiveCardBg: string;
    justifyClass: string;
    shimmer600x400: string;

    translations: import('@/components/layout/Translator').TranslationDict;
}

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export function ExperienceProvider({ 
    children, 
    experiences,
    lang,
    layout,
    isLoggedIn,
    bookmarkedItemIds,
    translations
}: { 
    children: React.ReactNode;
    experiences: Experience[];
    lang: string;
    layout: LayoutType;
    isLoggedIn: boolean;
    bookmarkedItemIds: string[];
    translations: import('@/components/layout/Translator').TranslationDict;
}) {
    const [currentLayout, setCurrentLayout] = useState<LayoutType>(layout);
    const [presentationLayout, setPresentationLayout] = useState<PresentationLayoutType>('modern');
    const [activeJob, setActiveJob] = useState<Job | null>(null);
    const { resolvedTheme } = useTheme();
    const { textAlign } = useSettings();
    const [mounted, setMounted] = useState(false);
    

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && resolvedTheme === 'dark';
    
    // UI Classes calculation
    const mainText = "text-foreground";
    const descText = "text-foreground/80 dark:text-foreground/70";
    const cardBorder = "border-theme-border/50 dark:border-theme-border";
    const activeCardBg = "bg-theme-500/10 dark:bg-theme-500/20 border-theme-500 shadow-md shadow-theme-500/10";
    const inactiveCardBg = "bg-theme-surface hover:bg-theme-surface/80 dark:bg-theme-surface-strong/50";
    const justifyClass = textAlign === 'justify' ? 'text-justify' : textAlign === 'center' ? 'text-center' : 'text-left';
    
    const shimmer600x400 = `data:image/svg+xml;base64,...`; // We'll move the shimmer logic here later or import it

    const paginatedExperiences = useMemo(() => {
        // We will move pagination logic here
        return experiences; 
    }, [experiences]);

    const value = {
        experiences,
        paginatedExperiences,
        activeJob,
        setActiveJob,
        currentLayout,
        setCurrentLayout,
        presentationLayout,
        setPresentationLayout,
        lang,
        isDark,
        isLoggedIn,
        bookmarkedItemIds,
        mainText,
        descText,
        cardBorder,
        activeCardBg,
        inactiveCardBg,
        justifyClass,
        shimmer600x400,
        translations
    };

    return (
        <ExperienceContext.Provider value={value}>
            {children}
        </ExperienceContext.Provider>
    );
}

export function useExperienceContext() {
    const context = useContext(ExperienceContext);
    if (context === undefined) {
        throw new Error('useExperienceContext must be used within an ExperienceProvider');
    }
    return context;
}
