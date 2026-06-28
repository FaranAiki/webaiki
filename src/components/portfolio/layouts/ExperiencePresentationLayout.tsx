"use client";

import { PresentationLayoutType } from '../ExperienceDisplayer';
import React, { useMemo } from 'react';
import Image from 'next/image';
import { ExternalLink, LayoutPanelLeft, Rows, Briefcase } from 'lucide-react';
import HoverableWords from '@/components/shared/HoverableWords';
import BookmarkButton from '@/components/interactive/BookmarkButton';
import FadeInSection from '@/components/shared/FadeInSection';
import { formatCJK } from '@/lib/utils';
import { useExperienceContext } from '../ExperienceContext';
import { TagBadge, PdfRenderer, PlaceholderIcon } from './ExperienceShared';

export default function ExperiencePresentationLayout() {
    const { 
        paginatedExperiences, 
        bookmarkedItemIds, 
        isLoggedIn,
        lang,
        descText,
        justifyClass,
        presentationLayout,
        setPresentationLayout,
        translations
    } = useExperienceContext();
    
    const allJobs = useMemo(() => paginatedExperiences.flatMap(e => e.jobs), [paginatedExperiences]);
    
    const dateStyle = { fontVariantNumeric: 'tabular-nums' };

    return (
        <div className="w-full h-full relative presentation-container">
            <div className={`fixed bottom-8 left-8 z-[100] flex items-center p-1.5 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 border-theme-border ring-1 ring-black/5 dark:ring-white/10 print:hidden`}>
                <div className="flex gap-1">
                    {[
                        { id: 'modern', icon: <LayoutPanelLeft size={18} />, label: translations?.modern_text || 'Modern' },
                        { id: 'split', icon: <Rows size={18} />, label: translations?.cinematic_text || 'Cinematic' },
                        { id: 'minimal', icon: <div className="w-[18px] h-[18px] border-2 border-current rounded-sm flex items-center justify-center font-bold text-sm leading-none">E</div>, label: translations?.editorial_text || 'Editorial' }
                    ].map((l) => (
                        <button
                            key={l.id}
                            onClick={() => setPresentationLayout(l.id as PresentationLayoutType)}
                            title={l.label}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                                presentationLayout === l.id
                                    ? 'bg-theme-500 text-white shadow-md scale-105'
                                    : 'text-theme-muted hover:text-theme-500 hover:bg-theme-surface-strong'
                            }`}
                        >
                            {l.icon}
                        </button>
                    ))}
                </div>
            </div>

            {allJobs.map((job, idx) => (
                <FadeInSection
                    key={`pres-${idx}`}
                    className="w-full py-12 flex-shrink-0 border-b border-theme-border/30 last:border-0"
                    slideIndex={idx + 1}
                    totalSlides={allJobs.length}
                >
                    {/* 1. Modern */}
                    {presentationLayout === 'modern' && (
                        <div className={`text-foreground w-full px-4 md:px-8 flex flex-col md:flex-row print:flex-row gap-4 md:gap-12 items-center justify-center mx-auto pt-20 pb-10`}>
                            <div className="flex-[1.2] flex flex-col justify-center space-y-6 max-w-2xl print:max-w-none">
                                <div className="space-y-2">
                                    <h2 className="text-theme-700 dark:text-theme-300 font-bold text-xl md:text-2xl tracking-tight">{job.year}</h2>
                                    <h3 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter text-foreground">{job.title}<TagBadge labels={job.tag} /></h3>
                                    <h4 className="text-theme-700 dark:text-theme-300 text-xl md:text-2xl italic opacity-90">{job.company}</h4>
                                    <div className="flex items-center gap-2">
                                        <p style={dateStyle} className="text-base md:text-lg font-medium italic text-foreground/80">{job.date}</p>
                                        <BookmarkButton itemType="experience" itemId={job.title} initialBookmarked={bookmarkedItemIds.includes(job.title)} isLoggedIn={!!isLoggedIn} className="relative" />
                                    </div>
                                </div>
                                <HoverableWords className={`text-base md:text-lg ${justifyClass} ${descText} font-medium`}>
                                    {job.description}
                                </HoverableWords>

                                {job.url && (
                                    <a href={job.url} target="_blank" rel="noopener noreferrer" aria-label={`${translations?.visit_external_link_text} ${job.title}`} className="flex items-center gap-2 px-6 py-3 bg-theme-500 text-white rounded-full font-bold text-sm hover:bg-theme-600 transition-all w-fit shadow-lg hover:scale-105">
                                        <ExternalLink size={18} />
                                        Visit Project
                                    </a>
                                )}
                            </div>

                            <div className="flex-[0.8] flex justify-center items-center w-full h-full transform-gpu">
                                <div className="relative w-full h-full max-w-[400px] max-h-[400px] aspect-square flex justify-center items-center overflow-hidden transform-gpu rounded-3xl">
                                    {job.image && job.image.length > 0 ? (
                                        job.image[0].toLowerCase().endsWith('.pdf') ? (
                                            <PdfRenderer url={job.image[0]} />
                                        ) : (
                                            <Image src={job.image[0]} alt={`${job.title} at ${job.company}`} fill className="object-contain transition-transform duration-700 hover:scale-[1.03] scale-[1.01]" sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 30vw" quality={75} priority={true} />
                                        )
                                    ) : (
                                        <PlaceholderIcon company={job.company} />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. Cinematic */}
                    {presentationLayout === 'split' && (
                        <div className="w-full h-full relative overflow-hidden flex items-end bg-theme-bg/30">
                            {job.image && job.image.length > 0 ? (
                                <div className="absolute inset-0 z-0">
                                    {job.image[0].toLowerCase().endsWith('.pdf') ? (
                                        <div className="w-full h-full opacity-20 dark:brightness-[0.35] brightness-[1.1] grayscale-[0.2]">
                                            <PdfRenderer url={job.image[0]} isExpanded={true} priority={true} />
                                        </div>
                                    ) : (
                                        <Image src={job.image[0]} alt={`${job.title} at ${job.company}`} fill sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 30vw" quality={75} className={`object-cover transition-all duration-1000 dark:brightness-[0.35] brightness-[1.1] grayscale-[0.2] opacity-20`} priority={true} />
                                    )}
                                    <div className={`absolute inset-0 bg-gradient-to-t from-theme-bg-dark via-transparent to-transparent`} />
                                </div>
                            ) : (
                                <div className={`absolute inset-0 z-0 bg-theme-bg dark:bg-theme-bg-dark flex items-center justify-center opacity-10`}>
                                    <Briefcase size={400} className="text-theme-500" />
                                </div>
                            )}

                            <div className="relative z-10 w-full max-w-6xl mx-auto p-8 md:p-16 mb-16">
                                <div className="flex flex-col md:flex-row items-end justify-between gap-12">
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <span className="w-16 h-1.5 bg-theme-500 rounded-full" />
                                            <h2 className="text-theme-700 dark:text-theme-300 font-black text-2xl tracking-tight">{job.year}</h2>
                                        </div>
                                        <h3 className={`text-3xl md:text-5xl font-black leading-[0.85] tracking-tighter text-foreground`}>{job.title}<TagBadge labels={job.tag} /></h3>
                                        <div className="flex items-center gap-4 mt-2">
                                            <h4 className="text-xl md:text-3xl text-theme-700 dark:text-theme-300 font-bold italic tracking-tight">{job.company}</h4>
                                            <BookmarkButton itemType="experience" itemId={job.title} initialBookmarked={bookmarkedItemIds.includes(job.title)} isLoggedIn={!!isLoggedIn} className="relative" />
                                        </div>

                                        {job.url && (
                                            <a href={job.url} target="_blank" rel="noopener noreferrer" aria-label={`${translations?.visit_external_link_text} ${job.title}`} className="mt-4 flex items-center gap-2 px-6 py-3 bg-theme-500 text-white rounded-full font-bold text-sm hover:bg-theme-600 transition-all w-fit shadow-theme-shadow">
                                                <ExternalLink size={18} />
                                                Visit Project
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex-1 max-w-xl">
                                        <div className={`p-1 rounded-sm mb-4 inline-block bg-theme-surface-strong text-theme-700 dark:text-theme-300 text-xs font-black px-2 py-0.5`}>
                                            {job.date}
                                        </div>
                                        <HoverableWords className={`text-lg md:text-xl leading-relaxed font-medium text-foreground`}>
                                            {formatCJK(job.description, lang)}
                                        </HoverableWords>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. Editorial */}
                    {presentationLayout === 'minimal' && (
                        <div className={`w-full h-full flex items-center justify-center p-8 md:p-16 relative overflow-hidden transition-colors duration-500`}>
                            <div className={`absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none opacity-[0.04] overflow-hidden select-none transition-opacity duration-700`}>
                                <span className={`text-[35vw] font-black leading-none text-theme-500`}>{job.year}</span>
                            </div>

                            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-16 items-center relative z-10">
                                <div className="md:col-span-7 space-y-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <p className="text-theme-700 dark:text-theme-300 font-black text-xl tracking-tight">{job.date}</p>
                                            <span className="flex-grow h-px bg-theme-500/30" />
                                        </div>
                                        <h3 className={`text-3xl md:text-5xl font-black text-foreground leading-[0.85] tracking-tighter`}>
                                            {job.title}
                                            <TagBadge labels={job.tag} />
                                        </h3>
                                        <div className="flex items-center gap-4">
                                            <h4 className="text-2xl md:text-3xl font-bold text-theme-700 dark:text-theme-300 italic tracking-tight">{job.company}</h4>
                                            <BookmarkButton itemType="experience" itemId={job.title} initialBookmarked={bookmarkedItemIds.includes(job.title)} isLoggedIn={!!isLoggedIn} className="relative" />
                                        </div>
                                    </div>

                                    <div className="max-w-2xl">
                                        <HoverableWords className={`text-xl md:text-2xl leading-snug font-medium text-foreground`}>
                                            {job.description}
                                        </HoverableWords>

                                        {job.url && (
                                            <a href={job.url} target="_blank" rel="noopener noreferrer" aria-label={`${translations?.visit_external_link_text} ${job.title}`} className="mt-10 flex items-center gap-2 px-8 py-4 bg-theme-500 text-white rounded-full font-black text-base hover:bg-theme-600 transition-all w-fit shadow-theme-shadow hover:scale-105">
                                                <ExternalLink size={20} />
                                                Explore Now
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="md:col-span-5 relative group">
                                    <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-theme-shadow transition-all duration-700 group-hover:rotate-0 rotate-3 group-hover:scale-105">
                                        {job.image && job.image.length > 0 ? (
                                            job.image[0].toLowerCase().endsWith('.pdf') ? (
                                                <PdfRenderer url={job.image[0]} />
                                            ) : (
                                                <Image src={job.image[0]} alt={`${job.title} at ${job.company}`} fill sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 30vw" quality={75} className="object-cover" priority={true} />
                                            )
                                        ) : (
                                            <PlaceholderIcon company={job.company} />
                                        )}
                                    </div>
                                    <div className={`absolute -bottom-6 -left-6 w-32 h-32 border-b-[6px] border-l-[6px] border-theme-500 rounded-bl-4xl -z-10 transition-transform duration-500 group-hover:-translate-x-2 group-hover:translate-y-2`} />
                                    <div className={`absolute -top-6 -right-6 w-32 h-32 border-t-[6px] border-r-[6px] border-theme-500 rounded-tr-4xl -z-10 transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2`} />
                                </div>
                            </div>
                        </div>
                    )}
                </FadeInSection>
            ))}
        </div>
    );
}
