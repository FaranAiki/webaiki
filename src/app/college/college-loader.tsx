'use client'; // <-- This is the crucial part

import dynamic from 'next/dynamic';

// Define the type for the data we'll receive
type CollegeData = {
  [semester: string]: {
    [subject: string]: {
      [fileName: string]: string; // be aware that the second string can be a link
    };
  };
};

// TypeScript suckass
export type CollegeLoaderProps = {
  data: CollegeData;
  force_click: boolean; // Use 'boolean', not 'bool'
};

// Use dynamic import for the component that needs browser APIs
const CollegeDisplay = dynamic(
  () => import('@/components/InteractiveCollections'),
  { 
    ssr: false, // ssr: false is allowed here
    loading: () => <h2 className="text-center">Loading college data...</h2> 
  }
);

// This component receives the server-fetched data as props
export default function CollegeLoader({ data, force_click }: CollegeLoaderProps) {
  return <CollegeDisplay data={data} force_click={force_click} />;
}
