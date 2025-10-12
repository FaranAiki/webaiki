'use client'; // <-- This is the crucial part

import dynamic from 'next/dynamic';

// Define the type for the data we'll receive
type CertificateData = {
  [category: string]: {
    [year: string]: {
      [fileName: string]: string;
    };
  };
};

// Use dynamic import for the component that needs browser APIs
const CertificatesDisplay = dynamic(
  () => import('@/components/CertificatesDisplay'),
  { 
    ssr: false, // ssr: false is allowed here
  }
);

// This component receives the server-fetched data as props
export default function CertificateLoader({ certificates, allTranslation }: { certificates: CertificateData, allTranslation: string}) {
  return <CertificatesDisplay certificates={certificates} allTranslation={allTranslation} />;
}
