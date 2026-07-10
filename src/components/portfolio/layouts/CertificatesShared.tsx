"use client";

import React, { useState } from 'react';

import Image from 'next/image';
import { m as motion } from 'framer-motion';
import BookmarkButton from '@/components/interactive/BookmarkButton';
import { formatCJK } from '@/lib/utils';


export const getPath = (data: string | { path: string; point: number }): string => {
  if (typeof data === 'string') return data;
  return data?.path || '';
};

export interface BentoCertificateCardProps {
    fileName: string;
    filePath: string;
    category: string;
    year: string;
    isDark: boolean;
    lang: string;
    titleColor: string;
    click_to_close_text: string;
    spanClass: string;
    priority?: boolean;
    isLoggedIn?: boolean;
    isBookmarked?: boolean;
}

export const BentoCertificateCard = React.memo(({
    fileName, filePath, category, year, isDark, lang, titleColor, click_to_close_text, spanClass, priority, isLoggedIn, isBookmarked
}: BentoCertificateCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            initial={priority ? false : { opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onClick={() => setIsExpanded(!isExpanded)}
            className={`${spanClass} relative rounded-3xl overflow-hidden group transition-all duration-500 cursor-pointer h-full transform-gpu`}
        >
            <div className="absolute inset-0">
                    <Image
                        src={filePath}
                        alt={`${fileName} Certificate`}
                        fill
                        priority={priority} fetchPriority={priority ? "high" : "auto"}
                        className={`object-cover transition-all duration-700 ${isExpanded ? 'scale-110 blur-sm brightness-[0.3]' : 'opacity-80 group-hover:opacity-100'}`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
            </div>
            
            <BookmarkButton 
                itemType="certificate" 
                itemId={fileName} 
                initialBookmarked={!!isBookmarked} 
                isLoggedIn={!!isLoggedIn} 
            />

            {/* Base Content - Shows only on hover or when not expanded */}
            <div className={`absolute inset-0 p-6 flex flex-col justify-end transition-all duration-500 bg-gradient-to-t ${isDark ? 'from-theme-bg-dark/90 via-theme-bg-dark/40' : 'from-theme-surface/95 via-theme-surface/60'} to-transparent opacity-0 group-hover:opacity-100 ${isExpanded ? 'opacity-0 pointer-events-none' : ''}`}>
                <p className="text-theme-600 dark:text-theme-400 text-sm font-black mb-1 tracking-widest">{year} • <span dangerouslySetInnerHTML={{ __html: formatCJK(category, lang) }} /></p>
                <h2 className={`text-sm font-black leading-tight ${titleColor} line-clamp-2`}><span dangerouslySetInnerHTML={{ __html: formatCJK(fileName, lang) }} /></h2>
            </div>

            {/* Expanded Content (Overlay) */}
            <motion.div
                initial={false}
                animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className={`absolute inset-0 z-10 p-6 flex flex-col justify-center backdrop-blur-md md:backdrop-blur-xl ${isDark ? 'bg-theme-bg-dark/60' : 'bg-theme-surface/80'} ${isExpanded ? 'pointer-events-auto' : 'pointer-events-none'}`}
            >
                <div className="overflow-y-auto max-h-full flex flex-col items-center justify-center text-center" data-lenis-prevent>
                    <p className="text-theme-500 text-xs font-bold mb-2 tracking-widest">{year}</p>
                    <h2 className={`text-xl font-black mb-2 ${titleColor}`}><span dangerouslySetInnerHTML={{ __html: formatCJK(fileName, lang) }} /></h2>
                    <p className={`text-sm italic mb-6 text-gacor-smooth`}><span dangerouslySetInnerHTML={{ __html: formatCJK(category, lang) }} /></p>

                    <a
                        href={filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-theme-500 text-white rounded-full font-bold text-sm hover:bg-theme-600 transition-colors shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        View Full Document
                    </a>
                </div>

                {/* Close hint */}
                <div className={`absolute top-4 right-4 text-sm font-medium px-2 py-1 rounded-full ${isDark ? 'text-white/50 bg-theme-surface-strong/10' : 'text-theme-muted bg-theme-surface-strong/50'}`}>
                    {click_to_close_text}
                </div>
            </motion.div>
        </motion.div>
    );
});
BentoCertificateCard.displayName = 'BentoCertificateCard';
