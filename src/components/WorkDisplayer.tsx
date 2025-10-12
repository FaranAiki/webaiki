"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

type Job = {
    date: string;
    title: string;
    company: string;
    description: string;
    image: string[]; // This is an array of image URLs
};

type Experience = {
    year: string;
    jobs: Job[];
};

interface WorkExperienceClientProps {
    workExperiences: Experience[];
}

export default function WorkExperienceClient({ workExperiences }: WorkExperienceClientProps) {
    const [activeJob, setActiveJob] = useState(workExperiences[0].jobs[0]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // ✅ Consolidated useEffect to manage the image carousel
    useEffect(() => {
        // 1. Immediately reset to the first image for the new activeJob
        setCurrentImageIndex(0);

        // 2. If the new job has only one image (or none), do nothing else.
        if (activeJob.image.length <= 1) {
            return;
        }

        // 3. Start a new interval timer for the carousel
        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                // Cycle to the next image, looping back to the start
                (prevIndex + 1) % activeJob.image.length
            );
        }, 3000); // Switch image every 3 seconds

        // 4. Cleanup function: This is crucial!
        // It clears the interval when the component unmounts OR when `activeJob` changes again.
        return () => clearInterval(timer);

    }, [activeJob]); // <-- This effect runs ONLY when `activeJob` changes

    return (
        <div className="text-white min-h-screen font-sans p-4 sm:p-8 md:p-12">
            <div className="container mx-auto max-w-6xl pt-16">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                    {/* Left Column: Job List (Interactive) */}
                    <div className="w-full md:w-1/2">
                        {workExperiences.map((experience) => (
                            <div key={experience.year} className="mb-12">
                                <h2 className="transition-all hover:scale-105 text-3xl font-bold text-white mb-6 sticky top-0 py-2 xs:text-center">{experience.year}</h2>
                                <div className="space-y-4">
                                    {experience.jobs.map((job, index) => (
                                        <div
                                            key={index}
                                            onMouseEnter={() => setActiveJob(job)}
                                            className={`p-6 rounded-lg transition-all duration-300 cursor-pointer border-2 ${activeJob.title === job.title && activeJob.company === job.company ? 'bg-gray-800 border-cyan-500' : 'bg-gray-800/50 border-transparent hover:bg-gray-800 hover:border-cyan-500/50'}`}
                                        >
                                            <p className="text-gray-400 text-sm mb-1">{job.date}</p>
                                            <h3 className="text-xl font-semibold text-gray-100">{job.title}</h3>
                                            <p className="text-cyan-400 font-medium mb-3">{job.company}</p>
                                            <p className="text-gray-300 leading-relaxed">{job.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Image Display (Carousel) */}
                    <div className="hidden md:block w-1/2">
                        <div className="sticky top-24">
                            <div className="aspect-w-16 aspect-h-9">
                                {activeJob.image.length > 0 && (
                                     <Image
                                        // key={activeJob.image[currentImageIndex]}
                                        width={24}
                                        height={16}
                                        src={activeJob.image[currentImageIndex]}
                                        alt={`${activeJob.company} placeholder image`}
                                        className="w-full h-full object-cover rounded-lg shadow-2xl transition-opacity duration-300"
                                        unoptimized
                                    />
                                )}
                            </div>
                            <div className="mt-4 text-center">
                                <h3 className="text-2xl font-bold">{activeJob.title}</h3>
                                <p className="text-cyan-400 text-lg">{activeJob.company}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
