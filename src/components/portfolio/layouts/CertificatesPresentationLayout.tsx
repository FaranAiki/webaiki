"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import FadeInSection from '@/components/shared/FadeInSection';
import { formatCJK } from '@/lib/utils';
import { useCertificatesContext } from '../CertificatesContext';
import { getPath } from './CertificatesShared';

const PdfPreview = dynamic(() => import('@/components/interactive/PdfPreview'), { ssr: false });

export default function CertificatesPresentationLayout() {
  const { 
    allSlides,
    lang,
    titleColor,
    cardBg
  } = useCertificatesContext();

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const onWheel = (e: WheelEvent) => {
          if (e.deltaY === 0) return;
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
              e.preventDefault();
              el.scrollBy({ left: e.deltaY > 0 ? window.innerWidth : -window.innerWidth, behavior: 'smooth' });
          }
      };
      el.addEventListener('wheel', onWheel, { passive: false });
      return () => el.removeEventListener('wheel', onWheel);
  }, []);

  React.useEffect(() => {
      // Prevent body vertical scroll
      document.body.style.overflow = 'hidden';
      return () => {
          document.body.style.overflow = '';
      };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[calc(100vh-6rem)] relative presentation-container flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth">
      {allSlides.map((slide, idx) => (
        <FadeInSection
          key={`${slide.category}-${slide.year}-p${slide.part}`}
          className="w-full min-w-full h-full flex-shrink-0 snap-center flex flex-col justify-center bg-white dark:bg-theme-bg shadow-2xl dark:shadow-none text-black dark:text-white"
          slideIndex={idx + 1}
          totalSlides={allSlides.length}
        >
          <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto p-4 pb-8">
            <h2 className="text-xl md:text-3xl font-black mb-6 text-center flex flex-wrap justify-center items-center gap-x-4">
              <span className="text-theme-500"><span dangerouslySetInnerHTML={{ __html: formatCJK(slide.category, lang) }} /></span>
              <span className="text-theme-muted">|</span>
              <span className={titleColor}>{slide.year}</span>
              {slide.totalParts && slide.totalParts > 1 && (
                <span className="text-base md:text-lg text-theme-muted font-mono">
                  [{slide.part}/{slide.totalParts}]
                </span>
              )}
            </h2>

            <div className={`grid gap-4 md:gap-8 w-full max-h-[75vh] p-2 overflow-visible no-scrollbar justify-items-center ${
              slide.files.length === 4
                ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl'
                : slide.files.length === 1
                ? 'grid-cols-1'
                : slide.files.length === 2
                ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}>
              {slide.files.map(([fileName, fileData]) => {
                const filePath = getPath(fileData);
                return (
                  <div key={fileName} className="flex flex-col items-center group w-full max-w-[300px] md:max-w-[350px]">
                    <div
                      className={`${cardBg} w-full aspect-[4/3] relative mb-4 rounded-xl overflow-hidden shadow-xl transition-transform group-hover:scale-105 transform-gpu`}
                      style={{ boxShadow: 'inset 0 0 0 2px rgba(var(--theme-border-rgb),0.1)' }}
                    >
                      {filePath.endsWith('.pdf') ? (
                        <div className="w-full h-full flex justify-center items-center overflow-hidden">
                          <PdfPreview fileUrl={filePath} width={350} priority={false} />
                        </div>
                      ) : (
                        <Image
                          src={filePath}
                          alt={`${fileName} Certificate`}
                          fill
                          className="object-contain scale-[1.01]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      )}
                    </div>
                    <p className={`text-center font-bold text-sm md:text-xl lg:text-2xl text-inherit line-clamp-2 px-2 leading-tight`}>
                      <span dangerouslySetInnerHTML={{ __html: formatCJK(fileName, lang) }} />
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeInSection>
      ))}
    </div>
  );
}
