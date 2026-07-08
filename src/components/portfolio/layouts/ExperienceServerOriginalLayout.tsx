import React from 'react';
import { formatCJK } from '@/lib/utils';
import { Experience } from '../ExperienceDisplayer';
import { HoverableJobItem, TimelineActiveImageClient } from './ExperienceClientWrappers';
import { TagBadge } from './ExperienceShared';

export function ExperienceServerOriginalLayout({ experiences, lang }: { experiences: Experience[], lang: string }) {
    return (
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="w-full md:w-1/2">
                {experiences.map((experience) => (
                    <div key={experience.year} className={`mb-12`}>
                        <h2 className={`transition-transform duration-300 hover:scale-105 text-2xl font-bold text-theme-700 dark:text-theme-300 mb-6 py-2 cursor-pointer`}>
                            {experience.year}
                        </h2>
                        <div className="space-y-4">
                            {experience.jobs.map((job, index) => (
                                <HoverableJobItem
                                    key={`${experience.year}-${index}`}
                                    job={job}
                                >
                                    <p className="text-xs mb-1 text-theme-800 dark:text-theme-200">{job.date}</p>
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className={`text-xl font-bold group-hover:text-theme-500 ${job.url ? 'underline decoration-dotted decoration-theme-500/30' : ''}`}>
                                            {job.title}<TagBadge labels={job.tag} />
                                        </h3>
                                    </div>
                                    <p className="text-theme-800 dark:text-theme-200 italic mb-3 font-medium">{job.company}</p>
                                    <div data-desc-container className="text-sm mt-2">
                                        {Array.isArray(job.description) ? (
                                            <ul className="list-disc pl-5 space-y-1">
                                                {job.description.map((item, idx) => (
                                                    <li key={idx}>
                                                        <span><span dangerouslySetInnerHTML={{ __html: formatCJK(item, lang) }} /></span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span><span dangerouslySetInnerHTML={{ __html: formatCJK(job.description, lang) }} /></span>
                                        )}
                                    </div>
                                </HoverableJobItem>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="hidden md:block w-1/2">
                <TimelineActiveImageClient />
            </div>
        </div>
    );
}
