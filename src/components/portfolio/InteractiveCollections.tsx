"use client";

import { useState, useEffect, useMemo } from 'react';
import { ChevronRight, Link as LinkIcon, XCircle, LayoutPanelLeft, Milestone, LayoutGrid } from 'lucide-react';
import { useTheme } from 'next-themes';
import FadeInSection from '@/components/shared/FadeInSection';
import PopRotateSection from '@/components/shared/PopRotateSection';
import { usePresentation } from '../providers/PresentationContext';
import { formatCJK } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LayoutSwitcher } from '../shared/LayoutSwitcher';

// Define typescript data
export type CollectionsData = Record<string, Record<string, Record<string, { path: string; point: number }>>>;

export type CollectionLayoutType = 'original' | 'timeline' | 'grid';

export type InteractiveCollectionsProps = {
  data: CollectionsData;
  force_click: boolean; // Use 'boolean', not 'bool'
  lang?: string;
  original_text?: string;
  timeline_text?: string;
  grid_text?: string;
};

const getPath = (data: string | { path: string; point: number }): string => {
  if (typeof data === 'string') return data;
  return data?.path || '';
};

export default function InteractiveCollections( {
  data,
  force_click,
  lang = 'en',
  original_text = 'Original',
  timeline_text = 'Timeline',
  grid_text = 'Grid'
}: InteractiveCollectionsProps ) {
  const [currentLayout, setCurrentLayout] = useState<CollectionLayoutType>('original');
  const [activeHeadingOne, setActiveHeadingOne] = useState<string | null>(null);
  const [activeHeadingTwo, setActiveHeadingTwo] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isPresentationMode } = usePresentation();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Flatten for presentation mode: Max 4 items per slide
  const allSlides = useMemo(() => {
    const slides: {
      headingOne: string;
      headingTwo: string;
      documents: [string, { path: string; point: number }][];
      part: number;
      totalParts: number;
    }[] = [];

    const sortedHeadingOnes = Object.keys(data).sort();

    for (const h1 of sortedHeadingOnes) {
      const headingTwos = data[h1];
      const sortedHeadingTwos = Object.keys(headingTwos).sort();

      for (const h2 of sortedHeadingTwos) {
        const docEntries = Object.entries(headingTwos[h2]);
        if (docEntries.length > 0) {
          const chunkSize = 6;
          const totalParts = Math.ceil(docEntries.length / chunkSize);

          for (let i = 0; i < docEntries.length; i += chunkSize) {
            slides.push({
              headingOne: h1,
              headingTwo: h2,
              documents: docEntries.slice(i, i + chunkSize) as [string, { path: string, point: number }][],
              part: Math.floor(i / chunkSize) + 1,
              totalParts
            });
          }
        }
      }
    }
    return slides;
  }, [data]);

  const isDark = mounted && resolvedTheme === 'dark';
  const hasContent = useMemo(() => {
    return Object.values(data).some(h1 =>
      Object.values(h1).some(h2 => Object.keys(h2).length > 0)
    );
  }, [data]);

  const buttonBg = isDark ? 'bg-theme-surface-strong/70 hover:bg-theme-surface-strong' : 'bg-theme-surface hover:bg-theme-surface-strong shadow-sm border border-theme-border';
  const activeButtonBg = 'bg-theme-600/90 text-white shadow-lg';
  const buttonText = isDark ? 'text-white' : 'text-black';
  const dropdownBg = isDark ? 'bg-theme-surface-strong/45 border-theme-border' : 'bg-theme-surface border-theme-border shadow-xl';
  const linkText = 'text-theme-muted';

  const titleColor = isDark ? 'text-white' : 'text-black';

  return (
    <div className="w-full h-full">
      {/* Presentation Mode */}
      {isPresentationMode && (
        <div className="presentation-container">
          {allSlides.map((slide, idx) => (
            <FadeInSection
              key={`${slide.headingOne}-${slide.headingTwo}-p${slide.part}`}
              className="w-full h-full flex-shrink-0"
              slideIndex={idx + 1}
              totalSlides={allSlides.length}
            >
              <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 pt-20 pb-10">
                <h2 className="text-2xl md:text-4xl font-black mb-8 text-center flex flex-wrap justify-center items-center gap-x-4">
                  <span className="text-theme-500">{formatCJK(slide.headingOne, lang)}</span>
                  <span className="text-theme-muted">|</span>
                  <span className={titleColor}>{formatCJK(slide.headingTwo, lang)}</span>
                  {slide.totalParts > 1 && (
                    <span className="text-lg md:text-xl text-theme-muted font-mono">
                      [{slide.part}/{slide.totalParts}]
                    </span>
                  )}
                </h2>

                <div className="w-full space-y-3 overflow-visible p-2 flex flex-col items-center no-scrollbar">
                  {slide.documents.map(([docName, docData]) => {
                    const filePath = getPath(docData);
                    return (
                    <div key={docName} className={`${dropdownBg} p-3 md:p-4 rounded-xl border flex items-center justify-between group hover:scale-102 transition-transform w-full max-w-2xl shadow-md`}>
                      <div className="flex items-center gap-3">
                        {filePath ? (
                          <LinkIcon size={20} className="text-theme-500" />
                        ) : (
                          <XCircle size={20} className="text-theme-muted" />
                        )}
                        <span className={`text-base md:text-lg font-bold ${titleColor} truncate max-w-[250px] md:max-w-md`}>{formatCJK(docName, lang)}</span>
                      </div>
                      {filePath && (
                        <a
                          href={filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-theme-500 text-white px-4 py-1.5 rounded-full font-bold text-sm hover:bg-theme-600 transition-colors shadow-md shrink-0"
                        >
                          Open
                        </a>
                      )}
                    </div>
                  );})}
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      )}

      {/* Normal Mode */}
      {!isPresentationMode && (
        <main className={`block min-h-screen text-foreground p-4 sm:p-8 pt-8`}>
          {hasContent && (
              <LayoutSwitcher
                  currentLayout={currentLayout}
                  setCurrentLayout={setCurrentLayout}
                  canChange={true}
                  options={[
                      { id: 'original', icon: <LayoutPanelLeft size={18} />, label: original_text },
                      { id: 'timeline', icon: <Milestone size={18} />, label: timeline_text },
                      { id: 'grid', icon: <LayoutGrid size={18} />, label: grid_text }
                  ]}
              />
          )}

          <div className="container mx-auto max-w-6xl">
              {currentLayout === 'original' && (
                  <div className="flex flex-col items-center gap-6 max-w-xl mx-auto">
                      {Object.entries(data).map(([headingOne, courses]) => (
                      (Object.entries(courses).length > 0) &&
                      <FadeInSection key={headingOne} className="w-full max-w-2xl">
                          <div
                          className="w-full"
                          onMouseEnter={() => !force_click && (activeHeadingTwo === null) && setActiveHeadingOne(headingOne)}
                          >
                          <button
                              onClick={() => {
                              if (force_click) {
                                  setActiveHeadingOne(activeHeadingOne === headingOne ? null : headingOne);
                              } else {
                                  setActiveHeadingOne(activeHeadingOne === headingOne ? null : headingOne);
                                  setActiveHeadingTwo(null);
                              }}}
                              className={`w-full flex justify-between items-center text-left p-4 rounded-lg transition-[colors,transform] duration-300 border-transparent ${
                              activeHeadingOne === headingOne
                              ? activeButtonBg
                              : `${buttonBg} ${buttonText}`
                              }`}
                          >
                              <span className="font-semibold text-lg">{formatCJK(headingOne, lang)}</span>
                              <ChevronRight className={`transition-transform duration-300 ${
                              activeHeadingOne === headingOne ? 'transform rotate-90' : ''
                              }`} />
                          </button>

                          {activeHeadingOne === headingOne && (
                              <div className={`mt-2 ${dropdownBg} p-6 rounded-lg border animate-fade-in md:backdrop-blur-sm`}>
                              <div className="space-y-4">
                                  {Object.entries(courses).map(([headingTwo, documents], index) => (
                                  <PopRotateSection
                                      key={headingTwo}
                                      delay={index * 50}
                                  >
                                      <div
                                          onClick={() => activeHeadingTwo === headingTwo ? setActiveHeadingTwo(null) : setActiveHeadingTwo(headingTwo)}
                                      >

                                          {Object.entries(documents).length > 0 && (<h3 className={`font-bold hover-gacor cursor-pointer hover:text-theme-600 transition-colors`}>{formatCJK(headingTwo, lang)}</h3>)}

                                          {activeHeadingTwo === headingTwo && (
                                          Object.keys(documents).length > 0 ? (
                                              <div className={`pl-6 mt-2 space-y-2 ${linkText} animate-fade-in`}>
                                              {Object.entries(documents).map(([docName, docData], docIndex) => {
                                                  const filePath = getPath(docData);
                                                  return (
                                                  <FadeInSection
                                                      key={docName}
                                                      delay={docIndex * 30} // Staggered delay for each document
                                                  >
                                                      {filePath ? (
                                                          <a href={filePath} target="_blank" rel="noopener noreferrer" className="flex items-center hover-gacor hover:text-theme-600 transition-colors">
                                                          <LinkIcon size={16} className="mr-2 flex-shrink-0" />
                                                          <span>{formatCJK(docName, lang)}</span>
                                                          </a>
                                                      ) : (
                                                          <span className="flex items-center text-theme-muted cursor-not-allowed">
                                                          <XCircle size={16} className="mr-2 flex-shrink-0" />
                                                          <span>{formatCJK(docName, lang)} (Not available)</span>
                                                          </span>
                                                      )}
                                                  </FadeInSection>
                                              );})}
                                              </div>
                                          ) : (
                                              <p className="pl-6 mt-1 text-sm text-theme-muted italic animate-fade-in">No documents available.</p>
                                          )
                                          )}
                                      </div>
                                  </PopRotateSection>
                                  ))}
                              </div>
                              </div>
                          )}
                          </div>
                      </FadeInSection>
                      ))}
                  </div>
              )}

              {currentLayout === 'timeline' && (
                  <div className="relative border-l-2 border-theme-500/30 ml-4 md:ml-8 space-y-12">
                      {Object.entries(data).map(([headingOne, courses]) => (
                          Object.keys(courses).length > 0 && (
                              <div key={headingOne} className="relative pl-8">
                                  <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-theme-500 border-4 border-theme-surface dark:border-theme-bg-dark shadow-sm" />
                                  <h2 className={`text-3xl font-black text-gacor-smooth mb-8`}>{formatCJK(headingOne, lang)}</h2>
                                  <div className="space-y-8">
                                      {Object.entries(courses).map(([headingTwo, documents]) => (
                                          <div key={headingTwo} className="space-y-4">
                                              <h3 className={`text-xl font-bold text-gacor-smooth italic`}>{formatCJK(headingTwo, lang)}</h3>
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  {Object.entries(documents).map(([docName, docData]) => {
                                                      const filePath = getPath(docData);
                                                      return (
                                                      <div key={docName} className={`p-4 rounded-xl border ${dropdownBg} flex items-center justify-between group`}>
                                                          <span className={`font-medium ${titleColor} hover-gacor`}>{formatCJK(docName, lang)}</span>
                                                          {filePath ? (
                                                              <a href={filePath} target="_blank" rel="noopener noreferrer" className="text-theme-500 hover:text-theme-600 transition-colors">
                                                                  <LinkIcon size={18} />
                                                              </a>
                                                          ) : (
                                                              <XCircle size={18} className="text-theme-muted" />
                                                          )}
                                                      </div>
                                                  );})}
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          )
                      ))}
                  </div>
              )}

              {currentLayout === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(data).flatMap(([h1, courses]) =>
                          Object.entries(courses).flatMap(([h2, documents]) =>
                              Object.entries(documents).map(([docName, docData]) => ({ h1, h2, docName, docData }))
                          )
                      ).map((item) => {
                          const filePath = getPath(item.docData);
                          return (
                          <motion.div
                              key={`${item.h1}-${item.h2}-${item.docName}`}
                              initial={{ opacity: 0, scale: 0.9, y: 20 }}
                              whileInView={{ opacity: 1, scale: 1, y: 0 }}
                              viewport={{ once: true }}
                              whileHover={{ y: -5 }}
                              className={`p-6 rounded-2xl border ${dropdownBg} group shadow-sm hover:shadow-xl transition-all duration-300`}
                          >
                              <div className="mb-4">
                                  <span className="text-xs font-bold text-gacor-smooth tracking-widest">{formatCJK(item.h1, lang)}</span>
                                  <h3 className={`text-lg font-black ${titleColor} hover-gacor`}>{formatCJK(item.docName, lang)}</h3>
                                  <p className={`text-sm italic text-gacor-smooth`}>{formatCJK(item.h2, lang)}</p>
                              </div>
                              {filePath ? (
                                  <a
                                      href={filePath}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 text-theme-500 font-bold hover:underline"
                                  >
                                      View Document <LinkIcon size={14} />
                                  </a>
                              ) : (
                                  <span className="text-theme-muted text-sm italic">Not available</span>
                              )}
                          </motion.div>
                      );})}
                  </div>
              )}
          </div>
        </main>
      )}
    </div>
  );
}
