"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

import { Briefcase, ExternalLink } from 'lucide-react';
import { m as motion, AnimatePresence, useInView } from 'framer-motion';
import dynamic from 'next/dynamic';
import BookmarkButton from '@/components/interactive/BookmarkButton';
import { formatCJK } from '@/lib/utils';
import { Job } from '../ExperienceDisplayer';

const PdfPreview = dynamic(() => import('@/components/interactive/PdfPreview'), { ssr: false });

export const TagBadge = ({ labels }: { labels?: string[] }) => {
    if (!labels || labels.length === 0) return null;
    const limitedLabels = labels.slice(0, 3);
    return (
        <div className="inline-flex flex-wrap gap-1 ml-2 align-middle">
            {limitedLabels.map((label, idx) => (
                <span key={idx} className="inline-block px-1.5 py-0.5 text-[9px] font-black rounded-md bg-theme-500/10 text-theme-800 dark:text-theme-200 border border-theme-500/30 tracking-wider">
                    {label}
                </span>
            ))}
            {labels.length > 3 && (
                <span className="text-[9px] font-bold text-theme-muted">+{labels.length - 3}</span>
            )}
        </div>
    );
};

export const PlaceholderIcon = ({ company }: { company: string }) => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-theme-surface-strong via-theme-surface to-theme-bg p-8">
        <div className="p-5 rounded-full bg-theme-surface/50 mb-4 shadow-theme-shadow">
            <Briefcase size={48} className="text-theme-500" />
        </div>
        <p className="text-xs font-black tracking-[0.2em] text-[var(--text-muted)] text-center px-4">
            {company}
        </p>
    </div>
);

export const PdfRenderer = ({ url, isExpanded, priority = false }: { url: string, isExpanded?: boolean, priority?: boolean }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "50px" });

    return (
        <div ref={ref} className={`w-full h-full flex justify-center items-center overflow-hidden bg-theme-surface-strong ${isExpanded ? 'scale-110 blur-sm brightness-[0.3]' : 'group-hover:scale-105 transition-transform duration-700'}`}>
            {(isInView || priority) ? (
                <PdfPreview fileUrl={url} width={300} priority={priority} />
            ) : (
                <PlaceholderIcon company="..." />
            )}
        </div>
    );
};

export const TimelineActiveImage = React.memo(({ activeJob, shimmer600x400 }: { activeJob: Job, shimmer600x400: string }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [activeJob]);

    useEffect(() => {
        if (!activeJob?.image || activeJob.image.length <= 1) {
            return;
        }
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % activeJob.image.length);
        }, 12000);
        return () => clearInterval(timer);
    }, [activeJob]);

    const activeImageSrc = useMemo(() => {
        const idx = (activeJob?.image && currentImageIndex < activeJob.image.length) ? currentImageIndex : 0;
        return activeJob?.image?.[idx];
    }, [activeJob, currentImageIndex]);

    const hasValidImage = !!activeImageSrc;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={activeImageSrc || activeJob.company}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full h-full relative"
            >
                {hasValidImage ? (
                    activeImageSrc!.toLowerCase().endsWith('.pdf') ? (
                        <PdfRenderer url={activeImageSrc!} isExpanded={true} priority={false} />
                    ) : (
                        <Image
                            fill
                            sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 30vw"
                            src={activeImageSrc!}
                            placeholder="blur"
                            blurDataURL={shimmer600x400}
                            alt={`${activeJob.title} at ${activeJob.company}`}
                            className="object-contain"
                            priority={false}
                            quality={75}
                        />
                    )
                ) : (
                    <PlaceholderIcon company={activeJob.company} />
                )}
            </motion.div>
        </AnimatePresence>
    );
});
TimelineActiveImage.displayName = 'TimelineActiveImage';

export interface BentoCardProps {
    job: Job;
    spanClass: string;
    cardBorder: string;
    inactiveCardBg: string;
    isDark: boolean;
    lang: string;
    justifyClass: string;
    click_to_close_text: string;
    priority?: boolean;
    isLoggedIn?: boolean;
    bookmarkedItemIds?: string[];
}

