"use client";

import React from 'react';
import { LayoutSwitcher } from '../shared/LayoutSwitcher';
import { LayoutPanelLeft, Milestone, LayoutGrid, Grid2X2 } from 'lucide-react';
import { CertificatesProvider, useCertificatesContext, CertificateData } from './CertificatesContext';
export type { CertificateData };
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const LoadingFallback = () => (
  <div className="w-full min-h-[300px] flex items-center justify-center">
    <Loader2 className="animate-spin text-theme-500" size={32} />
  </div>
);

const CertificatesPresentationLayout = dynamic(() => import('./layouts/CertificatesPresentationLayout'), { loading: () => <LoadingFallback /> });
const CertificatesOriginalLayout = dynamic(() => import('./layouts/CertificatesOriginalLayout'), { loading: () => <LoadingFallback /> });
const CertificatesTimelineLayout = dynamic(() => import('./layouts/CertificatesTimelineLayout'), { loading: () => <LoadingFallback /> });
const CertificatesGridLayout = dynamic(() => import('./layouts/CertificatesGridLayout'), { loading: () => <LoadingFallback /> });
const CertificatesBentoLayout = dynamic(() => import('./layouts/CertificatesBentoLayout'), { loading: () => <LoadingFallback /> });

function CertificatesContent() {
  const { 
    isPresentationMode,
    currentLayout,
    setCurrentLayout,
    hasCertificates,
    translations
  } = useCertificatesContext();

  return (
    <div className={`w-full h-full ${isPresentationMode ? 'presentation-container flex flex-row flex-nowrap w-full h-screen' : ''}`}>
      {isPresentationMode && <CertificatesPresentationLayout />}

      {!isPresentationMode && (
        <div className="block w-full max-w-5xl mx-auto p-4 space-y-6 pt-8">
          {hasCertificates && (
            <LayoutSwitcher
                currentLayout={currentLayout}
                setCurrentLayout={(id) => setCurrentLayout(id as 'original' | 'timeline' | 'grid' | 'bento')}
                canChange={true}
                options={[
                    { id: 'original', icon: <LayoutPanelLeft size={18} />, label: translations.original_text },
                    { id: 'timeline', icon: <Milestone size={18} />, label: translations.timeline_text },
                    { id: 'grid', icon: <LayoutGrid size={18} />, label: translations.grid_text },
                    { id: 'bento', icon: <Grid2X2 size={18} />, label: translations.bento_text }
                ]}
            />
          )}

          {currentLayout === 'original' && <CertificatesOriginalLayout />}
          {currentLayout === 'timeline' && <CertificatesTimelineLayout />}
          {currentLayout === 'grid' && <CertificatesGridLayout />}
          {currentLayout === 'bento' && <CertificatesBentoLayout />}
        </div>
      )}
    </div>
  );
}

export type CertificatesDisplayProps = {
  certificates: CertificateData;
  allTranslation: string;
  lang?: string;
  original_text?: string;
  timeline_text?: string;
  grid_text?: string;
  bento_text?: string;
  click_to_close_text?: string;
  isLoggedIn?: boolean;
  bookmarkedItemIds?: string[];
};

export default function CertificatesDisplay({
  certificates,
  allTranslation,
  lang = 'en',
  original_text = 'Original',
  timeline_text = 'Timeline',
  grid_text = 'Grid',
  bento_text = 'Bento',
  click_to_close_text = 'Click to close',
  isLoggedIn = false,
  bookmarkedItemIds = []
}: CertificatesDisplayProps) {
  const translations = {
    allTranslation,
    original_text,
    timeline_text,
    grid_text,
    bento_text,
    click_to_close_text
  };

  return (
    <CertificatesProvider 
        certificates={certificates}
        lang={lang}
        isLoggedIn={isLoggedIn}
        bookmarkedItemIds={bookmarkedItemIds}
        translations={translations}
    >
        <CertificatesContent />
    </CertificatesProvider>
  );
}
