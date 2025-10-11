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

// This component handles all state and user interaction
export default function WorkExperienceClient({ workExperiences }: WorkExperienceClientProps) {
    // State for the currently hovered job
    const [activeJob, setActiveJob] = useState(workExperiences[0].jobs[0]);
    
    // New state for the current image index in the carousel
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Effect to reset the image index to 0 whenever the activeJob changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [activeJob]);

    // Effect to handle the auto-carousel logic using setTimeout
    useEffect(() => {
        // Only run the carousel if there is more than one image
        if (activeJob.image.length <= 1) return;

        // Set a timer to switch to the next image
        const timer = setTimeout(() => {
            setCurrentImageIndex((prevIndex) =>
                (prevIndex + 1) % activeJob.image.length
            );
        }, 3000);

        return () => clearTimeout(timer);
    }, [currentImageIndex, activeJob]);

    return (
        <div className="text-white min-h-screen font-sans p-4 sm:p-8 md:p-12">
            <div className="container mx-auto max-w-6xl pt-16">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                    {/* Left Column: Job List (Interactive) */}
                    <div className="w-full md:w-1/2">
                        {workExperiences.map((experience) => (
                            <div key={experience.year} className="mb-12">
                                <h2 className="text-3xl font-bold text-white mb-6 sticky top-0 py-2">{experience.year}</h2>
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

                    {/* Right Column: Image Display (Now a Carousel) */}
                    <div className="hidden md:block w-1/2">
                        <div className="sticky top-24">
                            <div className="aspect-w-16 aspect-h-9">
                                <Image
                                    width={24}
                                    height={16}
                                    src={activeJob.image[currentImageIndex]}
                                    alt={`${activeJob.company} placeholder image`}
                                    className="w-full h-full object-cover rounded-lg shadow-2xl transition-opacity duration-300"
                                    unoptimized
                                />
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
