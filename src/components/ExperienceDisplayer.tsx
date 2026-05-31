"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import HoverableWords from '@/components/HoverableWords';
import { useTheme } from 'next-themes';
import FadeInSection from '@/components/FadeInSection';
import { shimmer, toBase64, formatCJK } from '@/lib/utils';
import { useSettings } from './SettingsContext';
import { usePresentation } from './PresentationContext';
import { 
    LayoutPanelLeft, 
    Milestone, 
    LayoutGrid,
    Grid2X2,
    Rows
} from 'lucide-react';

import { motion } from 'framer-motion';
import { LayoutSwitcher, LayoutOption } from './LayoutSwitcher';

type Job = {
    date: string;
    title: string;
    company: string;
    description: string;
    image: string[];
    url?: string;
    year?: string;
};

type Experience = {
    year: string;
    jobs: Job[];
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
}

// --- Sub-components for stability ---

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

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onClick={() => setIsExpanded(!isExpanded)}
            className={`${spanClass} relative rounded-3xl overflow-hidden group border ${cardBorder} ${inactiveCardBg} shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer`}
        >
            {hasImage && (
                <Image 
                    src={job.image[0]} 
                    alt={job.company} 
                    fill 
                    className={`object-cover transition-all duration-700 
                        ${isExpanded 
                            ? (isDark ? 'scale-110 blur-sm brightness-[0.2]' : 'scale-110 blur-md opacity-20') 
                            : 'group-hover:scale-110 opacity-60 group-hover:opacity-100'}`} 
                />
            )}
            
            {/* Base Content */}
            <div className={`absolute inset-0 p-6 flex flex-col justify-end transition-opacity duration-500 
                ${hasImage ? (isDark ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent' : 'bg-gradient-to-t from-white/90 via-white/20 to-transparent') : ''}
                ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <p className="text-cyan-500 text-xs font-bold mb-1">{job.year}</p>
                <h3 className={`text-xl font-black leading-tight mb-1 ${isDark || (hasImage && !isExpanded) ? 'text-white' : 'text-gray-900'} ${!isDark && hasImage ? 'text-gray-900' : ''}`}>
                    <span className={!isDark && hasImage ? 'text-black' : ''}>{job.title}</span>
                </h3>
                <p className={`text-sm italic ${isDark || (hasImage && !isExpanded) ? 'text-gray-300' : 'text-gray-600'} ${!isDark && hasImage ? 'text-gray-800' : ''}`}>
                    {job.company}
                </p>
            </div>

            {/* Expanded Content (Overlay) */}
            <motion.div 
                initial={false}
                animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className={`absolute inset-0 z-10 p-6 flex flex-col justify-center backdrop-blur-md 
                    ${isDark ? 'bg-black/60' : 'bg-white/80'} 
                    ${isExpanded ? 'pointer-events-auto' : 'pointer-events-none'}`}
            >
                <div className="overflow-y-auto max-h-full pr-2 custom-scrollbar">
                    <p className="text-cyan-500 text-xs font-bold mb-2 uppercase tracking-widest">{job.date}</p>
                    <h3 className={`text-xl font-black mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{job.title}</h3>
                    <p className={`text-sm italic mb-4 ${isDark ? 'text-cyan-300' : 'text-cyan-600'}`}>{job.company}</p>
                    <div className={`text-sm leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-700'} ${justifyClass}`}>
                        {formatCJK(job.description, lang)}
                    </div>
                </div>
                
                {/* Close hint */}
                <div className={`absolute top-4 right-4 text-xs font-medium px-2 py-1 rounded-full 
                    ${isDark ? 'text-white/50 bg-white/10' : 'text-gray-500 bg-gray-200/50'}`}>
                    {click_to_close_text}
                </div>
            </motion.div>
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
    click_to_close_text = 'Click to close'
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
    const mainText = isDark ? 'text-white' : 'text-black';
    const descText = isDark ? 'text-gray-300' : 'text-gray-700';
    const activeCardBg = isDark ? 'bg-gray-800' : 'bg-gray-100 border-cyan-500';
    const inactiveCardBg = isDark ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white hover:bg-gray-50';
    const cardBorder = isDark ? 'border-transparent' : 'border-gray-200';
    const dateStyle = useMemo(() => ({ color: isDark ? '#9ca3af' : '#6b7280', opacity: 0.8 }), [isDark]);
    const companyStyle = useMemo(() => ({ color: isDark ? '#22d3ee' : '#0284c7' }), [isDark]);

    const isJustified = lang !== 'jp' && lang !== 'zh';
    const defaultJustifyClass = isJustified ? 'text-justify' : 'text-left';
    const justifyClass = textAlign === 'default' ? defaultJustifyClass : `text-${textAlign}`;
    const responsiveJustifyClass = textAlign === 'default' ? `text-center md:${justifyClass}` : justifyClass;

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

    // Pre-calculated shimmer to avoid re-calculating in render
    const shimmer600x400 = useMemo(() => `data:image/svg+xml;base64,${toBase64(shimmer(600, 400))}`, []);
    const shimmer400x225 = useMemo(() => `data:image/svg+xml;base64,${toBase64(shimmer(400, 225))}`, []);

    return (
        <div className="w-full h-full relative">
            {/* Flying Widgets - Hoisted to window level for true stickiness */}
            {!isPresentationMode && allJobs.length > 0 && (
                <LayoutSwitcher 
                    currentLayout={currentLayout} 
                    setCurrentLayout={setCurrentLayout} 
                    isDark={isDark} 
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
                <div className={`fixed bottom-8 left-8 z-[100] flex items-center p-1.5 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 ${isDark ? 'bg-gray-900/90 border-gray-700 ring-1 ring-white/10' : 'bg-white/90 border-gray-200 ring-1 ring-black/5'}`}>
                    <div className="flex gap-1">
                        {[
                            { id: 'modern', icon: <LayoutPanelLeft size={18} />, label: 'Modern' },
                            { id: 'split', icon: <Rows size={18} />, label: 'Cinematic' },
                            { id: 'minimal', icon: <div className="w-[18px] h-[18px] border-2 border-current rounded-sm flex items-center justify-center font-bold text-[10px] leading-none">E</div>, label: 'Editorial' }
                        ].map((l) => (
                            <button
                                key={l.id}
                                onClick={() => setPresentationLayout(l.id as PresentationLayoutType)}
                                title={l.label}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    presentationLayout === l.id
                                        ? 'bg-cyan-500 text-white shadow-md scale-105'
                                        : isDark 
                                            ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' 
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
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
                            {/* 1. Modern (Original Side-by-Side) */}
                            {presentationLayout === 'modern' && (
                                <div className={`${isDark ? 'text-white' : 'text-gray-900'} w-full h-full px-4 md:px-8 flex flex-col md:flex-row print:flex-row gap-4 md:gap-12 items-center justify-center mx-auto pt-16 pb-8`}>
                                    <div className="flex-[1.2] flex flex-col justify-center space-y-6 max-w-2xl print:max-w-none">
                                        <div className="space-y-2">
                                            <h2 className="text-cyan-500 font-bold text-xl md:text-2xl tracking-tight">{job.year}</h2>
                                            <h3 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter">{job.title}</h3>
                                            <h4 style={companyStyle} className="text-xl md:text-2xl italic opacity-90">{job.company}</h4>
                                            <p style={dateStyle} className="text-base md:text-lg font-medium italic">{job.date}</p>
                                        </div>
                                        <HoverableWords className={`text-base md:text-lg ${justifyClass} ${descText} font-medium`}>
                                            {job.description}
                                        </HoverableWords>
                                    </div>
                                    {job.image && job.image.length > 0 && (
                                        <div className="flex-[0.8] flex justify-center items-center w-full h-full transform-gpu">
                                            <div className="relative w-full h-full max-w-[400px] max-h-[400px] flex justify-center items-center overflow-hidden transform-gpu">
                                                <Image
                                                    src={job.image[0]}
                                                    alt={job.company}
                                                    fill
                                                    className="object-contain transition-transform duration-700 hover:scale-[1.03] scale-[1.01]"
                                                    sizes="(max-width: 768px) 100vw, 400px"
                                                    priority={idx < 2}
                                                    loading={idx < 2 ? "eager" : "lazy"}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 2. Cinematic (Full-bleed Background) */}
                            {presentationLayout === 'split' && (
                                <div className="w-full h-full relative overflow-hidden flex items-end">
                                    {job.image && job.image.length > 0 ? (
                                        <div className="absolute inset-0 z-0">
                                            <Image 
                                                src={job.image[0]} 
                                                alt={job.company} 
                                                fill 
                                                className={`object-cover transition-all duration-1000 ${isDark ? 'brightness-[0.35]' : 'brightness-[1.1] grayscale-[0.2] opacity-20'}`} 
                                                priority={idx < 2} 
                                            />
                                            <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-black via-black/40 to-transparent' : 'bg-gradient-to-t from-white via-white/40 to-transparent'}`} />
                                        </div>
                                    ) : (
                                        <div className={`absolute inset-0 z-0 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`} />
                                    )}
                                    
                                    <div className="relative z-10 w-full max-w-6xl mx-auto p-8 md:p-16 mb-16">
                                        <div className="flex flex-col md:flex-row items-end justify-between gap-12">
                                            <div className="flex-1 space-y-6">
                                                <div className="flex items-center gap-4">
                                                    <span className="w-16 h-1.5 bg-cyan-500 rounded-full" />
                                                    <h2 className="text-cyan-500 font-black text-2xl uppercase tracking-[0.4em]">{job.year}</h2>
                                                </div>
                                                <h3 className={`text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>{job.title}</h3>
                                                <p className="text-2xl md:text-4xl text-cyan-500/90 font-bold italic tracking-tight">{job.company}</p>
                                            </div>
                                            <div className="flex-1 max-w-xl">
                                                <div className={`p-1 rounded-sm mb-4 inline-block ${isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-700'} text-xs font-black px-2 py-0.5 tracking-widest uppercase`}>
                                                    {job.date}
                                                </div>
                                                <HoverableWords className={`text-xl md:text-2xl leading-relaxed font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                                    {job.description}
                                                </HoverableWords>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 3. Editorial (Bold Typography) */}
                            {presentationLayout === 'minimal' && (
                                <div className={`w-full h-full flex items-center justify-center p-8 md:p-16 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-white'}`}>
                                    {/* Background Decorative Text */}
                                    <div className={`absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none opacity-[0.04] overflow-hidden select-none transition-opacity duration-700`}>
                                        <span className={`text-[45vw] font-black leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>{job.year}</span>
                                    </div>

                                    <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-16 items-center relative z-10">
                                        <div className="md:col-span-7 space-y-10">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <p className="text-cyan-500 font-black text-xl tracking-[0.2em] uppercase">{job.date}</p>
                                                    <span className="flex-grow h-px bg-cyan-500/30" />
                                                </div>
                                                <h3 className={`text-7xl md:text-9xl font-black ${isDark ? 'text-white' : 'text-gray-950'} leading-[0.85] tracking-tighter`}>
                                                    {job.title}
                                                </h3>
                                                <p className="text-3xl md:text-4xl font-bold text-cyan-600/90 italic tracking-tight">{job.company}</p>
                                            </div>
                                            <div className="max-w-2xl">
                                                <HoverableWords className={`text-2xl md:text-3xl leading-snug font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {job.description}
                                                </HoverableWords>
                                            </div>
                                        </div>
                                        
                                        {job.image && job.image.length > 0 && (
                                            <div className="md:col-span-5 relative group">
                                                <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] transition-all duration-700 group-hover:rotate-0 rotate-3 group-hover:scale-105">
                                                    <Image src={job.image[0]} alt={job.company} fill className="object-cover" />
                                                </div>
                                                {/* Decorative Elements */}
                                                <div className={`absolute -bottom-6 -left-6 w-32 h-32 border-b-[6px] border-l-[6px] border-cyan-500 rounded-bl-4xl -z-10 transition-transform duration-500 group-hover:-translate-x-2 group-hover:translate-y-2`} />
                                                <div className={`absolute -top-6 -right-6 w-32 h-32 border-t-[6px] border-r-[6px] border-cyan-500 rounded-tr-4xl -z-10 transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2`} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </FadeInSection>
                    ))
                ) : (
                    <div className={`${mounted ? (isDark ? 'text-white' : 'text-gray-900') : 'text-gray-900'} min-h-screen p-4 sm:p-8 md:p-12 w-full transition-colors duration-300`}>
                        <div className="container mx-auto max-w-6xl pt-16">
                            {currentLayout === 'original' && (
                            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                                <div className="w-full md:w-1/2">
                                    {experiences.map((experience) => (
                                        <div key={experience.year} className={`mb-12 ${responsiveJustifyClass} cursor-pointer`}>
                                            <h2 className={`transition-[transform] hover:scale-105 text-2xl font-bold ${mainText} mb-6 top-0 py-2`}>
                                                {experience.year}
                                            </h2>
                                            <div className="space-y-4">
                                                {experience.jobs.map((job, index) => (
                                                    <motion.div
                                                        key={`${experience.year}-${index}`}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                                        onMouseEnter={() => handleJobChange(job)}
                                                        onFocus={() => handleJobChange(job)}
                                                        tabIndex={0}
                                                        className={`p-6 rounded-lg cursor-pointer border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500
                                                            ${activeJob.title === job.title && activeJob.company === job.company
                                                                ? `${activeCardBg}`
                                                                : `${inactiveCardBg} ${cardBorder} hover:border-cyan-500/50`
                                                            }`}
                                                    >
                                                        <p style={dateStyle} className="text-sm mb-1">{job.date}</p>
                                                        {job.url ? (
                                                            <a href={job.url} target="_blank" rel="noopener noreferrer" className="block w-fit">
                                                                <h3 className={`text-xl font-bold ${mainText} hover:text-cyan-500 underline decoration-dotted decoration-cyan-500/50`}>{job.title}</h3>
                                                            </a>
                                                        ) : (
                                                            <h3 className={`text-xl font-bold ${mainText}`}>{job.title}</h3>
                                                        )}
                                                        <p style={companyStyle} className="italic mb-3">{job.company}</p>
                                                        <HoverableWords className={`${justifyClass} ${descText}`}>
                                                            {formatCJK(job.description, lang)}
                                                        </HoverableWords>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="hidden md:block w-1/2">
                                    <div className="sticky top-32 flex justify-center">
                                        {hasValidImage && (
                                            <div className="w-full">
                                                <div className="relative w-full max-w-[600px] aspect-[3/2] mx-auto shadow-2xl overflow-hidden rounded-lg">
                                                    <Image
                                                        fill
                                                        src={activeImageSrc!}
                                                        placeholder="blur"
                                                        blurDataURL={shimmer600x400}
                                                        alt={`${activeJob.company} preview`}
                                                        className="object-cover"
                                                        priority
                                                    />
                                                </div>
                                                <div className="mt-4 text-center">
                                                    <h3 className={`text-2xl font-black ${mainText}`}>{activeJob.title}</h3>
                                                    <p style={companyStyle} className="text-lg italic">{activeJob.company}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentLayout === 'timeline' && (
                            <div className="relative border-l-2 border-cyan-500/30 ml-4 md:ml-8 space-y-12">
                                {experiences.map((experience) => (
                                    <div key={experience.year} className="relative pl-8">
                                        <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-cyan-500 border-4 border-white dark:border-gray-900 shadow-sm" />
                                        <h2 className={`text-3xl font-black ${mainText} mb-8`}>{experience.year}</h2>
                                        <div className="space-y-12">
                                            {experience.jobs.map((job, index) => (
                                                <motion.div 
                                                    key={`${experience.year}-${index}`} 
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                                    className="flex flex-col md:flex-row gap-6"
                                                >
                                                    {job.image && job.image.length > 0 && (
                                                        <div className="w-full md:w-1/3 shrink-0">
                                                            <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
                                                                <Image src={job.image[0]} alt={job.company} fill className="object-cover" placeholder="blur" blurDataURL={shimmer400x225} />
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <p style={dateStyle} className="text-sm mb-1">{job.date}</p>
                                                        <h3 className={`text-2xl font-bold ${mainText} mb-1`}>{job.title}</h3>
                                                        <p style={companyStyle} className="text-lg font-semibold italic mb-4">{job.company}</p>
                                                        <HoverableWords className={`${justifyClass} ${descText}`}>
                                                            {formatCJK(job.description, lang)}
                                                        </HoverableWords>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {currentLayout === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {allJobs.map((job, idx) => (
                                    <motion.div 
                                        key={`${job.year}-${idx}`}
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        whileHover={{ y: -8 }}
                                        className={`flex flex-col p-6 rounded-2xl border ${cardBorder} ${inactiveCardBg} group shadow-sm hover:shadow-2xl transition-shadow duration-300`}
                                    >
                                        <div className="relative aspect-video mb-6 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
                                            {job.image && job.image.length > 0 ? (
                                                <Image src={job.image[0]} alt={job.company} fill className="object-cover" placeholder="blur" blurDataURL={shimmer400x225} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                            )}
                                        </div>
                                        <p style={dateStyle} className="text-xs font-medium mb-1">{job.date}</p>
                                        <h3 className={`text-xl font-black ${mainText} mb-1 line-clamp-1`}>{job.title}</h3>
                                        <p style={companyStyle} className="text-sm italic mb-4">{job.company}</p>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {currentLayout === 'bento' && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px]">
                                {allJobs.map((job, idx) => {
                                    const spans = [
                                        "md:col-span-2 md:row-span-2", // Big square
                                        "md:col-span-2 md:row-span-1", // Wide
                                        "md:col-span-1 md:row-span-1", // Small
                                        "md:col-span-1 md:row-span-1", // Small
                                        "md:col-span-1 md:row-span-1", // Small
                                        "md:col-span-3 md:row-span-1", // Very Wide
                                        "md:col-span-2 md:row-span-1", // Wide
                                        "md:col-span-2 md:row-span-2", // Big square
                                    ];
                                    const spanClass = spans[idx % spans.length];
                                    
                                    return (
                                        <BentoCard 
                                            key={`${job.year}-${idx}`}
                                            job={job}
                                            spanClass={spanClass}
                                            cardBorder={cardBorder}
                                            inactiveCardBg={inactiveCardBg}
                                            isDark={isDark}
                                            lang={lang}
                                            justifyClass={justifyClass}
                                            click_to_close_text={click_to_close_text}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {currentLayout === 'smooth' && (
                            <div className="space-y-24 max-w-4xl mx-auto">
                                {allJobs.map((job, idx) => (
                                    <motion.div
                                        key={`${job.year}-${idx}`}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        className="group"
                                    >
                                        <div className="flex flex-col md:flex-row gap-8 items-center">
                                            <div className="w-full md:w-1/2 space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <span className="h-px w-12 bg-cyan-500"></span>
                                                    <p style={dateStyle} className="text-sm font-bold tracking-widest uppercase">{job.date}</p>
                                                </div>
                                                <h3 className={`text-4xl md:text-5xl font-black ${mainText} leading-tight`}>{job.title}</h3>
                                                <p style={companyStyle} className="text-xl font-medium italic opacity-80">{job.company}</p>
                                                <HoverableWords className={`${justifyClass} ${descText} text-lg leading-relaxed`}>
                                                    {formatCJK(job.description, lang)}
                                                </HoverableWords>
                                            </div>
                                            {job.image && job.image.length > 0 && (
                                                <div className="w-full md:w-1/2">
                                                    <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                                                        <Image src={job.image[0]} alt={job.company} fill className="object-cover" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}
