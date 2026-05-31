"use client"; 

import { useState, useEffect, useMemo } from 'react';
import { ChevronRight, Link as LinkIcon, XCircle, LayoutPanelLeft, Milestone, LayoutGrid } from 'lucide-react';
import { useTheme } from 'next-themes';
import FadeInSection from '@/components/FadeInSection';
import PopRotateSection from '@/components/PopRotateSection';
import { usePresentation } from './PresentationContext';
import { formatCJK } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LayoutSwitcher } from './LayoutSwitcher';

// Define typescript data
export type CollectionsData = Record<string, Record<string, Record<string, string>>>;

export type CollectionLayoutType = 'original' | 'timeline' | 'grid';

export type InteractiveCollectionsProps = {
  data: CollectionsData;
  force_click: boolean; // Use 'boolean', not 'bool'
  lang?: string;
  original_text?: string;
  timeline_text?: string;
  grid_text?: string;
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
  const { } = usePresentation();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Flatten for presentation mode: Max 4 items per slide
  const allSlides = useMemo(() => {
    const slides: { 
      headingOne: string; 
      headingTwo: string; 
      documents: [string, string][];
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
              documents: docEntries.slice(i, i + chunkSize),
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

  const buttonBg = isDark ? 'bg-gray-800/70 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 shadow-sm border border-gray-200';
  const activeButtonBg = isDark ? 'bg-cyan-600/90 text-white shadow-lg' : 'bg-cyan-600/90 text-white shadow-lg';
  const buttonText = isDark ? 'text-white' : 'text-black';
  const dropdownBg = isDark ? 'bg-gray-800/45 border-gray-700' : 'bg-white border-gray-200 shadow-xl';
  const headingTwoText = isDark ? 'text-gray-300' : 'text-gray-800';
  const linkText = isDark ? 'text-gray-300' : 'text-gray-600';
  const titleColor = isDark ? 'text-white' : 'text-black';

  return (
    <div className="w-full h-full presentation-mode:contents">
      {/* Presentation Mode */}
      <div className="hidden body-presentation-mode:contents presentation-container">
        {allSlides.map((slide, idx) => (
          <FadeInSection
            key={`${slide.headingOne}-${slide.headingTwo}-p${slide.part}`}
            className="w-full h-full flex-shrink-0"
            slideIndex={idx + 1}
            totalSlides={allSlides.length}
          >
            <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 pt-20 pb-10">
              <h2 className="text-2xl md:text-4xl font-black mb-8 text-center flex flex-wrap justify-center items-center gap-x-4">
                <span className="text-cyan-500">{formatCJK(slide.headingOne, lang)}</span>
                <span className="text-gray-500">|</span>
                <span className={titleColor}>{formatCJK(slide.headingTwo, lang)}</span>
                {slide.totalParts > 1 && (
                   <span className="text-lg md:text-xl text-gray-400 font-mono">
                     [{slide.part}/{slide.totalParts}]
                   </span>
                )}
              </h2>
              
              <div className="w-full space-y-3 overflow-visible p-2 flex flex-col items-center no-scrollbar">
                {slide.documents.map(([docName, url]) => (
                  <div key={docName} className={`${dropdownBg} p-3 md:p-4 rounded-xl border flex items-center justify-between group hover:scale-102 transition-transform w-full max-w-2xl shadow-md`}>
                    <div className="flex items-center gap-3">
                      {url ? (
                        <LinkIcon size={20} className="text-cyan-500" />
                      ) : (
                        <XCircle size={20} className="text-gray-500" />
                      )}
                      <span className={`text-base md:text-lg font-bold ${titleColor} truncate max-w-[250px] md:max-w-md`}>{formatCJK(docName, lang)}</span>
                    </div>
                    {url && (
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-cyan-500 text-white px-4 py-1.5 rounded-full font-bold text-sm hover:bg-cyan-600 transition-colors shadow-md shrink-0"
                      >
                        Open
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>
        ))}
      </div>

      {/* Normal Mode */}
      <main className={`block body-presentation-mode:hidden min-h-screen ${isDark ? 'text-white' : 'text-gray-900'} p-4 sm:p-8 pt-8`}>
        {hasContent && (
            <LayoutSwitcher
                currentLayout={currentLayout}
                setCurrentLayout={setCurrentLayout}
                isDark={isDark}
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
                            <div className={`mt-2 ${dropdownBg} p-6 rounded-lg border animate-fade-in backdrop-blur-sm`}>
                            <div className="space-y-4">
                                {Object.entries(courses).map(([headingTwo, documents], index) => (
                                <PopRotateSection 
                                    key={headingTwo} 
                                    delay={index * 50} 
                                >
                                    <div 
                                        onClick={() => activeHeadingTwo == headingTwo? setActiveHeadingTwo(null) : setActiveHeadingTwo(headingTwo)}
                                    >
                                        
                                        {Object.entries(documents).length > 0 && (<h3 className={`font-bold ${headingTwoText} cursor-pointer hover:text-cyan-600 transition-colors`}>{formatCJK(headingTwo, lang)}</h3>)}
                                        
                                        {activeHeadingTwo === headingTwo && (
                                        Object.keys(documents).length > 0 ? (
                                            <div className={`pl-6 mt-2 space-y-2 ${linkText} animate-fade-in`}>
                                            {Object.entries(documents).map(([docName, url], docIndex) => (
                                                <FadeInSection 
                                                    key={docName} 
                                                    delay={docIndex * 30} // Staggered delay for each document
                                                >
                                                    {url ? (
                                                        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-cyan-600 transition-colors">
                                                        <LinkIcon size={16} className="mr-2 flex-shrink-0" />
                                                        <span>{formatCJK(docName, lang)}</span>
                                                        </a>
                                                    ) : (
                                                        <span className="flex items-center text-gray-400 cursor-not-allowed">
                                                        <XCircle size={16} className="mr-2 flex-shrink-0" />
                                                        <span>{formatCJK(docName, lang)} (Not available)</span>
                                                        </span>
                                                    )}
                                                </FadeInSection>
                                            ))}
                                            </div>
                                        ) : (
                                            <p className="pl-6 mt-1 text-sm text-gray-500 italic animate-fade-in">No documents available.</p>
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
                <div className="relative border-l-2 border-cyan-500/30 ml-4 md:ml-8 space-y-12">
                    {Object.entries(data).map(([headingOne, courses], h1Index) => (
                        Object.keys(courses).length > 0 && (
                            <div key={headingOne} className="relative pl-8">
                                <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-cyan-500 border-4 border-white dark:border-gray-900 shadow-sm" />
                                <h2 className={`text-3xl font-black ${titleColor} mb-8`}>{formatCJK(headingOne, lang)}</h2>
                                <div className="space-y-8">
                                    {Object.entries(courses).map(([headingTwo, documents]) => (
                                        <div key={headingTwo} className="space-y-4">
                                            <h3 className={`text-xl font-bold text-cyan-500 italic`}>{formatCJK(headingTwo, lang)}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {Object.entries(documents).map(([docName, url]) => (
                                                    <div key={docName} className={`p-4 rounded-xl border ${dropdownBg} flex items-center justify-between group`}>
                                                        <span className={`font-medium ${titleColor}`}>{formatCJK(docName, lang)}</span>
                                                        {url ? (
                                                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-600 transition-colors">
                                                                <LinkIcon size={18} />
                                                            </a>
                                                        ) : (
                                                            <XCircle size={18} className="text-gray-400" />
                                                        )}
                                                    </div>
                                                ))}
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
                            Object.entries(documents).map(([docName, url]) => ({ h1, h2, docName, url }))
                        )
                    ).map((item, idx) => (
                        <motion.div
                            key={`${item.h1}-${item.h2}-${item.docName}`}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className={`p-6 rounded-2xl border ${dropdownBg} group shadow-sm hover:shadow-xl transition-all duration-300`}
                        >
                            <div className="mb-4">
                                <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest">{formatCJK(item.h1, lang)}</span>
                                <h3 className={`text-lg font-black ${titleColor} line-clamp-1`}>{formatCJK(item.docName, lang)}</h3>
                                <p className={`text-sm italic ${headingTwoText}`}>{formatCJK(item.h2, lang)}</p>
                            </div>
                            {item.url ? (
                                <a 
                                    href={item.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-2 text-cyan-500 font-bold hover:underline"
                                >
                                    View Document <LinkIcon size={14} />
                                </a>
                            ) : (
                                <span className="text-gray-400 text-sm italic">Not available</span>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
      </main>
    </div>
  );}
