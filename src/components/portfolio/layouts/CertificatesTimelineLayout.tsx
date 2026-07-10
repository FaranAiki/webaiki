"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { m as motion } from 'framer-motion';
import BookmarkButton from '@/components/interactive/BookmarkButton';
import { formatCJK } from '@/lib/utils';
import { useCertificatesContext } from '../CertificatesContext';
import { getPath } from './CertificatesShared';

const PdfPreview = dynamic(() => import('@/components/interactive/PdfPreview'), { ssr: false });

export default function CertificatesTimelineLayout() {
  const { 
    certificates,
    lang,
    isLoggedIn,
    bookmarkedItemIds,
    titleColor,
    borderColor,
    cardBg
  } = useCertificatesContext();

  return (
    <div className="relative border-l-2 border-theme-500/30 ml-4 md:ml-8 space-y-12">
        {Object.entries(certificates).flatMap(([category, yearsData]) =>
          Object.entries(yearsData).map(([year, files]) => ({ category, year, files }))
         ).sort((a, b) => b.year.localeCompare(a.year)).map((item, itemIdx) => (
            <div key={`${item.category}-${item.year}`} className="relative pl-8">
                <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-theme-500 border-4 border-theme-surface dark:border-theme-bg-dark shadow-sm" />
                <div className="flex flex-wrap items-baseline gap-x-4 mb-6">
                    <h2 className={`text-3xl font-black text-gacor-smooth`}>{item.year}</h2>
                    <h3 className={`text-xl font-bold text-gacor-smooth`}><span dangerouslySetInnerHTML={{ __html: formatCJK(item.category, lang) }} /></h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(item.files).map(([fileName, fileData], fileIdx) => {
                        const filePath = getPath(fileData);
                        const isPriority = itemIdx === 0 && fileIdx < 3;
                        return (
                        <motion.div
                            key={fileName}
                            initial={isPriority ? false : { opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`${cardBg} overflow-hidden rounded-xl border ${borderColor} flex flex-col shadow-md group transform-gpu`}
                        >
                            <a href={filePath} target="_blank" rel="noopener noreferrer" aria-label={`View ${fileName} certificate`} className="relative aspect-video w-full overflow-hidden">
                                {filePath.endsWith('.pdf') ? (
                                    <div className="w-full h-full">
                                        <PdfPreview fileUrl={filePath} priority={false} />
                                    </div>
                                ) : (
                                    <Image src={filePath} alt={`${fileName} Certificate`} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" priority={false} quality={85} />
                                )}
                            </a>
                            <BookmarkButton 
                                itemType="certificate" 
                                itemId={fileName} 
                                initialBookmarked={bookmarkedItemIds.includes(fileName)} 
                                isLoggedIn={isLoggedIn} 
                            />
                            <div className="p-3">
                                <h4 className={`font-bold ${titleColor} hover-gacor line-clamp-1 text-sm`}><span dangerouslySetInnerHTML={{ __html: formatCJK(fileName, lang) }} /></h4>
                            </div>
                        </motion.div>
                    );})}
                </div>
            </div>
        ))}
    </div>
  );
}
