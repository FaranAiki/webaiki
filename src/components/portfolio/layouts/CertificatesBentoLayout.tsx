"use client";

import React from 'react';
import { useCertificatesContext } from '../CertificatesContext';
import { getPath, BentoCertificateCard } from './CertificatesShared';

export default function CertificatesBentoLayout() {
  const { 
    certificates,
    lang,
    isLoggedIn,
    bookmarkedItemIds,
    titleColor,
    isDark,
    translations
  } = useCertificatesContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px]">
        {Object.entries(certificates).flatMap(([category, yearsData]) =>
          Object.entries(yearsData).flatMap(([year, files]) =>
              Object.entries(files).map(([fileName, fileData]) => ({ category, year, fileName, fileData }))
          )
        ).map((item, idx) => {
            const spans = [
                "md:col-span-2 md:row-span-2",
                "md:col-span-2 md:row-span-1",
                "md:col-span-1 md:row-span-1",
                "md:col-span-1 md:row-span-1",
                "md:col-span-1 md:row-span-1",
                "md:col-span-3 md:row-span-1",
                "md:col-span-2 md:row-span-1",
                "md:col-span-2 md:row-span-2",
            ];
            const spanClass = spans[idx % spans.length];
            const filePath = getPath(item.fileData);
            return (
                <BentoCertificateCard
                    key={`${item.category}-${item.year}-${item.fileName}`}
                    fileName={item.fileName}
                    filePath={filePath}
                    category={item.category}
                    year={item.year}
                    isDark={isDark}
                    lang={lang}
                    titleColor={titleColor}
                    click_to_close_text={translations?.click_to_close_text || 'Click to close'}
                    spanClass={spanClass}
                    priority={false}
                    isLoggedIn={isLoggedIn}
                    isBookmarked={bookmarkedItemIds.includes(item.fileName)}
                />
            );
        })}
    </div>
  );
}
