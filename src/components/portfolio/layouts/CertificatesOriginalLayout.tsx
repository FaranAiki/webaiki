"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import PopRotateSection from '@/components/shared/PopRotateSection';
import FadeInSection from '@/components/shared/FadeInSection';
import BookmarkButton from '@/components/interactive/BookmarkButton';
import { formatCJK } from '@/lib/utils';
import { useCertificatesContext } from '../CertificatesContext';
import { getPath } from './CertificatesShared';

const PdfPreview = dynamic(() => import('@/components/interactive/PdfPreview'), { ssr: false });

export default function CertificatesOriginalLayout() {
  const { 
    certificates,
    lang,
    isLoggedIn,
    bookmarkedItemIds,
    openCategories,
    handleCategoryClick,
    selectedYears,
    handleYearClick,
    categoryYears,
    isDark,
    titleColor,
    borderColor,
    cardBg,
    buttonInactiveBg,
    buttonInactiveText,
    translations
  } = useCertificatesContext();

  return (
    <div className="space-y-6">
      {Object.entries(certificates).map(([category, yearsData], categoryIndex) => {
        const isOpen = openCategories.includes(category);
        const activeYear = selectedYears[category] || (categoryYears[category][0] || 'All');

        const filteredFiles = (() => {
          if (activeYear === 'All') {
            return Object.values(yearsData).reduce(
              (acc, files) => ({ ...acc, ...files }),
              {}
            );
          }
          return yearsData[activeYear] || {};
        })();

        const isFirstCategory = categoryIndex === 0;

        return (
          <div key={category} className={`border-b ${borderColor} pb-4`}>
            {/* Category Title FadeIn */}
            <FadeInSection delay={50} initialVisible={true}>
                <h2 className="w-full">
                  <button
                  onClick={() => handleCategoryClick(category)}
                  className={`w-full text-left text-2xl font-bold text-gacor-smooth hover:scale-102 transition-[transform,colors]`}
                  >
                  <span dangerouslySetInnerHTML={{ __html: formatCJK(category, lang) }} />
                  </button>
                </h2>
            </FadeInSection>

            <div
            className={`transition-[transform] duration-250 animate-fade-in ease-in-out overflow-hidden ${
                isOpen ? 'max-h-[10000px] mt-4' : 'max-h-0'
            }`}
            >
            {/* Year Selection FadeIn */}
            <FadeInSection delay={50} initialVisible={true}>
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                    onClick={() => handleYearClick(category, 'All')}
                    className={`px-3 py-1 text-sm rounded-full ${
                        activeYear === 'All'
                        ? 'bg-theme-500 text-white transition-[colors,transform] hover:scale-105'
                        : `${buttonInactiveBg} ${buttonInactiveText}`
                    }`}
                    >
                    {translations.allTranslation || 'All'}
                    </button>
                    {categoryYears[category].map((year) => (
                    <button
                        key={year}
                        onClick={() => handleYearClick(category, year)}
                        className={`px-3 py-1 text-sm rounded-full ${
                        activeYear === year
                            ? 'bg-theme-500 text-white'
                            : `${buttonInactiveBg} ${buttonInactiveText} transition-[transform,colors] hover:scale-105`
                        }`}
                    >
                        {year}
                    </button>
                    ))}
                </div>
            </FadeInSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Object.entries(filteredFiles).map(([fileName, fileData], index) => {
                const filePath = getPath(fileData);
                const isFirstItem = isFirstCategory && index < 3;
                return (
                <PopRotateSection delay={50} key={fileName} className="h-full" initialVisible={isFirstItem}>
                    <div
                        className={`${cardBg} rounded-lg overflow-hidden shadow-lg transition-[colors,transform,opacity] hover:scale-105 hover:opacity-100 opacity-90 h-full flex flex-col transform-gpu`}
                        style={{ boxShadow: isDark ? 'inset 0 0 0 1px rgba(255,255,255,0.1)' : 'inset 0 0 0 1px rgba(0,0,0,0.1)' }}
                    >
                        <a
                        href={filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${fileName} certificate`}
                        className="block h-48 w-full relative"
                        >
                        {filePath.endsWith('.pdf') ? (
                            <div className="w-full h-full overflow-hidden">
                                <PdfPreview fileUrl={filePath} />
                            </div>
                        ) : (
                            <Image
                            src={filePath}
                            alt={`${fileName} Certificate`}
                            fill
                            className="object-cover scale-[1.01]"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        )}
                        </a>
                        <BookmarkButton 
                            itemType="certificate" 
                            itemId={fileName} 
                            initialBookmarked={bookmarkedItemIds.includes(fileName)} 
                            isLoggedIn={isLoggedIn} 
                        />
                        <div className="p-4 flex-grow">
                        <h3 className={`font-semibold ${titleColor} truncate hover-gacor`}>
                            <span dangerouslySetInnerHTML={{ __html: formatCJK(fileName, lang) }} />
                        </h3>
                        </div>
                    </div>
                </PopRotateSection>
                );})}
            </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
