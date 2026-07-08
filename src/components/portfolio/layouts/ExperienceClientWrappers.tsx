"use client";

import React from 'react';
import { ExternalLink } from 'lucide-react';
import BookmarkButton from '@/components/interactive/BookmarkButton';
import { useExperienceContext } from '../ExperienceContext';
import { TimelineActiveImage, TagBadge } from './ExperienceShared';
import { Job } from '../ExperienceDisplayer';

export function HoverableJobItem({ job, children }: { job: Job, children: React.ReactNode }) {
    const {
        activeJob,
        setActiveJob,
        activeCardBg,
        inactiveCardBg,
        cardBorder,
        mainText,
        descText,
        justifyClass,
        bookmarkedItemIds,
        isLoggedIn
    } = useExperienceContext();

    const isActive = activeJob?.title === job.title && activeJob?.company === job.company;

    return (
        <div
            id={`exp-${((job.title || "").toLowerCase()).replace(/\s+/g, '-')}`}
            onClick={() => job.url && window.open(job.url, '_blank', 'noopener,noreferrer')}
            onKeyDown={(e) => e.key === 'Enter' && job.url && window.open(job.url, '_blank', 'noopener,noreferrer')}
            onMouseEnter={() => setActiveJob(job)}
            role={job.url ? "button" : "article"}
            tabIndex={job.url ? 0 : undefined}
            className={`p-6 rounded-lg border-2 shadow-sm group transform-gpu transition-colors duration-300 ${job.url ? 'cursor-pointer' : ''}
                ${isActive ? `${activeCardBg}` : `${inactiveCardBg} ${cardBorder} hover:border-theme-500/50`}
                [&_[data-desc-container]]:${justifyClass} [&_[data-desc-container]]:${descText}
                [&_h3]:${mainText}
            `}
        >
            <div className="absolute top-6 right-6 flex items-center gap-2" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                {job.url && <ExternalLink size={14} className="text-theme-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                <BookmarkButton itemType="experience" itemId={job.image?.[0] ?? job.url ?? job.company ?? job.title} initialBookmarked={bookmarkedItemIds.includes(job.image?.[0] ?? job.url ?? job.company ?? job.title)} isLoggedIn={!!isLoggedIn} className="relative z-10" />
            </div>

            <div className="relative z-0 pr-16">
                {children}
            </div>
        </div>
    );
}

export function TimelineActiveImageClient() {
    const { activeJob, shimmer600x400, mainText, translations } = useExperienceContext();

    return (
        <div className="sticky top-32 flex justify-center">
            <div className="w-full">
                <div className="relative w-full max-w-[600px] aspect-[3/2] mx-auto shadow-xl overflow-hidden rounded-lg">
                    <TimelineActiveImage activeJob={activeJob} shimmer600x400={shimmer600x400} />
                </div>
                <div className="mt-4 text-center">
                    {activeJob ? (
                        <>
                            <h3 className={`text-2xl font-black ${mainText}`}>{activeJob.title}<TagBadge labels={activeJob.tag} /></h3>
                            <p className="text-lg italic text-theme-800 dark:text-theme-200 font-medium">{activeJob.company}</p>
                        </>
                    ) : (
                        <p className="text-lg italic text-theme-muted font-medium">{translations?.hover_an_experience_text || "Hover an experience to see details"}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
