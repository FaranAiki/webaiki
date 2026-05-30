"use client";

import React, { useState, useEffect } from 'react';
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

type Job = {
    date: string;
    title: string;
    company: string;
    description: string;
    image: string[]; // This is an array of image URLs
    url?: string;
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

export default function ExperiencesClient({ 
    experiences, 
    lang, 
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

    const isJustified = lang !== 'jp' && lang !== 'zh';
    const defaultJustifyClass = isJustified ? 'text-justify' : 'text-left';
    const justifyClass = textAlign === 'default' ? defaultJustifyClass : `text-${textAlign}`;
    const responsiveJustifyClass = textAlign === 'default' ? `text-center md:${justifyClass}` : justifyClass;

    const safeImageIndex = (activeJob?.image && currentImageIndex < activeJob.image.length) ? currentImageIndex : 0;
    const activeImageSrc = activeJob?.image?.[safeImageIndex];
    const hasValidImage = activeJob?.image?.length > 0 && !!activeImageSrc;

    useEffect(() => {
        setMounted(true);
        setCurrentImageIndex(0);

        if (!activeJob?.image || activeJob.image.length <= 1) {
            return;
        }

        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                (prevIndex + 1) % activeJob.image.length
            );
        }, 3000);

        return () => clearInterval(timer);

    }, [activeJob]);

    // PREVENT HYDRATION BLINK: 
    // Always render with a "neutral" or "default" state first (e.g. Light Mode colors) 
    // and only switch to dark mode styles AFTER mounting.
    const isDark = mounted && resolvedTheme === 'dark';
    
    // Fallback classes during SSR/initial hydration to avoid mismatch/blink
    const containerThemeClass = mounted 
        ? (isDark ? 'text-white' : 'text-gray-900') 
        : 'text-gray-900'; // Default to light-ish text to match common background

    const mainText = isDark ? 'text-white' : 'text-black';

    // Using objects for inline styles to bypass global !important CSS
    const dateStyle = { color: isDark ? '#9ca3af' : '#6b7280', opacity: 0.8 };
    const companyStyle = { color: isDark ? '#22d3ee' : '#0284c7' }; // Cyan-400 and Blue-600

    const descText = isDark ? 'text-gray-300' : 'text-gray-700';
    const activeCardBg = isDark ? 'bg-gray-800' : 'bg-gray-100 border-cyan-500';
    const inactiveCardBg = isDark ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white hover:bg-gray-50';
    const cardBorder = isDark ? 'border-transparent' : 'border-gray-200';

    const { isPresentationMode } = usePresentation();

    // Flatten experiences for presentation mode
    const allJobs = experiences.flatMap(exp => exp.jobs.map(job => ({ ...job, year: exp.year })));

    const renderLayoutSwitcher = () => {
        if (!canChange || isPresentationMode) return null;
        return (
            <div className="fixed bottom-8 right-8 z-50 flex items-center bg-white/90 dark:bg-gray-900/90 p-1.5 rounded-xl border border-gray-200 dark:border-gray-800 backdrop-blur-md shadow-lg">
                <div className="flex gap-1">
                    {[
                        { id: 'original', icon: <LayoutPanelLeft size={18} />, label: original_text },
                        { id: 'timeline', icon: <Milestone size={18} />, label: timeline_text },
                        { id: 'grid', icon: <LayoutGrid size={18} />, label: grid_text }
                    ].map((l) => (
                        <button
                            key={l.id}
                            onClick={() => setCurrentLayout(l.id as LayoutType)}
                            title={l.label}
                            className={`p-2 rounded-lg transition-colors ${
                                currentLayout === l.id
                                    ? 'bg-cyan-500 text-white'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            {l.icon}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const OriginalLayout = () => (
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            {/* Left Column: Job List (Interactive) */}
            <div className="w-full md:w-1/2">
                {experiences.map((experience) => (
                    <div key={experience.year} className={`mb-12 ${responsiveJustifyClass} cursor-pointer`}>
                        {/* Year */}
                        <h2 className={`transition-[transform] hover:scale-105 text-2xl font-bold ${mainText} mb-6 top-0 py-2 ${textAlign === 'default' ? 'xs:text-center' : ''}`}>
                            {experience.year}
                        </h2>

                        <div className="space-y-4">
                            {experience.jobs.map((job, index) => (
                                <div
                                    key={`${experience.year}-${index}`}
                                    onMouseEnter={() => setActiveJob(job)}
                                    onFocus={() => setActiveJob(job)}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setActiveJob(job);
                                            if (job.url) window.open(job.url, '_blank', 'noopener,noreferrer');
                                        }
                                    }}
                                    className={`p-6 rounded-lg transition-transform duration-300 cursor-pointer border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500
                                        ${activeJob.title === job.title && activeJob.company === job.company
                                            ? `${activeCardBg}`
                                            : `${inactiveCardBg} ${cardBorder} hover:border-cyan-500/50`
                                        }`}
                                >
                                    <p style={dateStyle} className="text-sm mb-1 duration-100 hover:text-gray-700 hover:italic transition-[colors,opacity]">{job.date}</p>

                                    {/* Clickable Title IF URL exists, otherwise skip w. border */}
                                    {job.url ? (
                                        <a href={job.url} target="_blank" rel="noopener noreferrer" className="block w-fit">
                                            <h3 className={`text-xl font-bold ${mainText} hover:text-cyan-500 transition-[colors,opacity] duration-200 hover:scale-101 underline decoration-dotted decoration-cyan-500/50`}>{job.title}</h3>
                                        </a>
                                    ) : (
                                        <h3 className={`text-xl font-bold ${mainText} transition-[colors,opacity] duration-200 hover:scale-101`}>{job.title}</h3>
                                    )}

                                    <p style={companyStyle} className="italic mb-3 transition-[colors,opacity] hover:scale-105 duration-200">{job.company}</p>
                                    <HoverableWords
                                        className={`${justifyClass} ${descText}`}
                                        prophover='transition-[transform,color,opacity] inline-block duration-100 ease-in-out hover:scale-95 hover:text-cyan-600 hover:underline hover:font-semibold hover:opacity-85'
                                    >
                                    {formatCJK(job.description, lang)}
                                    </HoverableWords>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Column: Image Display (Carousel) [on desktop] */}
            <div className="hidden md:block w-1/2">
                    <div className="sticky top-32 transition-[opacity,transform] duration-200 hover:scale-105 flex justify-center">
                    {hasValidImage ? (
                        <div className="w-full">
                            <div
                                className="relative w-fit h-fit mx-auto shadow-2xl p-0 overflow-hidden rounded-lg transform-gpu"
                                style={{ boxShadow: isDark ? 'inset 0 0 0 2px rgba(255,255,255,0.1)' : 'inset 0 0 0 2px rgba(0,0,0,0.1)' }}
                            >
                                {activeJob.url ? (
                                    <a href={activeJob.url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden">
                                        <Image
                                            width={600}
                                            height={400}
                                            src={activeImageSrc}
                                            placeholder="blur"
                                            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(600, 400))}`}
                                            alt={`${activeJob.company} placeholder image`}
                                            className="block w-full h-auto object-cover transition-opacity duration-300 hover:opacity-85 scale-[1.01]"
                                            priority
                                        />
                                    </a>
                                ) : (
                                    <Image
                                        width={600}
                                        height={400}
                                        src={activeImageSrc}
                                        placeholder="blur"
                                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(600, 400))}`}
                                        alt={`${activeJob.company} placeholder image`}
                                        className="block w-full h-auto object-cover scale-[1.01]"
                                        priority
                                    />
                                )}
                            </div>
                            <div className="mt-4 text-center">
                                {activeJob.url ? (
                                    <a href={activeJob.url} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 transition-colors">
                                        <h3 className={`text-2xl font-black ${mainText}`}>{activeJob.title}</h3>
                                    </a>
                                ) : (
                                    <h3 className={`text-2xl font-black ${mainText}`}>{activeJob.title}</h3>
                                )}
                                <p style={companyStyle} className="text-lg italic">{activeJob.company}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-700/30 rounded-lg">
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const TimelineLayout = () => (
        <div className="relative border-l-2 border-cyan-500/30 ml-4 md:ml-8 space-y-12">
            {experiences.map((experience) => (
                <div key={experience.year} className="relative pl-8">
                    <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-cyan-500 border-4 border-white dark:border-gray-900 shadow-sm" />
                    <h2 className={`text-3xl font-black ${mainText} mb-8`}>{experience.year}</h2>
                    <div className="space-y-12">
                        {experience.jobs.map((job, index) => (
                            <div key={`${experience.year}-${index}`} className="flex flex-col gap-4">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {job.image && job.image.length > 0 && (
                                        <div className="w-full md:w-1/3 shrink-0">
                                            <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
                                                <Image
                                                    src={job.image[0]}
                                                    alt={job.company}
                                                    fill
                                                    className="object-cover"
                                                    placeholder="blur"
                                                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(400, 225))}`}
                                                />
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
                                        {job.url && (
                                            <a
                                                href={job.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block mt-4 text-cyan-500 font-bold hover:underline"
                                            >
                                                View Project →
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    const GridLayout = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.flatMap(exp => exp.jobs.map((job, idx) => ({ ...job, year: exp.year, key: `${exp.year}-${idx}` }))).map((job) => (
                <div key={job.key} className={`flex flex-col p-6 rounded-2xl border ${cardBorder} ${inactiveCardBg} transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group`}>
                    <div className="relative aspect-video mb-6 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
                        {job.image && job.image.length > 0 ? (
                            <Image
                                src={job.image[0]}
                                alt={job.company}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                placeholder="blur"
                                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(400, 225))}`}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                        <div className="absolute top-4 right-4 bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            {job.year}
                        </div>
                    </div>
                    <p style={dateStyle} className="text-xs font-medium mb-1">{job.date}</p>
                    <h3 className={`text-xl font-black ${mainText} mb-1 line-clamp-1`}>{job.title}</h3>
                    <p style={companyStyle} className="text-sm italic mb-4">{job.company}</p>
                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        {job.url && (
                            <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-cyan-500 uppercase tracking-wider hover:opacity-70 transition-opacity">
                                Explore
                            </a>
                        )}
                        <span className="text-[10px] text-gray-400 uppercase">{job.year}</span>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className={`w-full h-full ${isPresentationMode ? 'presentation-container flex flex-row flex-nowrap w-full h-screen' : ''}`}>
            {renderLayoutSwitcher()}
            {/* Presentation Mode: Each Job is a Slide */}
            {isPresentationMode && allJobs.map((job, idx) => {
                const jobHasImage = job.image && job.image.length > 0;
                return (
                    <FadeInSection
                        key={`pres-${idx}`}
                        className="w-full h-full flex-shrink-0"
                        slideIndex={idx + 1}
                        totalSlides={allJobs.length}
                    >
                        <div className={`${mounted && isDark ? 'text-white' : 'text-gray-900'} w-full h-full px-4 md:px-8 flex flex-col md:flex-row print:flex-row gap-4 md:gap-12 items-center justify-center mx-auto pt-16 pb-8`}>
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
                            {jobHasImage && (
                                <div className="flex-[0.8] flex justify-center items-center w-full h-full">
                                    <div className="relative w-full h-full max-w-[400px] max-h-[400px] flex justify-center items-center overflow-hidden transform-gpu">
                                        <Image
                                            src={job.image[0]}
                                            alt={job.company}
                                            fill
                                            className="object-contain transition-transform duration-700 hover:scale-[1.03] scale-[1.01]"
                                            sizes="(max-width: 768px) 100vw, 400px"
                                            priority={isPresentationMode || idx < 2}
                                            loading={isPresentationMode ? "eager" : "lazy"}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </FadeInSection>
                );
            })}

            {/* Normal Mode */}
            {!isPresentationMode && (
                <div className="block">
                <div className={`${containerThemeClass} min-h-screen p-4 sm:p-8 md:p-12 w-full transition-colors duration-300`}>
                    <div className="container mx-auto max-w-6xl pt-16">
                        {currentLayout === 'original' && <OriginalLayout />}
                        {currentLayout === 'timeline' && <TimelineLayout />}
                        {currentLayout === 'grid' && <GridLayout />}
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}
