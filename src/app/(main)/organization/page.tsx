import type { Metadata } from "next";
import "../globals.css";
import { t, from_to } from '@/components/Translator';
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

// main component
export default async function OrganizationExperiencesPage() {
  // async from use server
  const organizationExperiences = [
    {
      year: '2025',
      jobs: [
        {
          date: await from_to("September", "October"),
          title: await t('Sponsorship_Wisokto_ITB'),
          company: await t('ITB'),
          description: await t('Sponsorship_Wisokto_ITB_Description'),
          image: [
            '/documents/organization/Wisokto_0.jpg',
            '/documents/organization/Wisokto_1.jpg',
            '/documents/organization/Wisokto_2.jpg',
            '/documents/organization/Wisokto_3.jpg',
          ]
        },
        {
          date: await from_to('June', 'August'),
          title: await t('Treasurer_SYNC'),
          company: await t('STEI-K'),
          description: await t('Treasurer_SYNC_Description'),
          image: [
            '/documents/organization/SYNC_0.jpg',
            '/documents/organization/SYNC_1.JPG',
          ]
        },
        {
          date: await from_to('January', 'May'),
          title: await t('IT_Club_Vice_Renpy'),
          company: 'IT Club SMAN 1 Kota Depok',
          description: await t('IT_Club_Vice_Renpy_Description'),
          image: [
            '/documents/organization/Renpy_0.png',
          ] 
        }
      ]
    },
    {
      year: '2024',
      jobs: [
        {
          date: await from_to('June', 'May'),
          title: await t('IT_Club_Tutor'),
          company: 'IT Club SMAN 1 Kota Depok',
          description: await t('IT_Club_Tutor_Description'),
          image: [
            '/documents/organization/IT_Tutor_0.jpg',
            '/documents/organization/IT_Tutor_1.jpg',

          ]
        },
        {
          date: await from_to('March', 'April'),
          title: await t('PARAS'),
          company: 'SMA Negeri 1 Kota Depok',
          description: await t('PARAS_Description'),
          image: [
            '/documents/organization/Paras_0.png',
            '/documents/organization/Paras_1.png',
          ]
        },
      ]
    },
    {
      year: '2023',
      jobs: [
        {
          date: await from_to('August', 'September'),
          title: await t('Concerto'),
          company: 'Student Club 1 Depok',
          description: await t('Concerto_Description'),
          image: [
            '/documents/organization/Concerto_0.png',
            '/documents/organization/Concerto_1.png',
          ]
        },
        {
          date: await from_to('January', 'December'),
          title: await t('Student_Club_Member'),
          company: 'Student Club 1 Depok',
          description: await t('Student_Club_Member_Description'),
          image: []
        },
      ]
    },
    {
      year: '2022',
      jobs: [
        {
          date: await from_to('July', 'December'),
          title: await t('English_Club_Member'),
          company: 'English Club 1 Depok',
          description: await t('English_Club_Member_Description'),
          image: [
            '/documents/organization/EC_0.png',
            '/documents/organization/EC_1.png',
            '/documents/organization/EC_2.png',
          ]
        },
        {
          date: await from_to('July', 'December'),
          title: await t('NBK_Member'),
          company: 'Nihongo Benkyoukai 1 Depok',
          description: await t('NBK_Member_Description'),
          image: [
            '/documents/organization/NBK_0.JPG',
            '/documents/organization/NBK_1.JPG',
            '/documents/organization/NBK_2.JPG',
          ]
        }
      ]
    },
  ];

  // Render the client component and pass the fully resolved data as props
  return <ExperiencesClient experiences={organizationExperiences} />;
}
