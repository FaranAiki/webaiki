import type { Metadata } from "next";
import "../globals.css";
import { t } from '@/components/Translator';
import ExperiencesClient from '@/components/ExperienceDisplayer';

export const metadata: Metadata = {
  metadataBase: new URL('https://faranaiki.id/organization'),

  title: "Faran Aiki's Organization",
  description: "Faran Aiki's organization and activities",
  
  openGraph: {
    title: "Faran Aiki's Organization",
    description: "Faran Aiki's Organization and Activities",
    url: 'https://faranaiki.id/organization',
    siteName: 'Faran Aiki\'s Organization', 
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
export default async function OrganizationExperiencesPage() {
  // All async data fetching happens here on the server
  const organizationExperiences = [
    {
      year: '2025',
      jobs: [
        {
          date: await t('September — October'),
          title: await t('Fundraising_Wisokto_ITB'),
          company: await t('ITB'),
          description: await t('Sponsorship_Wisokto_ITB_Description'),
          image: [
            '',
            '',
          ]
        },
        {
          date: await t('June — August'),
          title: await t('Treasurer_SYNC'),
          company: await t('STEI-K'),
          description: await t('Treasurer_SYNC_Description'),
          image: [
            '/documents/organization/SYNC_0.jpg',
            '/documents/organization/SYNC_1.jpg',
          ]
        },
        {
          date: await t('January — May'),
          title: await t('IT_Club_Vice_Renpy'),
          company: 'IT Club SMAN 1 Kota Depok',
          description: await t('IT_Club_Vice_Renpy_Description'),
          image: [
            '',
            '',
          ]
        }
      ]
    },
    {
      year: '2024',
      jobs: [
        {
          date: await t('June — May'),
          title: await t('IT_Club_Tutor'),
          company: 'IT Club SMAN 1 Kota Depok',
          description: await t('IT_Club_Tutor_Description'),
          image: [
            '/documents/organization/NBK_0.JPG',
            '/documents/organization/NBK_1.JPG',
            '/documents/organization/NBK_2.JPG',
          ]
        },
      ]
    },
    {
      year: '2023',
      jobs: [

      ]
    },
    {
      year: '2022',
      jobs: [
        {
          date: await t('June — December'),
          title: await t('NBK_Member'),
          company: 'Nihongo Benkyoukai 1 Depok',
          description: await t('NBK_Member_Description'),
          image: [
            '',
            '',
          ]
        }
      ]
    },
  ];

  // Render the client component and pass the fully resolved data as props
  return <ExperiencesClient experiences={organizationExperiences} />;
}
