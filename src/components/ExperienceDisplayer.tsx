"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import HoverableWords from '@/components/HoverableWords';
import { useTheme } from 'next-themes';
import FadeInSection from '@/components/FadeInSection';
import PopRotateSection from '@/components/PopRotateSection';

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

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
    const [mounted, setMounted] = useState(false);

    const isJustified = lang !== 'jp' && lang !== 'zh';
    const justifyClass = isJustified ? 'text-justify' : 'text-left';

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
    const subText = isDark ? 'text-gray-400' : 'text-gray-600';
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
                        <FadeInSection key={`pres-${idx}`} className="w-full h-full flex-shrink-0">
                            <div className={`${isDark ? 'text-white' : 'text-gray-900'} w-full h-full px-8 flex flex-col md:flex-row gap-8 items-center justify-center`}>
                                <div className="flex-1 space-y-4 max-w-2xl">
                                    <h2 className="text-cyan-500 font-bold text-2xl">{job.year}</h2>
                                    <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight">{job.title}</h3>
                                    <h4 className="text-2xl text-cyan-600 font-medium">{job.company}</h4>
                                    <p className={`${subText} text-lg`}>{job.date}</p>
                                    <HoverableWords className={`text-xl leading-relaxed ${justifyClass} ${descText}`}>
                                        {job.description}
                                    </HoverableWords>
                                </div>
                                {jobHasImage && (
                                    <div className="flex-1 w-full max-w-xl">
                                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                                            <Image
                                                fill
                                                src={job.image[0]}
                                                alt={job.company}
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                                    <div key={experience.year} className={`mb-12 text-center md:${justifyClass} cursor-pointer`}>
                                        {/* Year */}
                                        <h2 className={`transition-[transform] hover:scale-105 text-2xl font-bold ${mainText} mb-6 top-0 py-2 xs:text-center`}>
                                            {experience.year}
                                        </h2>
                                        
                                        <div className="space-y-4">
                                            {experience.jobs.map((job, index) => ( 
                                                <div
                                                    key={`${experience.year}-${index}`}
                                                    onMouseEnter={() => setActiveJob(job)}
                                                    className={`p-6 rounded-lg transition-transform duration-300 cursor-pointer border-2 shadow-sm 
                                                        ${activeJob.title === job.title && activeJob.company === job.company 
                                                            ? `${activeCardBg}` 
                                                            : `${inactiveCardBg} ${cardBorder} hover:border-cyan-500/50`
                                                        }`}
                                                >
                                                    <p className={`${subText} text-sm mb-1 duration-100 hover:text-gray-700 hover:italic transition-[colors,opacity]`}>{job.date}</p>
                                                    
                                                    {/* Clickable Title IF URL exists, otherwise skip w. border */}
                                                    {job.url ? (
                                                        <a href={job.url} target="_blank" rel="noopener noreferrer" className="block w-fit">
                                                            <h3 className={`text-xl font-semibold ${mainText} hover:font-bold hover:text-cyan-500 transition-[colors,opacity] duration-200 hover:scale-101 underline decoration-dotted decoration-cyan-500/50`}>{job.title}</h3>
                                                        </a>
                                                    ) : (
                                                        <h3 className={`text-xl font-semibold ${mainText} hover:font-bold transition-[colors,opacity] duration-200 hover:scale-101`}>{job.title}</h3>
                                                    )}

                                                    <p className="text-cyan-600 font-medium mb-3 transition-[colors,opacity] hover:font-bold hover:scale-105 duration-200">{job.company}</p>
                                                    <HoverableWords 
                                                        className={`leading-relaxed ${justifyClass} lg:text-lg md:text-md ${descText}`}
                                                        prophover='transition-[transform,color,opacity] inline-block duration-100 ease-in-out hover:scale-95 hover:text-cyan-600 hover:underline hover:font-semibold hover:opacity-85'
                                                    >
                                                    {job.description} 
                                                    </HoverableWords>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Right Column: Image Display (Carousel) [on desktop] */}
                            <div className="hidden md:block w-1/2">
                                 <div className="sticky top-24 transition-[opacity,transform] duration-200 hover:scale-105">
                                    {hasValidImage ? (
                                        <>
                                            <div className="aspect-w-16 aspect-h-9">
                                                {activeJob.url ? (
                                                    <a href={activeJob.url} target="_blank" rel="noopener noreferrer">
                                                        <Image
                                                            width={600}
                                                            height={400}
                                                            src={activeImageSrc}
                                                            placeholder="blur"
                                                            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(600, 400))}`}
                                                            alt={`${activeJob.company} placeholder image`}
                                                            className={`w-full h-full object-cover rounded-lg shadow-2xl transition-opacity duration-300 border-2 ${cardBorder} hover:opacity-85 hover:border-cyan-500`}
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
                                                        className={`w-full h-full object-cover rounded-lg shadow-2xl transition-opacity duration-300 border-2 ${cardBorder}`}
                                                    />
                                                )}
                                            </div>
                                            <div className="mt-4 text-center">
                                                {activeJob.url ? (
                                                    <a href={activeJob.url} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 transition-colors">
                                                        <h3 className={`text-2xl font-bold ${mainText}`}>{activeJob.title}</h3>
                                                    </a>
                                                ) : (
                                                    <h3 className={`text-2xl font-bold ${mainText}`}>{activeJob.title}</h3>
                                                )}
                                                <p className="text-cyan-600 text-lg">{activeJob.company}</p>
                                            </div>
                                        </>
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
