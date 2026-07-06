"use client";

import React from 'react';
import { m as motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
// import HoverableWords from '@/components/shared/HoverableWords';
import BookmarkButton from '@/components/interactive/BookmarkButton';

import { formatCJK } from '@/lib/utils';
import { useExperienceContext } from '../ExperienceContext';
import { TagBadge, TimelineActiveImage } from './ExperienceShared';

export default function ExperienceOriginalLayout() {
    const {
        paginatedExperiences,
        activeJob,
        setActiveJob,
        lang,
        mainText,
        activeCardBg,
        inactiveCardBg,
        cardBorder,
        descText,
        justifyClass,
        bookmarkedItemIds,
        isLoggedIn,
        shimmer600x400
    } = useExperienceContext();

    return (
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="w-full md:w-1/2">
                {paginatedExperiences.map((experience, expIdx) => (
                    <div key={experience.year} className={`mb-12`}>
                        <h2 className={`transition-transform duration-300 hover:scale-105 text-2xl font-bold text-theme-700 dark:text-theme-300 mb-6 py-2 cursor-pointer`}>
                            {experience.year}
                        </h2>
                        <motion.div
                            className="space-y-4"
                            initial={expIdx < 3 ? "show" : "hidden"}
                            whileInView="show"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={{
                                hidden: {},
                                show: { transition: { staggerChildren: 0.1 } }
                            }}
                        >
                            {experience.jobs.map((job, index) => (
                                <motion.div
                                    key={`${experience.year}-${index}`}
                                    id={`exp-${job.title.toLowerCase().replace(/\s+/g, '-')}`}
                                    variants={{
                                        hidden: { opacity: 0, y: 15 },
                                        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                                    }}
                                    onClick={() => job.url && window.open(job.url, '_blank', 'noopener,noreferrer')}
                                    onKeyDown={(e) => e.key === 'Enter' && job.url && window.open(job.url, '_blank', 'noopener,noreferrer')}
                                    onMouseEnter={() => setActiveJob(job)}
                                    role={job.url ? "button" : "article"}
                                    tabIndex={job.url ? 0 : undefined}
                                    className={`p-6 rounded-lg border-2 shadow-sm group transform-gpu ${job.url ? 'cursor-pointer' : ''}
                                        ${activeJob.title === job.title && activeJob.company === job.company
                                            ? `${activeCardBg}`
                                            : `${inactiveCardBg} ${cardBorder} hover:border-theme-500/50`
                                        }`}
                                >
                                    <p className="text-xs mb-1 text-theme-800 dark:text-theme-200">{job.date}</p>
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className={`text-xl font-bold ${mainText} group-hover:text-theme-500 ${job.url ? 'underline decoration-dotted decoration-theme-500/30' : ''}`}>
                                            {job.title}<TagBadge labels={job.tag} />
                                        </h3>
                                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                                            <BookmarkButton itemType="experience" itemId={job.title} initialBookmarked={bookmarkedItemIds.includes(job.title)} isLoggedIn={!!isLoggedIn} className="relative" />
                                            {job.url && <ExternalLink size={14} className="text-theme-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </div>
                                    </div>
                                    <p className="text-theme-800 dark:text-theme-200 italic mb-3 font-medium">{job.company}</p>
                                    <div className={`${justifyClass} ${descText} text-sm mt-2`}>
                                        {Array.isArray(job.description) ? (
                                            <ul className="list-disc pl-5 space-y-1">
                                                {job.description.map((item, idx) => (
                                                    <li key={idx}>
                                                        <span>{formatCJK(item, lang)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>{formatCJK(job.description, lang)}</span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                ))}
            </div>
            <div className="hidden md:block w-1/2">
                <div className="sticky top-32 flex justify-center">
                    <div className="w-full">
                        <div className="relative w-full max-w-[600px] aspect-[3/2] mx-auto shadow-xl overflow-hidden rounded-lg">
                            <TimelineActiveImage activeJob={activeJob} shimmer600x400={shimmer600x400} />
                        </div>
                        <div className="mt-4 text-center">
                            <h3 className={`text-2xl font-black ${mainText}`}>{activeJob.title}<TagBadge labels={activeJob.tag} /></h3>
                            <p className="text-lg italic text-theme-800 dark:text-theme-200 font-medium">{activeJob.company}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
