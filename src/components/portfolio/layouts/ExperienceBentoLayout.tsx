"use client";

import React, { useMemo } from 'react';
import { m as motion } from 'framer-motion';
import { useExperienceContext } from '../ExperienceContext';
import { BentoCard } from './ExperienceShared';

export default function ExperienceBentoLayout() {
    const { 
        paginatedExperiences, 
        cardBorder,
        inactiveCardBg,
        isDark,
        lang,
        justifyClass,
        bookmarkedItemIds,
        isLoggedIn,
        translations
    } = useExperienceContext();
    
    const allJobs = useMemo(() => paginatedExperiences.flatMap(e => e.jobs), [paginatedExperiences]);

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px]"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08 } }
            }}
        >
            {allJobs.map((job, idx) => {
                const spans = ["md:col-span-2 md:row-span-2", "md:col-span-2 md:row-span-1", "md:col-span-1 md:row-span-1", "md:col-span-1 md:row-span-1", "md:col-span-1 md:row-span-1", "md:col-span-3 md:row-span-1", "md:col-span-2 md:row-span-1", "md:col-span-2 md:row-span-2"];
                const spanClass = spans[idx % spans.length];
                return (
                    <BentoCard 
                        key={`${job.year}-${idx}`} 
                        job={job} 
                        spanClass={spanClass} 
                        cardBorder={cardBorder} 
                        inactiveCardBg={inactiveCardBg} 
                        isDark={isDark} 
                        lang={lang} 
                        justifyClass={justifyClass} 
                        click_to_close_text={translations?.click_to_close_text || "Click to close"} 
                        priority={idx < 4}
                        isLoggedIn={isLoggedIn} 
                        bookmarkedItemIds={bookmarkedItemIds} 
                    />
                );
            })}
        </motion.div>
    );
}
