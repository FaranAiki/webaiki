"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import HoverableWords from '@/components/HoverableWords';
import { useTheme } from 'next-themes';
import FadeInSection from '@/components/FadeInSection';
import { shimmer, toBase64, formatCJK } from '@/lib/utils';
import { useSettings } from './SettingsContext';

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

interface ExperiencesClientProps {
    experiences: Experience[];
    lang?: string;
}

export default function ExperiencesClient({ experiences, lang }: ExperiencesClientProps) {
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

    if (!mounted) return null;
    
    const isDark = resolvedTheme === 'dark';
    const mainText = isDark ? 'text-white' : 'text-black';
    
    // Using objects for inline styles to bypass global !important CSS
    const dateStyle = { color: isDark ? '#9ca3af' : '#6b7280', opacity: 0.8 };
    const companyStyle = { color: isDark ? '#22d3ee' : '#0284c7' }; // Cyan-400 and Blue-600
    
    const descText = isDark ? 'text-gray-300' : 'text-gray-700';
    const activeCardBg = isDark ? 'bg-gray-800' : 'bg-gray-100 border-cyan-500';
    const inactiveCardBg = isDark ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white hover:bg-gray-50';
    const cardBorder = isDark ? 'border-transparent' : 'border-gray-200';

    // Flatten experiences for presentation mode
    const allJobs = experiences.flatMap(exp => exp.jobs.map(job => ({ ...job, year: exp.year })));

    return (
        <div className="w-full h-full presentation-mode:contents">
            {/* Presentation Mode: Each Job is a Slide */}
            <div className="hidden body-presentation-mode:contents presentation-container">
                {allJobs.map((job, idx) => {
                    const jobHasImage = job.image && job.image.length > 0;
                    return (
                        <FadeInSection 
                            key={`pres-${idx}`} 
                            className="w-full h-full flex-shrink-0"
                            slideIndex={idx + 1}
                            totalSlides={allJobs.length}
                        >
                            <div className={`${isDark ? 'text-white' : 'text-gray-900'} w-full h-full px-8 md:px-20 flex flex-col md:flex-row gap-12 items-center justify-center mx-auto pt-32 pb-12`}>
                                <div className="flex-1 flex flex-col justify-center space-y-6 max-w-2xl">
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
                                    <div className="flex-1 flex justify-center items-center w-full mt-4 md:mt-0 self-center">
                                        <div className="relative w-fit h-fit shadow-2xl overflow-visible p-0">
                                            <Image
                                                src={job.image[0]}
                                                alt={job.company}
                                                width={800}
                                                height={450}
                                                className="block w-full h-auto max-h-[60vh] object-cover transition-transform duration-700 hover:scale-[1.02] border-2 border-white/10 rounded-3xl"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                priority={idx < 2}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </FadeInSection>
                    );
                })}
            </div>

            {/* Normal Mode */}
            <div className="block body-presentation-mode:hidden">
                <div className={`${isDark ? 'text-white' : 'text-gray-900'} min-h-screen font-sans p-4 sm:p-8 md:p-12 w-full`}>
                    <div className="container mx-auto max-w-6xl pt-16">
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
                                                        className={`${justifyClass} lg:text-lg md:text-md ${descText}`}
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
                                            <div className="relative w-fit h-fit mx-auto shadow-2xl p-0">
                                                {activeJob.url ? (
                                                    <a href={activeJob.url} target="_blank" rel="noopener noreferrer">
                                                        <Image
                                                            width={600}
                                                            height={400}
                                                            src={activeImageSrc}
                                                            placeholder="blur"
                                                            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(600, 400))}`}
                                                            alt={`${activeJob.company} placeholder image`}
                                                            className="block w-full h-auto object-cover transition-opacity duration-300 hover:opacity-85 border-2 border-gray-200 dark:border-white/10 rounded-lg"
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
                                                        className="block w-full h-auto object-cover border-2 border-gray-200 dark:border-white/10 rounded-lg"
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
                    </div>
                </div>
            </div>
        </div>
    );
}
