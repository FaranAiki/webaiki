'use client';

import { useState, useMemo, useEffect } from 'react';
import PdfPreview from '@/components/PdfPreview';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import PopRotateSection from '@/components/PopRotateSection';
import FadeInSection from '@/components/FadeInSection';
import { usePresentation } from './PresentationContext';
import { formatCJK } from '@/lib/utils';
import { LayoutSwitcher } from './LayoutSwitcher';
import { LayoutPanelLeft, Milestone, LayoutGrid, Grid2X2 } from 'lucide-react';
import { motion } from 'framer-motion';

export type CertificateData = {
  [category: string]: {
    [year: string]: {
      [fileName: string]: string;
    };
  };
};

interface BentoCertificateCardProps {
    fileName: string;
    filePath: string;
    category: string;
    year: string;
    borderColor: string;
    cardBg: string;
    isDark: boolean;
    lang: string;
    titleColor: string;
    click_to_close_text: string;
    spanClass: string;
}

const BentoCertificateCard = ({ 
    fileName, filePath, category, year, borderColor, cardBg, isDark, lang, titleColor, click_to_close_text, spanClass 
}: BentoCertificateCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onClick={() => setIsExpanded(!isExpanded)}
            className={`${spanClass} relative rounded-3xl overflow-hidden group border ${borderColor} ${cardBg} shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer h-full`}
        >
            <div className="absolute inset-0">
                {filePath.endsWith('.pdf') ? (
                    <div className={`w-full h-full transition-all duration-700 ${isExpanded ? 'scale-110 blur-sm brightness-[0.3]' : 'opacity-60 group-hover:opacity-100'}`}>
                        <PdfPreview fileUrl={filePath} />
                    </div>
                ) : (
                    <Image 
                        src={filePath} 
                        alt={fileName} 
                        fill 
                        className={`object-cover transition-all duration-700 ${isExpanded ? 'scale-110 blur-sm brightness-[0.3]' : 'opacity-60 group-hover:opacity-100'}`} 
                    />
                )}
            </div>
            
            {/* Base Content */}
            <div className={`absolute inset-0 p-6 flex flex-col justify-end transition-opacity duration-500 bg-gradient-to-t ${isDark ? 'from-black/80' : 'from-white/90'} via-transparent to-transparent ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <p className="text-cyan-500 text-[10px] font-bold mb-1 uppercase tracking-widest">{year} • {formatCJK(category, lang)}</p>
                <h3 className={`text-sm font-black leading-tight ${titleColor}`}>{formatCJK(fileName, lang)}</h3>
            </div>

            {/* Expanded Content (Overlay) */}
            <motion.div 
                initial={false}
                animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className={`absolute inset-0 z-10 p-6 flex flex-col justify-center backdrop-blur-md ${isDark ? 'bg-black/60' : 'bg-white/80'} ${isExpanded ? 'pointer-events-auto' : 'pointer-events-none'}`}
            >
                <div className="overflow-y-auto max-h-full flex flex-col items-center justify-center text-center">
                    <p className="text-cyan-500 text-xs font-bold mb-2 uppercase tracking-widest">{year}</p>
                    <h3 className={`text-xl font-black mb-2 ${titleColor}`}>{formatCJK(fileName, lang)}</h3>
                    <p className={`text-sm italic mb-6 ${isDark ? 'text-cyan-300' : 'text-cyan-600'}`}>{formatCJK(category, lang)}</p>
                    
                    <a 
                        href={filePath} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-cyan-500 text-white rounded-full font-bold text-sm hover:bg-cyan-600 transition-colors shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        View Full Document
                    </a>
                </div>
                
                {/* Close hint */}
                <div className={`absolute top-4 right-4 text-[10px] font-medium px-2 py-1 rounded-full ${isDark ? 'text-white/50 bg-white/10' : 'text-gray-500 bg-gray-200/50'}`}>
                    {click_to_close_text}
                </div>
            </motion.div>
        </motion.div>
    );
};
BentoCertificateCard.displayName = 'BentoCertificateCard';

export type CertificatesDisplayProps = {
  certificates: CertificateData;
  allTranslation: string;
  lang?: string;
  original_text?: string;
  timeline_text?: string;
  grid_text?: string;
  bento_text?: string;
  click_to_close_text?: string;
};

export default function CertificatesDisplay({ 
  certificates, 
  allTranslation, 
  lang = 'en',
  original_text = 'Original',
  timeline_text = 'Timeline',
  grid_text = 'Grid',
  bento_text = 'Bento',
  click_to_close_text = 'Click to close'
}: CertificatesDisplayProps) {
  const [currentLayout, setCurrentLayout] = useState<'original' | 'timeline' | 'grid' | 'bento'>('original');
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<{ [key: string]: string }>({});
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isPresentationMode } = usePresentation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCategoryClick = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleYearClick = (category: string, year: string) => {
    setSelectedYears((prev) => ({ ...prev, [category]: year }));
  };

  const categoryYears = useMemo(() => {
    const years: { [key: string]: string[] } = {};
    for (const category in certificates) {
      years[category] = Object.keys(certificates[category]).sort((a, b) =>
        b.localeCompare(a)
      );
    }
    return years;
  }, [certificates]);

  // Flatten for presentation mode: Each slide is a category + specific year, max 4 items per slide
  const allSlides = useMemo(() => {
    const slides: { 
      category: string; 
      year: string; 
      files: [string, string][]; 
      part?: number; 
      totalParts?: number 
    }[] = [];
    
    const sortedCategories = Object.keys(certificates).sort();
    
    for (const category of sortedCategories) {
      const yearsData = certificates[category];
      const sortedYears = Object.keys(yearsData).sort((a, b) => b.localeCompare(a));
      
      for (const year of sortedYears) {
        const fileEntries = Object.entries(yearsData[year]);
        const chunkSize = 6;
        const totalParts = Math.ceil(fileEntries.length / chunkSize);
        
        for (let i = 0; i < fileEntries.length; i += chunkSize) {
          slides.push({
            category,
            year,
            files: fileEntries.slice(i, i + chunkSize),
            part: Math.floor(i / chunkSize) + 1,
            totalParts: totalParts
          });
        }
      }
    }
    return slides;
  }, [certificates]);

  const isDark = mounted && resolvedTheme === 'dark';
  const hasCertificates = useMemo(() => {
    return Object.values(certificates).some(yearsData => 
      Object.values(yearsData).some(files => Object.keys(files).length > 0)
    );
  }, [certificates]);
  
  // Dynamic Classes
  const titleColor = isDark ? 'text-white' : 'text-gray-900';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const buttonInactiveBg = isDark ? 'bg-gray-800' : 'bg-gray-200';
  const buttonInactiveText = isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-300';

  return (
    <div className={`w-full h-full ${isPresentationMode ? 'presentation-container flex flex-row flex-nowrap w-full h-screen' : ''}`}>
      {/* Presentation Mode: Max 6 items per slide */}
      {isPresentationMode && allSlides.map((slide, idx) => (
        <FadeInSection
          key={`${slide.category}-${slide.year}-p${slide.part}`}
          className="w-full h-full flex-shrink-0"
          slideIndex={idx + 1}
          totalSlides={allSlides.length}
        >
          <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto p-4 pt-16 pb-8">
            <h2 className="text-xl md:text-3xl font-black mb-6 text-center flex flex-wrap justify-center items-center gap-x-4">
              <span className="text-cyan-500">{formatCJK(slide.category, lang)}</span>
              <span className="text-gray-500">|</span>
              <span className={titleColor}>{slide.year}</span>
              {slide.totalParts && slide.totalParts > 1 && (
                <span className="text-base md:text-lg text-gray-400 font-mono">
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
              {slide.files.map(([fileName, filePath]) => (
                <div key={fileName} className="flex flex-col items-center group w-full max-w-[300px] md:max-w-[350px]">
                  <div 
                    className={`${cardBg} w-full aspect-[4/3] relative mb-4 rounded-xl overflow-hidden shadow-xl transition-transform group-hover:scale-105 transform-gpu`}
                    style={{ boxShadow: isDark ? 'inset 0 0 0 2px rgba(255,255,255,0.1)' : 'inset 0 0 0 2px rgba(0,0,0,0.1)' }}
                  >
                    {(filePath as string).endsWith('.pdf') ? (
                      <div className="w-full h-full flex justify-center items-center overflow-hidden">
                        <PdfPreview fileUrl={filePath as string} width={350} />
                      </div>
                    ) : (
                      <Image
                        src={filePath as string}
                        alt={fileName}
                        fill
                        className="object-contain scale-[1.01]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                  </div>
                  <p className={`text-center font-bold text-sm md:text-xl lg:text-2xl ${isDark ? 'text-gray-200' : 'text-gray-800'} line-clamp-2 px-2 leading-tight`}>
                    {formatCJK(fileName, lang)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>
      ))}

      {/* Normal Mode */}
      {!isPresentationMode && (
        <div className="block w-full max-w-5xl mx-auto p-4 space-y-6 pt-8">
          {hasCertificates && (
            <LayoutSwitcher
                currentLayout={currentLayout}
                setCurrentLayout={setCurrentLayout}
                isDark={isDark}
                canChange={true}
                options={[
                    { id: 'original', icon: <LayoutPanelLeft size={18} />, label: original_text },
                    { id: 'timeline', icon: <Milestone size={18} />, label: timeline_text },
                    { id: 'grid', icon: <LayoutGrid size={18} />, label: grid_text },
                    { id: 'bento', icon: <Grid2X2 size={18} />, label: bento_text }
                ]}
            />
          )}

          {currentLayout === 'original' && (
              <div className="space-y-6">
                {Object.entries(certificates).map(([category, yearsData]) => {
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

                  return (
                    <div key={category} className={`border-b ${borderColor} pb-4`}>
                      {/* Category Title FadeIn */}
                      <FadeInSection delay={50}>
                          <button
                          onClick={() => handleCategoryClick(category)}
                          className={`w-full text-left text-2xl font-bold ${titleColor} hover:text-cyan-500 hover:scale-102 transition-[transform,colors]`}
                          >
                          {formatCJK(category, lang)}
                          </button>
                      </FadeInSection>

                      <div
                      className={`transition-[transform] duration-250 animate-fade-in ease-in-out overflow-hidden ${
                          isOpen ? 'max-h-[10000px] mt-4' : 'max-h-0'
                      }`}
                      >
                      {/* Year Selection FadeIn */}
                      <FadeInSection delay={50}>
                          <div className="flex flex-wrap gap-2 mb-6">
                              <button
                              onClick={() => handleYearClick(category, 'All')}
                              className={`px-3 py-1 text-sm rounded-full ${
                                  activeYear === 'All'
                                  ? 'bg-cyan-500 text-white transition-[colors,transform] hover:scale-105'
                                  : `${buttonInactiveBg} ${buttonInactiveText}`
                              }`}
                              >
                              {allTranslation}
                              </button>
                              {categoryYears[category].map((year) => (
                              <button
                                  key={year}
                                  onClick={() => handleYearClick(category, year)}
                                  className={`px-3 py-1 text-sm rounded-full ${
                                  activeYear === year
                                      ? 'bg-cyan-500 text-white'
                                      : `${buttonInactiveBg} ${buttonInactiveText} transition-[transform,colors] hover:scale-105`
                                  }`}
                              >
                                  {year}
                              </button>
                              ))}
                          </div>
                      </FadeInSection>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                          {Object.entries(filteredFiles).map(([fileName, filePath]) => (
                          <PopRotateSection delay={50} key={fileName} className="h-full">
                              <div
                                  className={`${cardBg} rounded-lg overflow-hidden shadow-lg transition-[colors,transform,opacity] hover:scale-105 hover:opacity-100 opacity-90 h-full flex flex-col transform-gpu`}
                                  style={{ boxShadow: isDark ? 'inset 0 0 0 1px rgba(255,255,255,0.1)' : 'inset 0 0 0 1px rgba(0,0,0,0.1)' }}
                              >
                                  <a
                                  href={filePath as string}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block h-48 w-full relative"
                                  >
                                  {(filePath as string).endsWith('.pdf') ? (
                                      <div className="w-full h-full overflow-hidden">
                                          <PdfPreview fileUrl={filePath as string} />
                                      </div>
                                  ) : (
                                      <Image
                                      src={filePath as string}
                                      alt={fileName}
                                      fill
                                      className="object-cover scale-[1.01]"
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                      />
                                  )}
                                  </a>
                                  <div className="p-4 flex-grow">
                                  <h3 className={`font-semibold ${titleColor} truncate`}>
                                      {formatCJK(fileName, lang)}
                                  </h3>
                                  </div>
                              </div>
                          </PopRotateSection>
                          ))}
                      </div>
                      </div>
                    </div>
                  );
                })}
              </div>
          )}

          {currentLayout === 'timeline' && (
              <div className="relative border-l-2 border-cyan-500/30 ml-4 md:ml-8 space-y-12">
                  {Object.entries(certificates).flatMap(([category, yearsData]) => 
                    Object.entries(yearsData).map(([year, files]) => ({ category, year, files }))
                  ).sort((a, b) => b.year.localeCompare(a.year)).map((item) => (
                      <div key={`${item.category}-${item.year}`} className="relative pl-8">
                          <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-cyan-500 border-4 border-white dark:border-gray-900 shadow-sm" />
                          <div className="flex flex-wrap items-baseline gap-x-4 mb-6">
                              <h2 className={`text-3xl font-black text-cyan-500`}>{item.year}</h2>
                              <h3 className={`text-xl font-bold ${titleColor} opacity-70`}>{formatCJK(item.category, lang)}</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {Object.entries(item.files).map(([fileName, filePath]) => (
                                  <motion.div
                                      key={fileName}
                                      initial={{ opacity: 0, x: 20 }}
                                      whileInView={{ opacity: 1, x: 0 }}
                                      viewport={{ once: true }}
                                      className={`${cardBg} overflow-hidden rounded-xl border ${borderColor} flex flex-col shadow-md group transform-gpu`}
                                  >
                                      <a href={filePath} target="_blank" rel="noopener noreferrer" className="relative aspect-video w-full overflow-hidden">
                                          {(filePath as string).endsWith('.pdf') ? (
                                              <div className="w-full h-full">
                                                  <PdfPreview fileUrl={filePath as string} />
                                              </div>
                                          ) : (
                                              <Image src={filePath} alt={fileName} fill className="object-cover transition-transform group-hover:scale-105" />
                                          )}
                                      </a>
                                      <div className="p-3">
                                          <h4 className={`font-bold ${titleColor} line-clamp-1 text-sm`}>{formatCJK(fileName, lang)}</h4>
                                      </div>
                                  </motion.div>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          )}

          {currentLayout === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Object.entries(certificates).flatMap(([category, yearsData]) => 
                    Object.entries(yearsData).flatMap(([year, files]) => 
                        Object.entries(files).map(([fileName, filePath]) => ({ category, year, fileName, filePath }))
                    )
                  ).map((item) => (
                      <motion.div
                          key={`${item.category}-${item.year}-${item.fileName}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          whileHover={{ y: -5 }}
                          className={`${cardBg} rounded-2xl overflow-hidden border ${borderColor} shadow-md group transform-gpu`}
                      >
                          <a href={item.filePath} target="_blank" rel="noopener noreferrer" className="block relative aspect-video">
                            {(item.filePath as string).endsWith('.pdf') ? (
                                <div className="w-full h-full overflow-hidden">
                                    <PdfPreview fileUrl={item.filePath as string} />
                                </div>
                            ) : (
                                <Image src={item.filePath} alt={item.fileName} fill className="object-cover" />
                            )}
                          </a>
                          <div className="p-4">
                              <div className="flex justify-between items-start mb-1">
                                  <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-tighter">{formatCJK(item.category, lang)}</span>
                                  <span className={`text-[10px] font-mono ${titleColor} opacity-50`}>{item.year}</span>
                              </div>
                              <h3 className={`text-sm font-bold ${titleColor} line-clamp-1`}>{formatCJK(item.fileName, lang)}</h3>
                          </div>
                      </motion.div>
                  ))}
              </div>
          )}

          {currentLayout === 'bento' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
                  {Object.entries(certificates).flatMap(([category, yearsData]) => 
                    Object.entries(yearsData).flatMap(([year, files]) => 
                        Object.entries(files).map(([fileName, filePath]) => ({ category, year, fileName, filePath }))
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
                      return (
                          <BentoCertificateCard 
                              key={`${item.category}-${item.year}-${item.fileName}`}
                              fileName={item.fileName}
                              filePath={item.filePath}
                              category={item.category}
                              year={item.year}
                              borderColor={borderColor}
                              cardBg={cardBg}
                              isDark={isDark}
                              lang={lang}
                              titleColor={titleColor}
                              click_to_close_text={click_to_close_text}
                              spanClass={spanClass}
                          />
                      );
                  })}
              </div>
          )}
        </div>
      )}
    </div>
  );
}
