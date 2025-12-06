'use client'; // <-- use client because this is frontend 

import dynamic from 'next/dynamic';

// type of certificate data
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
