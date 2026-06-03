'use client'; // <-- use client because this is frontend 

import dynamic from 'next/dynamic';

// type of certificate data
type CertificateData = {
  [category: string]: {
    [year: string]: {
      [fileName: string]: { path: string; point: number };
    };
  };
};

// Use dynamic import for the component that needs browser APIs
const CertificatesDisplay = dynamic(
  () => import('@/components/portfolio/CertificatesDisplay'),
  { 
    ssr: false, // ssr: false is allowed here
  }
);

// This component receives the server-fetched data as props
export default function CertificateLoader({ 
  certificates, 
  allTranslation, 
  lang,
  original_text,
  timeline_text,
  grid_text,
  bento_text,
  click_to_close_text 
}: { 
  certificates: CertificateData, 
  allTranslation: string, 
  lang: string,
  original_text?: string,
  timeline_text?: string,
  grid_text?: string,
  bento_text?: string,
  click_to_close_text?: string
}) {
  return <CertificatesDisplay 
    certificates={certificates} 
    allTranslation={allTranslation} 
    lang={lang} 
    original_text={original_text}
    timeline_text={timeline_text}
    grid_text={grid_text}
    bento_text={bento_text}
    click_to_close_text={click_to_close_text}
  />;
}