export const BentoCard = React.memo(({ job, spanClass, cardBorder, inactiveCardBg, isDark, lang, justifyClass, click_to_close_text, priority, isLoggedIn, bookmarkedItemIds = [] }: BentoCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasImage = job.image && job.image.length > 0;
    const itemId = `exp-${job.title.toLowerCase().replace(/\s+/g, '-')}`;

    const handleBoxClick = () => {
        if (job.url && !isExpanded) {
            window.open(job.url, '_blank', 'noopener,noreferrer');
            return;
        }
        setIsExpanded(!isExpanded);
    };

    return (
        <motion.div
            id={itemId}
            initial={priority ? "show" : undefined}
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
            }}
            onClick={handleBoxClick}
            onKeyDown={(e) => e.key === 'Enter' && handleBoxClick()}
            role="button"
            tabIndex={0}
            transition={{ duration: 0.4 }}
            className={`${spanClass} relative rounded-3xl overflow-hidden group border ${cardBorder} ${inactiveCardBg} shadow-sm hover:shadow-xl cursor-pointer transform-gpu`}
        >
            {hasImage ? (
                job.image[0].toLowerCase().endsWith('.pdf') ? (
                    <PdfRenderer url={job.image[0]} isExpanded={isExpanded} priority={priority} />
                ) : (
                    <Image
                        src={job.image[0]}
                        alt={`${job.title} at ${job.company} - Muhammad Faran Aiki Portfolio`}
                        fill
                        priority={priority}
                        fetchPriority={priority ? "high" : "auto"}
                        quality={75}
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className={`object-cover transition-transform duration-700
                            ${isExpanded
                                ? (isDark ? 'scale-110 blur-sm brightness-[0.2]' : 'scale-110 blur-md opacity-20')
                                : 'group-hover:scale-105 opacity-60 group-hover:opacity-100'}`}
                    />
                )
            ) : (
                <div className={`absolute inset-0 transition-opacity duration-700 ${isExpanded ? 'blur-sm brightness-[0.3]' : 'opacity-40 group-hover:opacity-80'}`}>
                    <PlaceholderIcon company={job.company} />
                </div>
            )}

            <BookmarkButton
                itemType="experience"
                itemId={job.title}
                initialBookmarked={bookmarkedItemIds.includes(job.title)}
                isLoggedIn={!!isLoggedIn}
                className="absolute top-4 right-4 z-20"
            />

            {/* Base Content */}
            <div className={`absolute inset-0 p-6 flex flex-col justify-end transition-opacity duration-500
                bg-gradient-to-t from-theme-surface/95 via-theme-surface/40 to-transparent
                ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <p className="text-theme-500 text-xs font-bold mb-1">{job.year}</p>
                        <h3 className="text-lg md:text-xl font-black leading-tight mb-1 nav-active-gacor">
                            {job.title}
                            <TagBadge labels={job.tag} />
                        </h3>
                    </div>
                    <div className="flex items-start gap-2">
                        {job.url && (
                            <ExternalLink size={16} className="text-theme-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0" />
                        )}
                    </div>
                </div>
                <p className={`text-sm italic text-theme-muted`}>
                    {job.company}
                </p>
            </div>

            {/* Expanded Content (Overlay) */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className={`absolute inset-0 z-10 p-6 flex flex-col justify-center backdrop-blur-md
                            bg-theme-surface/90`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(false);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                e.stopPropagation();
                                setIsExpanded(false);
                            }
                        }}
                    >
                        <div className="overflow-y-auto max-h-full pr-2 custom-scrollbar" data-lenis-prevent>
                            <p className="text-theme-500 text-xs font-bold mb-2">{job.date}</p>
                            <h3 className="text-xl font-black mb-1 nav-active-gacor">{job.title}<TagBadge labels={job.tag} /></h3>
                            <p className={`text-sm italic mb-4 ${isDark ? 'text-theme-300' : 'text-theme-600'}`}>{job.company}</p>
                            <div className={`text-sm leading-relaxed text-foreground ${justifyClass}`}>
                                {Array.isArray(job.description) ? (
                                    <ul className="list-disc pl-5 space-y-1">
                                        {job.description.map((item, idx) => (
                                            <li key={idx}>{formatCJK(item, lang)}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    formatCJK(job.description, lang)
                                )}
                            </div>

                            {job.url && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(job.url, '_blank', 'noopener,noreferrer');
                                    }}
                                    className="mt-6 flex items-center gap-2 px-4 py-2 bg-theme-500 text-white rounded-full font-bold text-xs hover:bg-theme-600 transition-colors w-fit"
                                >
                                    <ExternalLink size={14} />
                                    Visit Project
                                </button>
                            )}
                        </div>

                        {/* Close hint */}
                        <div className={`absolute top-4 right-4 text-sm font-medium px-2 py-1 rounded-full
                            text-theme-muted bg-theme-surface-strong/50`}>
                            {click_to_close_text}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
});
BentoCard.displayName = 'BentoCard';
