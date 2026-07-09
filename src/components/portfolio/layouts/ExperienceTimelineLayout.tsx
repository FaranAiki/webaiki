"use client";

import React, { useMemo } from 'react';
import { ClientOnlyImage } from './ClientOnlyImage';
import { useExperienceContext } from '../ExperienceContext';
import BookmarkButton from '@/components/interactive/BookmarkButton';
import { TagBadge, PdfRenderer } from './ExperienceShared';

export default function ExperienceTimelineLayout() {
    const { paginatedExperiences, bookmarkedItemIds, isLoggedIn, priorityImages } = useExperienceContext();
    const allJobs = useMemo(() => paginatedExperiences.flatMap(e => e.jobs), [paginatedExperiences]);

    return (
        <div className="relative w-full py-10 overflow-hidden font-sans">
            {/* DESKTOP: 3-column Snake Path */}
            <div className="hidden lg:flex flex-col w-full max-w-7xl mx-auto">
                {(() => {
                    const chunks = [];
                    let i = 0;
                    const sizes = [3, 4, 5, 4, 3, 5];
                    let sizeIter = 0;
                    while (i < allJobs.length) {
                        const size = sizes[sizeIter % sizes.length];
                        chunks.push(allJobs.slice(i, i + size));
                        i += size;
                        sizeIter++;
                    }
                    return chunks.map((row, rowIdx) => {
                        const isEvenRow = rowIdx % 2 === 0;
                        const isLastRow = rowIdx === chunks.length - 1;
                        return (
                            <div key={`lg-${rowIdx}`} className={`flex w-full items-stretch ${isEvenRow ? 'flex-row' : 'flex-row-reverse'}`}>
                                {row.map((job, idx) => {
                                    const isLastInRow = idx === row.length - 1;
                                    const isPdf = job.image && job.image.length > 0 && job.image[0].toLowerCase().endsWith('.pdf');
                                    return (
                                        <div key={`lg-item-${idx}`} className="relative flex flex-col items-center px-2 pb-12" style={{ width: `${100 / row.length}%` }}>
                                            {isLastInRow && !isLastRow && (
                                                <div className="absolute left-1/2 -translate-x-1/2 w-1.5 bg-theme-500/40 z-0" style={{ top: '2.5rem', height: '100%' }} />
                                            )}
                                            <div className="h-20 flex items-center justify-center w-full relative">
                                                {!isLastInRow && (
                                                    <div className={`absolute top-1/2 -translate-y-1/2 h-1.5 bg-theme-500/40 w-full z-0 ${isEvenRow ? 'left-1/2' : 'right-1/2'}`} />
                                                )}
                                                <div className="w-10 h-10 rounded-full bg-theme-surface border-4 border-theme-500 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(var(--color-theme-500),0.6)]">
                                                    <div className="w-3 h-3 rounded-full bg-theme-500 animate-pulse" />
                                                </div>
                                            </div>
                                            <div className="w-full mt-4 flex-grow bg-theme-surface/90 backdrop-blur-md border border-theme-border rounded-3xl p-4 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group text-left cursor-pointer" onClick={() => job.url && window.open(job.url, '_blank')}>
                                                {job.image && job.image.length > 0 && (
                                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-theme-surface-strong">
                                                        {isPdf ? (
                                                            <PdfRenderer url={job.image[0]} />
                                                        ) : (
                                                            <ClientOnlyImage src={job.image[0]} alt={`${job.title} at ${job.company} - Muhammad Faran Aiki Portfolio`} fill sizes="(max-width: 768px) 90vw, (max-width: 1024px) 30vw, 15vw" quality={70} priority={priorityImages ? allJobs.indexOf(job) < 4 : false} className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                                        )}
                                                    </div>
                                                )}
                                                <div className="flex flex-wrap gap-2 mb-2 items-center">
                                                    <span className="px-2 py-1 bg-theme-500/10 text-theme-700 dark:text-theme-300 rounded-md text-[10px] font-black border border-theme-500/20">{job.year}</span>
                                                    <span className="text-[10px] font-bold text-theme-muted">{job.date}</span>
                                                </div>
                                                <h2 className="text-base lg:text-lg font-black mb-1 group-hover:text-theme-500 transition-colors leading-tight">{job.title}</h2>
                                                <div className="mb-2 flex items-center justify-between">
                                                    <TagBadge labels={job.tag} />
                                                    <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                                                        <BookmarkButton itemType="experience" itemId={job.image?.[0] ?? job.url ?? job.company ?? job.title} initialBookmarked={bookmarkedItemIds.includes(job.image?.[0] ?? job.url ?? job.company ?? job.title)} isLoggedIn={!!isLoggedIn} className="relative" />
                                                    </div>
                                                </div>
                                                <p className="text-theme-700 dark:text-theme-300 font-bold italic text-xs mb-2">{job.company}</p>
                                                <div className="text-xs text-foreground/80 transition-all duration-500 max-h-24 group-hover:max-h-96 overflow-hidden">
                                                    {Array.isArray(job.description) ? (
                                                        <ul className="list-disc pl-4 space-y-1">
                                                            {job.description.map((item, i) => <li key={i}>{item}</li>)}
                                                        </ul>
                                                    ) : (
                                                        <p>{job.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })
                })()}
            </div>

            {/* TABLET: 2-column Snake Path */}
            <div className="hidden md:flex lg:hidden flex-col w-full max-w-4xl mx-auto">
                {Array.from({ length: Math.ceil(allJobs.length / 2) }).map((_, rowIdx) => {
                    const row = allJobs.slice(rowIdx * 2, rowIdx * 2 + 2);
                    const isEvenRow = rowIdx % 2 === 0;
                    const isLastRow = rowIdx === Math.ceil(allJobs.length / 2) - 1;
                    return (
                        <div key={`md-${rowIdx}`} className={`flex w-full items-stretch ${isEvenRow ? 'flex-row' : 'flex-row-reverse'}`}>
                            {row.map((job, idx) => {
                                const isLastInRow = idx === row.length - 1;
                                return (
                                    <div key={`md-item-${idx}`} className="w-1/2 relative flex flex-col items-center px-4 pb-12">
                                        {isLastInRow && !isLastRow && (
                                            <div className="absolute left-1/2 -translate-x-1/2 w-1.5 bg-theme-500/40 z-0" style={{ top: '2.5rem', height: '100%' }} />
                                        )}
                                        <div className="h-20 flex items-center justify-center w-full relative">
                                            {!isLastInRow && (
                                                <div className={`absolute top-1/2 -translate-y-1/2 h-1.5 bg-theme-500/40 w-full z-0 ${isEvenRow ? 'left-1/2' : 'right-1/2'}`} />
                                            )}
                                            <div className="w-10 h-10 rounded-full bg-theme-surface border-4 border-theme-500 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(var(--color-theme-500),0.6)]">
                                                <div className="w-3 h-3 rounded-full bg-theme-500 animate-pulse" />
                                            </div>
                                        </div>
                                        <div className="w-full mt-4 flex-grow bg-theme-surface/90 backdrop-blur-md border border-theme-border rounded-3xl p-5 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group text-left cursor-pointer" onClick={() => job.url && window.open(job.url, '_blank')}>
                                            {job.image && job.image.length > 0 && (
                                                <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-theme-surface-strong">
                                                    {job.image[0].toLowerCase().endsWith('.pdf') ? (
                                                        <PdfRenderer url={job.image[0]} />
                                                    ) : (
                                                        <ClientOnlyImage src={job.image[0]} alt={`${job.title} at ${job.company} - Muhammad Faran Aiki Portfolio`} fill sizes="(max-width: 768px) 90vw, (max-width: 1024px) 30vw, 15vw" quality={70} priority={priorityImages ? allJobs.indexOf(job) < 4 : false} className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex flex-wrap gap-2 mb-2 items-center">
                                                <span className="px-2 py-1 bg-theme-500/10 text-theme-700 dark:text-theme-300 rounded-md text-[10px] font-black border border-theme-500/20">{job.year}</span>
                                                <span className="text-[10px] font-bold text-theme-muted">{job.date}</span>
                                            </div>
                                            <div className="flex justify-between items-start mb-1">
                                                <h2 className="text-lg font-black group-hover:text-theme-500 transition-colors leading-tight">{job.title}</h2>
                                                <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                                                    <BookmarkButton itemType="experience" itemId={job.image?.[0] ?? job.url ?? job.company ?? job.title} initialBookmarked={bookmarkedItemIds.includes(job.image?.[0] ?? job.url ?? job.company ?? job.title)} isLoggedIn={!!isLoggedIn} className="relative !p-1.5" />
                                                </div>
                                            </div>
                                            <div className="mb-2"><TagBadge labels={job.tag} /></div>
                                            <p className="text-theme-700 dark:text-theme-300 font-bold italic text-sm mb-2">{job.company}</p>
                                            <div className="text-xs text-foreground/80 transition-all duration-500 max-h-24 group-hover:max-h-96 overflow-hidden">
                                                {Array.isArray(job.description) ? (
                                                    <ul className="list-disc pl-4 space-y-1">
                                                        {job.description.map((item, i) => <li key={i}>{item}</li>)}
                                                    </ul>
                                                ) : (
                                                    <p>{job.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>

            {/* MOBILE: 1-column Vertical Line */}
            <div className="block md:hidden relative w-full px-2">
                <div className="absolute left-7 top-10 bottom-10 w-1 bg-theme-500/30 z-0" />
                <div className="space-y-8">
                    {allJobs.map((job, idx) => (
                        <div key={`mob-${idx}`} className="relative pl-12 pr-2 flex flex-col w-full cursor-pointer group" onClick={() => job.url && window.open(job.url, '_blank')}>
                            <div className="absolute left-5 top-5 w-5 h-5 rounded-full bg-theme-surface border-4 border-theme-500 shadow-[0_0_10px_rgba(var(--color-theme-500),0.5)] z-10" />
                            <div className="w-full bg-theme-surface/90 backdrop-blur-md border border-theme-border rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 text-left">
                                {job.image && job.image.length > 0 && (
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3 bg-theme-surface-strong">
                                        {job.image[0].toLowerCase().endsWith('.pdf') ? (
                                            <PdfRenderer url={job.image[0]} />
                                        ) : (
                                            <ClientOnlyImage src={job.image[0]} alt={`${job.title} at ${job.company} - Muhammad Faran Aiki Portfolio`} fill sizes="(max-width: 768px) 90vw, (max-width: 1024px) 30vw, 15vw" quality={70} priority={priorityImages ? idx < 4 : false} className="object-cover" />
                                        )}
                                    </div>
                                )}
                                <span className="inline-block px-2 py-0.5 bg-theme-500/10 text-theme-700 dark:text-theme-300 rounded-md text-[10px] font-black mb-2">{job.year}</span>
                                <div className="flex justify-between items-start mb-1">
                                    <h2 className="text-sm font-black text-foreground group-hover:text-theme-500 leading-tight">{job.title}</h2>
                                    <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                                        <BookmarkButton itemType="experience" itemId={job.image?.[0] ?? job.url ?? job.company ?? job.title} initialBookmarked={bookmarkedItemIds.includes(job.image?.[0] ?? job.url ?? job.company ?? job.title)} isLoggedIn={!!isLoggedIn} className="relative !p-1.5" />
                                    </div>
                                </div>
                                <p className="text-theme-700 dark:text-theme-300 font-bold italic text-xs mb-2">{job.company}</p>
                                <div className="text-xs text-foreground/80 max-h-16 group-hover:max-h-96 overflow-hidden transition-all duration-500">
                                    {Array.isArray(job.description) ? (
                                        <ul className="list-disc pl-4 space-y-1">
                                            {job.description.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    ) : (
                                        <p>{job.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
