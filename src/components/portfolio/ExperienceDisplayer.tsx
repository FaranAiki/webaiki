"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import HoverableWords from '@/components/shared/HoverableWords';
import { useTheme } from 'next-themes';
import FadeInSection from '@/components/shared/FadeInSection';
import { shimmer, toBase64, formatCJK } from '@/lib/utils';
import { useSettings } from '../providers/SettingsContext';
import { usePresentation } from '../providers/PresentationContext';
import {
    LayoutPanelLeft,
    Milestone,
    LayoutGrid,
    Grid2X2,
    Rows,
    ExternalLink,
    Briefcase
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { LayoutSwitcher } from '../shared/LayoutSwitcher';

export type Job = {
    date: string;
    title: string;
    company: string;
    description: string;
    image: string[];
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
}


// --- Sub-components for stability ---

const TagBadge = ({ labels }: { labels?: string[] }) => {
    if (!labels || labels.length === 0) return null;
    const limitedLabels = labels.slice(0, 3);
    return (
        <div className="inline-flex flex-wrap gap-1 ml-2 align-middle">
            {limitedLabels.map((label, idx) => (
                <span key={idx} className="inline-block px-1.5 py-0.5 text-[9px] font-black rounded-md bg-theme-500/10 text-theme-500 border border-theme-500/20 tracking-wider">
                    {label}
                </span>
            ))}
            {labels.length > 3 && (
                <span className="text-[9px] font-bold text-theme-muted opacity-50">+{labels.length - 3}</span>
            )}
        </div>
    );
};


const PlaceholderIcon = ({ company }: { company: string }) => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-theme-surface-strong via-theme-surface to-theme-bg p-8">
        <div className="p-5 rounded-full bg-theme-surface/50 mb-4 shadow-theme-shadow">
            <Briefcase size={48} className="text-theme-500" />
        </div>
        <p className="text-xs font-black tracking-[0.2em] text-[var(--text-muted)] text-center px-4">
            {company}
        </p>
    </div>
);

interface BentoCardProps {
    job: Job;
    spanClass: string;
    cardBorder: string;
    inactiveCardBg: string;
    isDark: boolean;
    lang: string;
    justifyClass: string;
    click_to_close_text: string;
}

