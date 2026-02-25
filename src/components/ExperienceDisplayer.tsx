"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import HoverableWords from '@/components/HoverableWords';
import { useTheme } from 'next-themes';
import FadeInSection from '@/components/FadeInSection';
import PopRotateSection from '@/components/PopRotateSection';

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
}

export default function ExperiencesClient({ experiences }: ExperiencesClientProps) {
    const [activeJob, setActiveJob] = useState(experiences[0].jobs[0]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

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

    return (
        <div className={`${isDark ? 'text-white' : 'text-gray-900'} min-h-screen font-sans p-4 sm:p-8 md:p-12`}>
            <div className="container mx-auto max-w-6xl pt-16">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                    {/* Left Column: Job List (Interactive) */}
                    <div className="w-full md:w-1/2 hover:translateY(-5px)">
                        {experiences.map((experience) => (
                            <div key={experience.year} className="mb-12 text-center md:text-justify cursor-pointer">
                                {/* Year */}
                                <FadeInSection>
                                    <h2 className={`transition-all hover:scale-105 text-2xl font-bold ${mainText} mb-6 top-0 py-2 xs:text-center`}>
                                        {experience.year}
                                    </h2>
                                </FadeInSection>
                                
                                <div className="space-y-4">
                                    {experience.jobs.map((job, index) => ( 
                                        <FadeInSection key={`${experience.year}-${index}`}>
                                            <div
                                                onMouseEnter={() => setActiveJob(job)}
                                                className={`p-6 rounded-lg transition-all duration-300 cursor-pointer border-2 shadow-sm 
                                                    ${activeJob.title === job.title && activeJob.company === job.company 
                                                        ? `${activeCardBg}` 
                                                        : `${inactiveCardBg} ${cardBorder} hover:border-cyan-500/50`
                                                    }`}
                                            >
                                                <p className={`${subText} text-sm mb-1 duration-100 hover:text-gray-700 hover:italic transition-all`}>{job.date}</p>
                                                
                                                {/* Clickable Title IF URL exists, otherwise skip */}
                                                {job.url ? (
                                                    <a href={job.url} target="_blank" rel="noopener noreferrer" className="block w-fit">
                                                        <h3 className={`text-xl font-semibold ${mainText} hover:font-bold hover:text-cyan-500 transition-all duration-200 hover:scale-101 underline decoration-dotted decoration-cyan-500/50`}>{job.title}</h3>
                                                    </a>
                                                ) : (
                                                    <h3 className={`text-xl font-semibold ${mainText} hover:font-bold transition-all duration-200 hover:scale-101`}>{job.title}</h3>
                                                )}

                                                <p className="text-cyan-600 font-medium mb-3 transition-all hover:font-bold hover:scale-105 duration-200">{job.company}</p>
                                                <HoverableWords 
                                                    className={`leading-relaxed text-justify lg:text-lg md:text-md ${descText}`}
                                                    prophover='transition-all inline-block duration-100 ease-in-out hover:scale-95 hover:text-cyan-600 hover:underline hover:font-semibold hover:opacity-85'
                                                >
                                                {job.description} 
                                                </HoverableWords>
                                                
                                                {/* Mobile Image Display */}
                                                {job === activeJob && hasValidImage && (
                                                <div className="flex pt-4 w-full justify-center transition-all duration-200 block md:hidden w-1/2 hover:scale-101">
                                                    <div className="aspect-w-16 aspect-h-9">
                                                      <PopRotateSection>
                                                        {job.url ? (
                                                            <a href={job.url} target="_blank" rel="noopener noreferrer">
                                                                <Image
                                                                    width={400}
                                                                    height={300}
                                                                    src={activeImageSrc}
                                                                    alt={`${activeJob.company} placeholder image`}
                                                                    className="w-full h-full object-cover rounded-lg shadow-2xl transition-opacity duration-300 hover:opacity-80"
                                                                />
                                                            </a>
                                                        ) : (
                                                            <Image
                                                                width={400}
                                                                height={300}
                                                                src={activeImageSrc}
                                                                alt={`${activeJob.company} placeholder image`}
                                                                className="w-full h-full object-cover rounded-lg shadow-2xl transition-opacity duration-300"
                                                            />
                                                        )}
                                                      </PopRotateSection>
                                                    </div>
                                                </div>
                                                )}
                                            </div>
                                        </FadeInSection>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Image Display (Carousel) [on desktop] */}
                    <div className="hidden md:block w-1/2">
                         <div className="sticky top-24 transition-all duration-200 hover:scale-105">
                            {hasValidImage ? (
                                <>
                                    <div className="aspect-w-16 aspect-h-9">
                                        {activeJob.url ? (
                                            <a href={activeJob.url} target="_blank" rel="noopener noreferrer">
                                                <Image
                                                    width={600}
                                                    height={400}
                                                    src={activeImageSrc}
                                                    alt={`${activeJob.company} placeholder image`}
                                                    className={`w-full h-full object-cover rounded-lg shadow-2xl transition-opacity duration-300 border-2 ${cardBorder} hover:opacity-85 hover:border-cyan-500`}
                                                />
                                            </a>
                                        ) : (
                                            <Image
                                                width={600}
                                                height={400}
                                                src={activeImageSrc}
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
    );
}
