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
    LayoutGrid 
} from 'lucide-react';

import { motion } from 'framer-motion';

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

export type LayoutType = 'original' | 'timeline' | 'grid';

interface ExperiencesClientProps {
    experiences: Experience[];
    lang?: string;
    layout?: LayoutType;
    canChange?: boolean;
    original_text?: string;
    timeline_text?: string;
    grid_text?: string;
}

// --- Sub-components for stability ---

interface LayoutSwitcherProps {
    currentLayout: LayoutType;
    setCurrentLayout: (layout: LayoutType) => void;
    isDark: boolean;
    canChange: boolean;
    labels: {
        original: string;
        timeline: string;
        grid: string;
    };
}

const LayoutSwitcher = React.memo(({ currentLayout, setCurrentLayout, isDark, canChange, labels }: LayoutSwitcherProps) => {
    if (!canChange) return null;
    return (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center p-1.5 rounded-xl border backdrop-blur-md shadow-lg transition-colors duration-300 ${isDark ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-200'}`}>
            <div className="flex gap-1">
                {[
                    { id: 'original', icon: <LayoutPanelLeft size={18} />, label: labels.original },
                    { id: 'timeline', icon: <Milestone size={18} />, label: labels.timeline },
                    { id: 'grid', icon: <LayoutGrid size={18} />, label: labels.grid }
                ].map((l) => (
                    <button
                        key={l.id}
                        onClick={() => setCurrentLayout(l.id as LayoutType)}
                        title={l.label}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                            currentLayout === l.id
                                ? 'bg-cyan-500 text-white shadow-sm'
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
    );
});
LayoutSwitcher.displayName = 'LayoutSwitcher';

export default function ExperiencesClient({ 
    experiences, 
    lang = 'en', 
    layout = 'original', 
    canChange = false,
    original_text = 'Original',
    timeline_text = 'Timeline',
    grid_text = 'Grid'
}: ExperiencesClientProps) {
    const [currentLayout, setCurrentLayout] = useState<LayoutType>(layout);
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
        <div className={`w-full h-full ${isPresentationMode ? 'presentation-container flex flex-row flex-nowrap w-full h-screen' : ''}`}>
            {!isPresentationMode && (
                <LayoutSwitcher 
                    currentLayout={currentLayout} 
                    setCurrentLayout={setCurrentLayout} 
                    isDark={isDark} 
                    canChange={canChange}
                    labels={{ original: original_text, timeline: timeline_text, grid: grid_text }}
                />
            )}

            {isPresentationMode ? (
                allJobs.map((job, idx) => (
                    <FadeInSection
                        key={`pres-${idx}`}
                        className="w-full h-full flex-shrink-0"
                        slideIndex={idx + 1}
                        totalSlides={allJobs.length}
                    >
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
                    </div>
                </div>
            )}
        </div>
    );
}