const BentoCard = ({ job, spanClass, cardBorder, inactiveCardBg, isDark, lang, justifyClass, click_to_close_text }: BentoCardProps) => {
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
                <Image
                    src={job.image[0]}
                    alt={job.company}
                    fill
                    className={`object-cover transition-transform duration-700
                        ${isExpanded
                            ? (isDark ? 'scale-110 blur-sm brightness-[0.2]' : 'scale-110 blur-md opacity-20')
                            : 'group-hover:scale-105 opacity-60 group-hover:opacity-100'}`}
                />
            ) : (
                <div className={`absolute inset-0 transition-opacity duration-700 ${isExpanded ? 'blur-sm brightness-[0.3]' : 'opacity-40 group-hover:opacity-80'}`}>
                    <PlaceholderIcon company={job.company} />
                </div>
            )}

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
                    {job.url && (
                        <ExternalLink size={16} className="text-theme-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0" />
                    )}
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
                                {formatCJK(job.description, lang)}
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
};
BentoCard.displayName = 'BentoCard';

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
    editorial_text = 'Editorial'
}: ExperiencesClientProps) {
    const [currentLayout, setCurrentLayout] = useState<LayoutType>(layout);
    const [presentationLayout, setPresentationLayout] = useState<PresentationLayoutType>('modern');
    const [activeJob, setActiveJob] = useState(experiences[0].jobs[0]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { resolvedTheme } = useTheme();
    const { textAlign } = useSettings();
    const [mounted, setMounted] = useState(false);
    const { isPresentationMode } = usePresentation();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!activeJob?.image || activeJob.image.length <= 1) {
            return;
        }
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % activeJob.image.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [activeJob]);

    const isDark = mounted && resolvedTheme === 'dark';
    const mainText = "text-foreground";
    const descText = "text-foreground/80 dark:text-foreground/70";
    const activeCardBg = "bg-theme-surface-strong border-theme-500";
    const inactiveCardBg = "bg-theme-surface hover:bg-theme-surface-strong";
    const cardBorder = "border-theme-border";
    const dateStyle = useMemo(() => ({ opacity: 0.8 }), []);

    const isJustified = lang !== 'jp' && lang !== 'zh';
    const defaultJustifyClass = isJustified ? 'text-justify' : 'text-left';
    const justifyClass = textAlign === 'default' ? defaultJustifyClass : `text-${textAlign}`;

    const activeImageSrc = useMemo(() => {
        const idx = (activeJob?.image && currentImageIndex < activeJob.image.length) ? currentImageIndex : 0;
        return activeJob?.image?.[idx];
    }, [activeJob, currentImageIndex]);

    const hasValidImage = !!activeImageSrc;
    const allJobs = useMemo(() => experiences.flatMap(exp => exp.jobs.map(job => ({ ...job, year: exp.year }))), [experiences]);

    const handleJobChange = (job: Job) => {
        if (activeJob.title !== job.title || activeJob.company !== job.company) {
            setActiveJob(job);
            setCurrentImageIndex(0);
        }
    };

    const shimmer600x400 = useMemo(() => `data:image/svg+xml;base64,${toBase64(shimmer(600, 400))}`, []);
    const shimmer400x225 = useMemo(() => `data:image/svg+xml;base64,${toBase64(shimmer(400, 225))}`, []);

    return (
        <div className="w-full h-full relative">
            {!isPresentationMode && allJobs.length > 0 && (
                <LayoutSwitcher
                    currentLayout={currentLayout}
                    setCurrentLayout={setCurrentLayout}
                    canChange={canChange}
                    options={[
                        { id: 'original', icon: <LayoutPanelLeft size={18} />, label: original_text },
                        { id: 'timeline', icon: <Milestone size={18} />, label: timeline_text },
                        { id: 'grid', icon: <LayoutGrid size={18} />, label: grid_text },
                        { id: 'bento', icon: <Grid2X2 size={18} />, label: bento_text || 'Bento' },
                        { id: 'smooth', icon: <Rows size={18} />, label: smooth_text || 'Smooth' }
                    ]}
                />
            )}

            {isPresentationMode && (
                <div className={`fixed bottom-8 left-8 z-[100] flex items-center p-1.5 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 border-theme-border ring-1 ring-black/5 dark:ring-white/10 print:hidden`}>
                    <div className="flex gap-1">
                        {[
                            { id: 'modern', icon: <LayoutPanelLeft size={18} />, label: modern_text || 'Modern' },
                            { id: 'split', icon: <Rows size={18} />, label: cinematic_text || 'Cinematic' },
                            { id: 'minimal', icon: <div className="w-[18px] h-[18px] border-2 border-current rounded-sm flex items-center justify-center font-bold text-sm leading-none">E</div>, label: editorial_text || 'Editorial' }
                        ].map((l) => (
                            <button
                                key={l.id}
                                onClick={() => setPresentationLayout(l.id as PresentationLayoutType)}
                                title={l.label}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    presentationLayout === l.id
                                        ? 'bg-theme-500 text-white shadow-md scale-105'
                                        : 'text-theme-muted hover:text-theme-500 hover:bg-theme-surface-strong'
                                }`}
                            >
                                {l.icon}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className={`w-full h-full ${isPresentationMode ? 'presentation-container' : ''}`}>
                {isPresentationMode ? (
                    allJobs.map((job, idx) => (
                        <FadeInSection
                            key={`pres-${idx}`}
                            className="w-full h-full flex-shrink-0"
                            slideIndex={idx + 1}
                            totalSlides={allJobs.length}
                        >
                            {/* 1. Modern */}
                            {presentationLayout === 'modern' && (
                                <div className={`text-foreground w-full h-full px-4 md:px-8 flex flex-col md:flex-row print:flex-row gap-4 md:gap-12 items-center justify-center mx-auto pt-20 pb-10`}>
                                    <div className="flex-[1.2] flex flex-col justify-center space-y-6 max-w-2xl print:max-w-none">
                                        <div className="space-y-2">
                                            <h2 className="text-theme-600 dark:text-theme-400 font-bold text-xl md:text-2xl tracking-tight">{job.year}</h2>
                                            <h3 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter text-foreground">{job.title}<TagBadge labels={job.tag} /></h3>
                                            <h4 className="text-theme-600 dark:text-theme-400 text-xl md:text-2xl italic opacity-90">{job.company}</h4>
                                            <p style={dateStyle} className="text-base md:text-lg font-medium italic text-muted-foreground">{job.date}</p>
                                        </div>
                                        <HoverableWords className={`text-base md:text-lg ${justifyClass} ${descText} font-medium`}>
                                            {job.description}
                                        </HoverableWords>

                                        {job.url && (
                                            <a href={job.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-theme-500 text-white rounded-full font-bold text-sm hover:bg-theme-600 transition-all w-fit shadow-lg hover:scale-105">
                                                <ExternalLink size={18} />
                                                Visit Project
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex-[0.8] flex justify-center items-center w-full h-full transform-gpu">
                                        <div className="relative w-full h-full max-w-[400px] max-h-[400px] aspect-square flex justify-center items-center overflow-hidden transform-gpu rounded-3xl">
                                            {job.image && job.image.length > 0 ? (
                                                <Image src={job.image[0]} alt={job.company} fill className="object-contain transition-transform duration-700 hover:scale-[1.03] scale-[1.01]" sizes="(max-width: 768px) 100vw, 400px" priority={true} loading="eager" />
                                            ) : (
                                                <PlaceholderIcon company={job.company} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 2. Cinematic */}
                            {presentationLayout === 'split' && (
                                <div className="w-full h-full relative overflow-hidden flex items-end bg-theme-bg/30">
                                    {job.image && job.image.length > 0 ? (
                                        <div className="absolute inset-0 z-0">
                                            <Image src={job.image[0]} alt={job.company} fill sizes="100vw" className={`object-cover transition-all duration-1000 dark:brightness-[0.35] brightness-[1.1] grayscale-[0.2] opacity-20`} priority={true} loading="eager" />
                                            <div className={`absolute inset-0 bg-gradient-to-t from-theme-bg-dark via-transparent to-transparent`} />
                                        </div>
                                    ) : (
                                        <div className={`absolute inset-0 z-0 bg-theme-bg dark:bg-theme-bg-dark flex items-center justify-center opacity-10`}>
                                            <Briefcase size={400} className="text-theme-500" />
                                        </div>
                                    )}

                                    <div className="relative z-10 w-full max-w-6xl mx-auto p-8 md:p-16 mb-16">
                                        <div className="flex flex-col md:flex-row items-end justify-between gap-12">
                                            <div className="flex-1 space-y-6">
                                                <div className="flex items-center gap-4">
                                                    <span className="w-16 h-1.5 bg-theme-500 rounded-full" />
                                                    <h2 className="text-theme-600 dark:text-theme-400 font-black text-2xl tracking-tight">{job.year}</h2>
                                                </div>
                                                <h3 className={`text-3xl md:text-5xl font-black leading-[0.85] tracking-tighter text-foreground`}>{job.title}<TagBadge labels={job.tag} /></h3>
                                                <p className="text-xl md:text-3xl text-theme-600 dark:text-theme-400 font-bold italic tracking-tight">{job.company}</p>

                                                {job.url && (
                                                    <a href={job.url} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center gap-2 px-6 py-3 bg-theme-500 text-white rounded-full font-bold text-sm hover:bg-theme-600 transition-all w-fit shadow-theme-shadow">
                                                        <ExternalLink size={18} />
                                                        Visit Project
                                                    </a>
                                                )}
                                                </div>
                                                <div className="flex-1 max-w-xl">
                                                <div className={`p-1 rounded-sm mb-4 inline-block bg-theme-surface-strong text-theme-700 dark:text-theme-300 text-xs font-black px-2 py-0.5`}>
                                                    {job.date}
                                                </div>
                                                <HoverableWords className={`text-lg md:text-xl leading-relaxed font-medium text-foreground`}>
                                                    {formatCJK(job.description, lang)}
                                                </HoverableWords>
                                                </div>
                                                </div>
                                                </div>
                                                </div>
                                                )}

                                                {/* 3. Editorial */}
                                                {presentationLayout === 'minimal' && (
                                                <div className={`w-full h-full flex items-center justify-center p-8 md:p-16 relative overflow-hidden transition-colors duration-500`}>
                                                <div className={`absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none opacity-[0.04] overflow-hidden select-none transition-opacity duration-700`}>
                                                <span className={`text-[35vw] font-black leading-none text-theme-500`}>{job.year}</span>
                                                </div>

                                                <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-16 items-center relative z-10">
                                                <div className="md:col-span-7 space-y-10">
                                                <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <p className="text-theme-600 dark:text-theme-400 font-black text-xl tracking-tight">{job.date}</p>
                                                    <span className="flex-grow h-px bg-theme-500/30" />
                                                </div>
                                                <h3 className={`text-3xl md:text-5xl font-black text-foreground leading-[0.85] tracking-tighter`}>
                                                    {job.title}
                                                    <TagBadge labels={job.tag} />
                                                </h3>
                                                <p className="text-2xl md:text-3xl font-bold text-theme-600 dark:text-theme-400 italic tracking-tight">{job.company}</p>
                                                </div>

                                            <div className="max-w-2xl">
                                                <HoverableWords className={`text-xl md:text-2xl leading-snug font-medium text-foreground`}>
                                                    {job.description}
                                                </HoverableWords>

                                                {job.url && (
                                                    <a href={job.url} target="_blank" rel="noopener noreferrer" className="mt-10 flex items-center gap-2 px-8 py-4 bg-theme-500 text-white rounded-full font-black text-base hover:bg-theme-600 transition-all w-fit shadow-theme-shadow hover:scale-105">
                                                        <ExternalLink size={20} />
                                                        Explore Now
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className="md:col-span-5 relative group">
                                            <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-theme-shadow transition-all duration-700 group-hover:rotate-0 rotate-3 group-hover:scale-105">
                                                {job.image && job.image.length > 0 ? (
                                                    <Image src={job.image[0]} alt={job.company} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                                                ) : (
                                                    <PlaceholderIcon company={job.company} />
                                                )}
                                            </div>
                                            <div className={`absolute -bottom-6 -left-6 w-32 h-32 border-b-[6px] border-l-[6px] border-theme-500 rounded-bl-4xl -z-10 transition-transform duration-500 group-hover:-translate-x-2 group-hover:translate-y-2`} />
                                            <div className={`absolute -top-6 -right-6 w-32 h-32 border-t-[6px] border-r-[6px] border-theme-500 rounded-tr-4xl -z-10 transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2`} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </FadeInSection>
                    ))
                ) : (
                    <div className={`min-h-screen p-4 sm:p-8 md:p-12 w-full transition-colors duration-300 text-foreground`}>
                        <div className="container mx-auto max-w-6xl">
                            {currentLayout === 'original' && (
                            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                                <div className="w-full md:w-1/2">
                                    {experiences.map((experience) => (
                                        <div key={experience.year} className={`mb-12`}>
                                            <h2 className={`transition-transform duration-300 hover:scale-105 text-2xl font-bold text-theme-600 dark:text-theme-400 mb-6 py-2 cursor-pointer`}>
                                                {experience.year}
                                            </h2>
                                            <motion.div 
                                                className="space-y-4"
                                                initial="hidden"
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
                                                        onMouseEnter={() => handleJobChange(job)}
                                                        role={job.url ? "button" : "article"}
                                                        tabIndex={job.url ? 0 : undefined}
                                                        className={`p-6 rounded-lg border-2 shadow-sm group transform-gpu ${job.url ? 'cursor-pointer' : ''}
                                                            ${activeJob.title === job.title && activeJob.company === job.company
                                                                ? `${activeCardBg}`
                                                                : `${inactiveCardBg} ${cardBorder} hover:border-theme-500/50`
                                                            }`}
                                                    >
                                                        <p className="text-xs mb-1 text-muted-foreground">{job.date}</p>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <h3 className={`text-xl font-bold ${mainText} group-hover:text-theme-500 ${job.url ? 'underline decoration-dotted decoration-theme-500/30' : ''}`}>{job.title}<TagBadge labels={job.tag} /></h3>
                                                            {job.url && <ExternalLink size={14} className="text-theme-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                                        </div>
                                                        <p className="text-theme-600 dark:text-theme-400 italic mb-3">{job.company}</p>
                                                        <HoverableWords className={`${justifyClass} ${descText} text-sm`}>
                                                            {formatCJK(job.description, lang)}
                                                        </HoverableWords>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        </div>
                                    ))}
                                </div>
                                <div className="hidden md:block w-1/2">
                                    <div className="sticky top-32 flex justify-center">
                                        <div className="w-full">
                                            <div className="relative w-full max-w-[600px] aspect-[3/2] mx-auto shadow-2xl overflow-hidden rounded-lg bg-theme-surface-strong">
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
                                                            <Image fill sizes="(max-width: 768px) 100vw, 50vw" src={activeImageSrc!} placeholder="blur" blurDataURL={shimmer600x400} alt={`${activeJob.company}`} className="object-cover" priority />
                                                        ) : (
                                                            <PlaceholderIcon company={activeJob.company} />
                                                        )}
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>
                                            <div className="mt-4 text-center">
                                                <h3 className={`text-2xl font-black ${mainText}`}>{activeJob.title}<TagBadge labels={activeJob.tag} /></h3>
                                                <p className="text-lg italic text-theme-600 dark:text-theme-400">{activeJob.company}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentLayout === 'timeline' && (
                            <div className="relative border-l-2 border-theme-500/30 ml-4 md:ml-8 space-y-12">
                                {experiences.map((experience) => (
                                    <div key={experience.year} className="relative pl-8">
                                        <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-theme-500 border-4 border-theme-surface dark:border-theme-bg-dark shadow-sm" />
                                        <h2 className="text-3xl font-black text-theme-600 dark:text-theme-400 mb-8">{experience.year}</h2>
                                        <motion.div 
                                            className="space-y-12"
                                            initial="hidden"
                                            whileInView="show"
                                            viewport={{ once: true, margin: "-50px" }}
                                            variants={{
                                                hidden: {},
                                                show: { transition: { staggerChildren: 0.15 } }
                                            }}
                                        >
                                            {experience.jobs.map((job, index) => (
                                                <motion.div
                                                    key={`${experience.year}-${index}`}
                                                    id={`exp-${job.title.toLowerCase().replace(/\s+/g, '-')}`}
                                                    variants={{
                                                        hidden: { opacity: 0, x: -20 },
                                                        show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
                                                    }}
                                                    onClick={() => job.url && window.open(job.url, '_blank', 'noopener,noreferrer')}
                                                    onKeyDown={(e) => e.key === 'Enter' && job.url && window.open(job.url, '_blank', 'noopener,noreferrer')}
                                                    role={job.url ? "button" : "article"}
                                                    tabIndex={job.url ? 0 : undefined}
                                                    className={`flex flex-col md:flex-row gap-6 group transform-gpu ${job.url ? 'cursor-pointer' : ''}`}
                                                >
                                                    <div className="w-full md:w-1/3 shrink-0">
                                                        <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-theme-border bg-theme-surface-strong">
                                                            {job.image && job.image.length > 0 ? (
                                                                <Image src={job.image[0]} alt={job.company} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform group-hover:scale-105" placeholder="blur" blurDataURL={shimmer400x225} />
                                                            ) : (
                                                                <PlaceholderIcon company={job.company} />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs mb-1 text-muted-foreground">{job.date}</p>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className={`text-2xl font-bold ${mainText} group-hover:text-theme-500`}>{job.title}<TagBadge labels={job.tag} /></h3>
                                                            {job.url && <ExternalLink size={16} className="text-theme-500 opacity-0 group-hover:opacity-100 transition-all" />}
                                                        </div>
                                                        <p className="text-lg font-semibold italic text-theme-600 dark:text-theme-400 mb-4">{job.company}</p>
                                                        <HoverableWords className={`${justifyClass} ${descText} text-sm`}>
                                                            {formatCJK(job.description, lang)}
                                                        </HoverableWords>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {currentLayout === 'grid' && (
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
                                                <Image src={job.image[0]} alt={job.company} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform group-hover:scale-105" placeholder="blur" blurDataURL={shimmer400x225} />
                                            ) : (
                                                <PlaceholderIcon company={job.company} />
                                            )}
                                        </div>
                                        <p className="text-xs mb-1 text-muted-foreground">{job.date}</p>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className={`text-xl font-black ${mainText} group-hover:text-theme-500`}>{job.title}<TagBadge labels={job.tag} /></h3>
                                            {job.url && <ExternalLink size={14} className="text-theme-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />}
                                        </div>
                                        <p className="text-sm italic text-theme-600 dark:text-theme-400 mb-4">{job.company}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {currentLayout === 'bento' && (
                            <motion.div 
                                className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px]"
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, margin: "-50px" }}
                                variants={{
                                    hidden: {},
                                    show: { transition: { staggerChildren: 0.08 } }
                                }}
                            >
                                {allJobs.map((job, idx) => {
                                    const spans = ["md:col-span-2 md:row-span-2", "md:col-span-2 md:row-span-1", "md:col-span-1 md:row-span-1", "md:col-span-1 md:row-span-1", "md:col-span-1 md:row-span-1", "md:col-span-3 md:row-span-1", "md:col-span-2 md:row-span-1", "md:col-span-2 md:row-span-2"];
                                    const spanClass = spans[idx % spans.length];
                                    return (
                                        <BentoCard key={`${job.year}-${idx}`} job={job} spanClass={spanClass} cardBorder={cardBorder} inactiveCardBg={inactiveCardBg} isDark={isDark} lang={lang} justifyClass={justifyClass} click_to_close_text={click_to_close_text} />
                                    );
                                })}
                            </motion.div>
                        )}

                        {currentLayout === 'smooth' && (
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
                                                    <p className="text-sm font-bold text-muted-foreground">{job.date}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className={`text-4xl md:text-5xl font-black ${mainText} group-hover:text-theme-500 leading-tight transition-colors`}>{job.title}<TagBadge labels={job.tag} /></h3>
                                                    {job.url && <ExternalLink size={24} className="text-theme-500 opacity-0 group-hover:opacity-100 transition-all translate-y-2" />}
                                                </div>
                                                <p className="text-xl font-medium italic text-theme-600 dark:text-theme-400 opacity-80">{job.company}</p>
                                                <HoverableWords className={`${justifyClass} ${descText} text-lg leading-relaxed`}>
                                                    {formatCJK(job.description, lang)}
                                                </HoverableWords>
                                            </div>
                                            <div className="w-full md:w-1/2">
                                                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] bg-theme-surface-strong">
                                                    {job.image && job.image.length > 0 ? (
                                                        <Image src={job.image[0]} alt={job.company} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                                                    ) : (
                                                        <PlaceholderIcon company={job.company} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}
