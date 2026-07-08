"use client";

import React, { useState } from 'react';

import { usePresentation } from '../providers/PresentationContext';
import { LayoutSwitcher } from '../shared/LayoutSwitcher';
import FadeInSection from '@/components/shared/FadeInSection';
import {
    LayoutPanelLeft,
    Milestone,
    LayoutGrid,
    Grid2X2,
    Rows,
} from 'lucide-react';

import { ExperienceProvider } from './ExperienceContext';

import dynamic from 'next/dynamic';


import ExperienceOriginalLayout from './layouts/ExperienceOriginalLayout';

const LoadingSpinner = () => (
    <div className="w-full flex justify-center items-center py-24 min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-theme-500/20 border-t-theme-500 rounded-full animate-spin"></div>
    </div>
);

const ExperienceBentoLayout = dynamic(() => import('./layouts/ExperienceBentoLayout'), { loading: () => <LoadingSpinner /> });
const ExperienceTimelineLayout = dynamic(() => import('./layouts/ExperienceTimelineLayout'), { loading: () => <LoadingSpinner /> });
const ExperienceGridLayout = dynamic(() => import('./layouts/ExperienceGridLayout'), { loading: () => <LoadingSpinner /> });
const ExperienceSmoothLayout = dynamic(() => import('./layouts/ExperienceSmoothLayout'), { loading: () => <LoadingSpinner /> });
const ExperiencePresentationLayout = dynamic(() => import('./layouts/ExperiencePresentationLayout'), { loading: () => <LoadingSpinner /> });

export type Job = {
    date: string;
    title: string;
    company: string;
    description: string | string[];
    image?: string[];
    url?: string;
    year?: string;
    point?: number;
    tag?: string[];
};

export type Experience = {
    year: string;
    jobs: Job[];
    point?: number;
};

export type LayoutType = 'original' | 'timeline' | 'grid' | 'bento' | 'smooth';
export type PresentationLayoutType = 'modern' | 'split' | 'minimal';

interface ExperiencesClientProps {
    experiences: Experience[];
    lang?: string;
    layout?: LayoutType;
    canChange?: boolean;
    original_text?: string;
    timeline_text?: string;
    grid_text?: string;
    bento_text?: string;
    smooth_text?: string;
    click_to_close_text?: string;
    modern_text?: string;
    cinematic_text?: string;
    editorial_text?: string;
    visit_external_link_text?: string;
    isLoggedIn?: boolean;
    bookmarkedItemIds?: string[];
    timelineLayout?: React.ReactNode;
    serverOriginalLayout?: React.ReactNode;
    hover_to_preview_text?: string;
    hover_an_experience_text?: string;
    visit_project_text?: string;
}

export default function ExperiencesClient({
    experiences,
    lang = 'en',
    layout = 'original',
    canChange = false,
    original_text = 'Original',
    timeline_text = 'Timeline',
    grid_text = 'Grid',
    bento_text = 'Bento',
    smooth_text = 'Smooth',
    click_to_close_text = 'Click to close',
    modern_text = 'Modern',
    cinematic_text = 'Cinematic',
    editorial_text = 'Editorial',
    visit_external_link_text = 'Visit external link for',
    isLoggedIn = false,
    bookmarkedItemIds = [],
    timelineLayout,
    serverOriginalLayout,
    hover_to_preview_text = 'Hover to preview',
    hover_an_experience_text = 'Hover an experience to see details',
    visit_project_text = 'Visit Project'
}: ExperiencesClientProps) {
    const [currentLayout, setCurrentLayout] = useState<LayoutType>(layout);
    const { isPresentationMode } = usePresentation();

    const layoutOptions = [
        { id: 'original' as LayoutType, icon: <Rows size={16} />, label: original_text },
        { id: 'timeline' as LayoutType, icon: <Milestone size={16} />, label: timeline_text },
        { id: 'bento' as LayoutType, icon: <LayoutGrid size={16} />, label: bento_text },
        { id: 'grid' as LayoutType, icon: <Grid2X2 size={16} />, label: grid_text },
        { id: 'smooth' as LayoutType, icon: <LayoutPanelLeft size={16} />, label: smooth_text },
    ];

    const translations = {
        original_text,
        timeline_text,
        grid_text,
        bento_text,
        smooth_text,
        click_to_close_text,
        modern_text,
        cinematic_text,
        editorial_text,
        visit_external_link_text,
        hover_to_preview_text,
        hover_an_experience_text,
        visit_project_text
    };

    return (
        <ExperienceProvider
            experiences={experiences}
            lang={lang}
            layout={currentLayout}
            isLoggedIn={isLoggedIn}
            bookmarkedItemIds={bookmarkedItemIds}
            translations={translations}
        >
            <div className={isPresentationMode ? "contents" : "w-full"}>
                {canChange && !isPresentationMode && (
                    <LayoutSwitcher
                        options={layoutOptions}
                        currentLayout={currentLayout}
                        setCurrentLayout={setCurrentLayout}
                        canChange={canChange}
                    />
                )}

                {isPresentationMode ? (
                    <ExperiencePresentationLayout />
                ) : (
                    <FadeInSection initialVisible={true}>
                        <div className="container mx-auto max-w-6xl">
                            {currentLayout === 'original' && (serverOriginalLayout || <ExperienceOriginalLayout />)}
                            {currentLayout === 'timeline' && (timelineLayout || <ExperienceTimelineLayout />)}
                            {currentLayout === 'grid' && <ExperienceGridLayout />}
                            {currentLayout === 'bento' && <ExperienceBentoLayout />}
                            {currentLayout === 'smooth' && <ExperienceSmoothLayout />}
                        </div>
                    </FadeInSection>
                )}
            </div>
        </ExperienceProvider>
    );
}
