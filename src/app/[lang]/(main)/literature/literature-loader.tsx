'use client'; // <-- This is the crucial part

import dynamic from 'next/dynamic';

// Define the type for the data we'll receive
type LiteratureData = {
  [semester: string]: {
    [subject: string]: {
      [fileName: string]: string; // be aware that the second string can be a link
    };
  };
};

// TypeScript suckass
export type LiteratureLoaderProps = {
  data: LiteratureData;
  force_click: boolean; // Use 'boolean', not 'bool'
  lang?: string;
  original_text?: string;
  timeline_text?: string;
  grid_text?: string;
};

// Use dynamic import for the component that needs browser APIs
const LiteratureDisplay = dynamic(
  () => import('@/components/InteractiveCollections'),
  { 
    ssr: false, // ssr: false is allowed here
  }
);

// This component receives the server-fetched data as props
export default function LiteratureLoader({ data, force_click, lang, original_text, timeline_text, grid_text }: LiteratureLoaderProps) {
  return <LiteratureDisplay 
    data={data} 
    force_click={force_click} 
    lang={lang} 
    original_text={original_text}
    timeline_text={timeline_text}
    grid_text={grid_text}
  />;
}
