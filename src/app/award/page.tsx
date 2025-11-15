import type { Metadata } from "next";
import "../globals.css";
import { t, from_to } from '@/components/Translator';
import ExperiencesClient from '@/components/ExperienceDisplayer';

export const metadata: Metadata = {
  metadataBase: new URL('https://faranaiki.id/organization'),

  title: "Faran Aiki's Award",
  description: "Faran Aiki's award, like scholarships and others",
  
  openGraph: {
    title: "Faran Aiki's Award",
    description: "Faran Aiki's award, like scholarships and others",
    url: 'https://faranaiki.id/award',
    siteName: 'Faran Aiki\'s Award', 
    type: 'website',
  },

  icons: {
    icon: '/icon.ico',
    shortcut: '/icon.ico',
    apple: '/icon.ico',
  },
  
  alternates: {
    canonical: '/',
  },
};

// This is the main Server Component
export default async function AwardsPage() {
  // All async data fetching happens here on the server
  const awards = [{
      year: '2025',
      jobs: [
        {
          date: await from_to("November", "Present"),
          title: await t('Paragon_Scholarship_Title'),
          company: await t('PT Paragon'),
          description: await t('Paragon_Scholarship_Desc'),
          image: [
            '/documents/award/paragon_scholarship.png',
          ]
        },
      ],
    },

  ];

  // Render the client component and pass the fully resolved data as props
  return <ExperiencesClient experiences={awards} />;
}
