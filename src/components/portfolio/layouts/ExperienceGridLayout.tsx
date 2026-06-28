"use client";

import React, { useMemo } from 'react';
import { m as motion } from 'framer-motion';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { useExperienceContext } from '../ExperienceContext';
import BookmarkButton from '@/components/interactive/BookmarkButton';
import { TagBadge, PdfRenderer, PlaceholderIcon } from './ExperienceShared';

export default function ExperienceGridLayout() {
    const { 
        paginatedExperiences, 
        bookmarkedItemIds, 
        isLoggedIn,
        cardBorder,
        inactiveCardBg,
        mainText,
        shimmer600x400
    } = useExperienceContext();
    
    const allJobs = useMemo(() => paginatedExperiences.flatMap(e => e.jobs), [paginatedExperiences]);

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.1 } }
            }}
        >
            {allJobs.map((job, idx) => (
                <motion.div
                    key={`${job.year}-${idx}`}
                    id={`exp-${job.title.toLowerCase().replace(/\s+/g, '-')}`}
                    initial={idx < 4 ? "show" : undefined}
                    variants={{
                        hidden: { opacity: 0, y: 20, scale: 0.95 },
                        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }
                    }}
                    onClick={() => job.url && window.open(job.url, '_blank', 'noopener,noreferrer')}
                    onKeyDown={(e) => e.key === 'Enter' && job.url && window.open(job.url, '_blank', 'noopener,noreferrer')}
                    role={job.url ? "button" : "article"}
                    tabIndex={job.url ? 0 : undefined}
                    className={`flex flex-col p-6 rounded-2xl border ${cardBorder} ${inactiveCardBg} group shadow-sm hover:shadow-2xl transition-shadow duration-300 transform-gpu ${job.url ? 'cursor-pointer' : ''}`}
                >
                    <div className="relative aspect-video mb-6 rounded-xl overflow-hidden bg-theme-surface-strong">
                        {job.image && job.image.length > 0 ? (
                            job.image[0].toLowerCase().endsWith('.pdf') ? (
                                <PdfRenderer url={job.image[0]} />
                            ) : (
                                <Image src={job.image[0]} alt={`${job.title} at ${job.company} - Muhammad Faran Aiki Portfolio`} fill sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 20vw" quality={75} className="object-cover transition-transform group-hover:scale-105" priority={true} placeholder="blur" blurDataURL={shimmer600x400} />
                            )
                        ) : (
                            <PlaceholderIcon company={job.company} />
                        )}
                    </div>
                    <p className="text-xs mb-1 text-foreground/80">{job.date}</p>
                    <div className="flex justify-between items-start mb-1 gap-2">
                        <h3 className={`text-xl font-black ${mainText} group-hover:text-theme-500 leading-tight`}>{job.title}<TagBadge labels={job.tag} /></h3>
                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                            <BookmarkButton itemType="experience" itemId={job.title} initialBookmarked={bookmarkedItemIds.includes(job.title)} isLoggedIn={!!isLoggedIn} className="relative !p-1.5" />
                            {job.url && <ExternalLink size={14} className="text-theme-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                        </div>
                    </div>
                    <p className="text-sm italic text-theme-700 dark:text-theme-300 mb-4">{job.company}</p>
                </motion.div>
            ))}
        </motion.div>
    );
}
