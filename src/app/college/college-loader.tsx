'use client'; // <-- This is the crucial part

import dynamic from 'next/dynamic';

// Define the type for the data we'll receive
type CollegeData = {
  [semester: string]: {
    [subject: string]: {
      [fileName: string]: string;
    };
  };
};

// Use dynamic import for the component that needs browser APIs
const CertificatesDisplay = dynamic(
  () => import('@/components/InteractiveCollections'),
  { 
    ssr: false, // ssr: false is allowed here
    loading: () => <h2 className="text-center">Loading college data...</h2> 
  }
);

// This component receives the server-fetched data as props
export default function CollegeLoader({ college_data }: { college_data: CollegeData }) {
  return <InteractiveCollection data={college_data} />;
}
