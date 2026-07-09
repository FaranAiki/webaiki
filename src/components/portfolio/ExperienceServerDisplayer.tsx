import React from 'react';
import ExperiencesClient from './ExperienceDisplayer';
import { ExperienceServerOriginalLayout } from './layouts/ExperienceServerOriginalLayout';
import type { LayoutType, Experience } from './ExperienceDisplayer';

interface ExperiencesServerProps {
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
    hover_to_preview_text?: string;
    hover_an_experience_text?: string;
    visit_project_text?: string;
    isLoggedIn?: boolean;
    bookmarkedItemIds?: string[];
    timelineLayout?: React.ReactNode;
    priorityImages?: boolean;
}

export default function ExperienceServerDisplayer(props: ExperiencesServerProps) {
    const lang = props.lang || 'en';
    return (
        <ExperiencesClient 
            {...props} 
            serverOriginalLayout={
                <ExperienceServerOriginalLayout 
                    experiences={props.experiences} 
                    lang={lang} 
                />
            } 
        />
    );
}
