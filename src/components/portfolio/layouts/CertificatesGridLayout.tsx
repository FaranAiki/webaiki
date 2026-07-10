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

export default function CertificatesGridLayout() {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Object.entries(certificates).flatMap(([category, yearsData]) =>
          Object.entries(yearsData).flatMap(([year, files]) =>
              Object.entries(files).map(([fileName, fileData]) => ({ category, year, fileName, fileData }))
          )
        ).map((item) => {
            const filePath = getPath(item.fileData);
            return (
            <motion.div
                key={`${item.category}-${item.year}-${item.fileName}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`${cardBg} rounded-2xl overflow-hidden border ${borderColor} shadow-md group transform-gpu`}
            >
                <a href={filePath} target="_blank" rel="noopener noreferrer" aria-label={`View ${item.fileName} certificate`} className="block relative aspect-video">
                  {filePath.endsWith('.pdf') ? (
                      <div className="w-full h-full overflow-hidden">
                          <PdfPreview fileUrl={filePath} />
                      </div>
                  ) : (
                      <Image src={filePath} alt={`${item.fileName} Certificate`} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />
                  )}
                </a>
                <BookmarkButton 
                    itemType="certificate" 
                    itemId={item.fileName} 
                    initialBookmarked={bookmarkedItemIds.includes(item.fileName)} 
                    isLoggedIn={isLoggedIn} 
                />
                <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-bold text-gacor-smooth tracking-tighter"><span dangerouslySetInnerHTML={{ __html: formatCJK(item.category, lang) }} /></span>
                        <span className={`text-sm font-mono text-theme-muted`}>{item.year}</span>
                    </div>
                    <h2 className={`text-sm font-bold ${titleColor} hover-gacor line-clamp-1`}><span dangerouslySetInnerHTML={{ __html: formatCJK(item.fileName, lang) }} /></h2>
                </div>
            </motion.div>
        );})}
    </div>
  );
}
