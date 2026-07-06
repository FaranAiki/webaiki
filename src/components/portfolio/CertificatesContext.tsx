"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { usePresentation } from '../providers/PresentationContext';

export type CertificateData = {
  [category: string]: {
    [year: string]: {
      [fileName: string]: { path: string; point: number };
    };
  };
};

export type CertificatesContextType = {
    certificates: CertificateData;
    lang: string;
    isLoggedIn: boolean;
    bookmarkedItemIds: string[];
    
    currentLayout: 'original' | 'timeline' | 'grid' | 'bento';
    setCurrentLayout: React.Dispatch<React.SetStateAction<'original' | 'timeline' | 'grid' | 'bento'>>;
    
    openCategories: string[];
    setOpenCategories: React.Dispatch<React.SetStateAction<string[]>>;
    handleCategoryClick: (category: string) => void;
    
    selectedYears: { [key: string]: string };
    handleYearClick: (category: string, year: string) => void;
    
    categoryYears: { [key: string]: string[] };
    allSlides: {
      category: string;
      year: string;
      files: [string, { path: string; point: number }][];
      part?: number;
      totalParts?: number;
    }[];
    
    isDark: boolean;
    hasCertificates: boolean;
    isPresentationMode: boolean;
    
    titleColor: string;
    borderColor: string;
    cardBg: string;
    buttonInactiveBg: string;
    buttonInactiveText: string;
    
    translations: import('@/components/layout/Translator').TranslationDict;
};

const CertificatesContext = createContext<CertificatesContextType | undefined>(undefined);

export function CertificatesProvider({
    children,
    certificates,
    lang,
    isLoggedIn,
    bookmarkedItemIds,
    translations
}: {
    children: React.ReactNode;
    certificates: CertificateData;
    lang: string;
    isLoggedIn: boolean;
    bookmarkedItemIds: string[];
    translations: import('@/components/layout/Translator').TranslationDict;
}) {
    const [currentLayout, setCurrentLayout] = useState<'original' | 'timeline' | 'grid' | 'bento'>('original');
    const [openCategories, setOpenCategories] = useState<string[]>([]);
    const [selectedYears, setSelectedYears] = useState<{ [key: string]: string }>({});
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { isPresentationMode } = usePresentation();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleCategoryClick = (category: string) => {
        setOpenCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const handleYearClick = (category: string, year: string) => {
        setSelectedYears((prev) => ({ ...prev, [category]: year }));
    };

    const categoryYears = useMemo(() => {
        const years: { [key: string]: string[] } = {};
        for (const category in certificates) {
            years[category] = Object.keys(certificates[category]).sort((a, b) =>
                b.localeCompare(a)
            );
        }
        return years;
    }, [certificates]);

    const allSlides = useMemo(() => {
        const slides: {
            category: string;
            year: string;
            files: [string, { path: string; point: number }][];
            part?: number;
            totalParts?: number
        }[] = [];

        const sortedCategories = Object.keys(certificates).sort();

        for (const category of sortedCategories) {
            const yearsData = certificates[category];
            const sortedYears = Object.keys(yearsData).sort((a, b) => b.localeCompare(a));

            for (const year of sortedYears) {
                const fileEntries = Object.entries(yearsData[year]);
                const chunkSize = 6;
                const totalParts = Math.ceil(fileEntries.length / chunkSize);

                for (let i = 0; i < fileEntries.length; i += chunkSize) {
                    slides.push({
                        category,
                        year,
                        files: fileEntries.slice(i, i + chunkSize) as [string, { path: string, point: number }][],
                        part: Math.floor(i / chunkSize) + 1,
                        totalParts: totalParts
                    });
                }
            }
        }
        return slides;
    }, [certificates]);

    const isDark = mounted && resolvedTheme === 'dark';
    const hasCertificates = useMemo(() => {
        return Object.values(certificates).some(yearsData =>
            Object.values(yearsData).some(files => Object.keys(files).length > 0)
        );
    }, [certificates]);

    const titleColor = 'text-foreground';
    const borderColor = 'border-theme-border';
    const cardBg = 'bg-theme-surface';
    const buttonInactiveBg = 'bg-theme-surface-strong';
    const buttonInactiveText = 'text-theme-muted hover:bg-theme-border hover:text-foreground';

    const value = {
        certificates,
        lang,
        isLoggedIn,
        bookmarkedItemIds,
        currentLayout,
        setCurrentLayout,
        openCategories,
        setOpenCategories,
        handleCategoryClick,
        selectedYears,
        handleYearClick,
        categoryYears,
        allSlides,
        isDark,
        hasCertificates,
        isPresentationMode,
        titleColor,
        borderColor,
        cardBg,
        buttonInactiveBg,
        buttonInactiveText,
        translations
    };

    return (
        <CertificatesContext.Provider value={value}>
            {children}
        </CertificatesContext.Provider>
    );
}

export function useCertificatesContext() {
    const context = useContext(CertificatesContext);
    if (context === undefined) {
        throw new Error('useCertificatesContext must be used within a CertificatesProvider');
    }
    return context;
}
