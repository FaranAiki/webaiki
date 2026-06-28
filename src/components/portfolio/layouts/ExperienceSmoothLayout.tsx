"use client";

import React, { useMemo } from 'react';
import { m as motion } from 'framer-motion';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import HoverableWords from '@/components/shared/HoverableWords';
import BookmarkButton from '@/components/interactive/BookmarkButton';
import { formatCJK } from '@/lib/utils';
import { useExperienceContext } from '../ExperienceContext';
import { TagBadge, PdfRenderer, PlaceholderIcon } from './ExperienceShared';

export default function ExperienceSmoothLayout() {
    const { 
        paginatedExperiences, 
        bookmarkedItemIds, 
        isLoggedIn,
        lang,
        mainText,
        descText,
        justifyClass,
        
    } = useExperienceContext();
    
    const allJobs = useMemo(() => paginatedExperiences.flatMap(e => e.jobs), [paginatedExperiences]);

    return (
        <motion.div
            className="space-y-24 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.15 } }
            }}
        >
            {allJobs.map((job, idx) => (
                <motion.div
                    key={`${job.year}-${idx}`}
                    id={`exp-${job.title.toLowerCase().replace(/\s+/g, '-')}`}
                    initial={idx < 2 ? "show" : undefined}
                    variants={{
                        hidden: { opacity: 0, y: 30 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                    }}
                    onClick={() => job.url && window.open(job.url, '_blank', 'noopener,noreferrer')}
                    onKeyDown={(e) => e.key === 'Enter' && job.url && window.open(job.url, '_blank', 'noopener,noreferrer')}
                    role={job.url ? "button" : "article"}
                    tabIndex={job.url ? 0 : undefined}
                    className={`group transform-gpu ${job.url ? 'cursor-pointer' : ''}`}
                >
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-full md:w-1/2 space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="h-px w-12 bg-theme-500"></span>
                                <p className="text-sm font-bold text-foreground/80">{job.date}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <h3 className={`text-4xl md:text-5xl font-black ${mainText} group-hover:text-theme-500 leading-tight transition-colors`}>{job.title}<TagBadge labels={job.tag} /></h3>
                                <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} className="flex items-center gap-2">
                                    <BookmarkButton itemType="experience" itemId={job.title} initialBookmarked={bookmarkedItemIds.includes(job.title)} isLoggedIn={!!isLoggedIn} className="relative" />
                                    {job.url && <ExternalLink size={24} className="text-theme-500 opacity-0 group-hover:opacity-100 transition-all translate-y-2" />}
                                </div>
                            </div>
                            <p className="text-xl font-medium italic text-theme-700 dark:text-theme-300 opacity-80">{job.company}</p>
                            <HoverableWords className={`${justifyClass} ${descText} text-lg leading-relaxed`}>
                                {formatCJK(job.description, lang)}
                            </HoverableWords>
                        </div>
                        <div className="w-full md:w-1/2">
                            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] bg-theme-surface-strong">
                                {job.image && job.image.length > 0 ? (
                                    job.image[0].toLowerCase().endsWith('.pdf') ? (
                                        <PdfRenderer url={job.image[0]} isExpanded />
                                    ) : (
                                        <Image src={job.image[0]} alt={`${job.title} at ${job.company} - Muhammad Faran Aiki Portfolio`} fill sizes="(max-width: 768px) 50vw, 400px" quality={75} priority={true} className="object-cover" />
                                    )
                                ) : (
                                    <PlaceholderIcon company={job.company} />
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
