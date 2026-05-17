import type { Metadata } from "next";
import "../globals.css";
import { getDictionary } from '@/components/Translator';
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
  icons: { icon: '/icon.ico', shortcut: '/icon.ico', apple: '/icon.ico' },
  alternates: { canonical: '/' },
};

export default async function OrganizationExperiencesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  const organizationExperiences = [
    {
      year: '2026',
      jobs: [
        {
          date: `${dict.March} — ${dict.Present}`,
          title: dict.Impact_Web_Lead,
          company: dict.STEI_K || 'STEI-K',
          description: dict.Impact_Web_Lead_Description,
          image: [
            '/documents/organization/Impact_0.png',
            '/documents/organization/Impact_1.png',
          ]
        },
      ],
    },
    {
      year: '2025',
      jobs: [
        {
          date: `${dict.September} — ${dict.October}`,
          title: dict.Sponsorship_Wisokto_ITB,
          company: dict.ITB,
          description: dict.Sponsorship_Wisokto_ITB_Description,
          image: [
            '/documents/organization/Wisokto_0.jpg',
            '/documents/organization/Wisokto_1.jpg',
            '/documents/organization/Wisokto_2.jpg',
            '/documents/organization/Wisokto_3.jpg',
          ]
        },
        {
          date: `${dict.June} — ${dict.August}`,
          title: dict.Treasurer_SYNC,
          company: dict.STEI_K || 'STEI-K',
          description: dict.Treasurer_SYNC_Description,
          image: [
            '/documents/organization/SYNC_0.jpg',
            '/documents/organization/SYNC_1.JPG',
          ]
        },
        {
          date: `${dict.January} — ${dict.May}`,
          title: dict.IT_Club_Vice_Renpy,
          company: 'IT Club SMAN 1 Kota Depok',
          description: dict.IT_Club_Vice_Renpy_Description,
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
          date: `${dict.June} — ${dict.May}`,
          title: dict.IT_Club_Tutor,
          company: 'IT Club SMAN 1 Kota Depok',
          description: dict.IT_Club_Tutor_Description,
          image: [
            '/documents/organization/IT_Tutor_0.jpg',
            '/documents/organization/IT_Tutor_1.jpg',

          ]
        },
        {
          date: `${dict.March} — ${dict.April}`,
          title: dict.PARAS,
          company: 'SMA Negeri 1 Kota Depok',
          description: dict.PARAS_Description,
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
          date: `${dict.August} — ${dict.September}`,
          title: dict.Concerto,
          company: 'Student Club 1 Depok',
          description: dict.Concerto_Description,
          image: [
            '/documents/organization/Concerto_0.png',
            '/documents/organization/Concerto_1.png',
          ]
        },
        {
          date: `${dict.January} — ${dict.December}`,
          title: dict.Student_Club_Member,
          company: 'Student Club 1 Depok',
          description: dict.Student_Club_Member_Description,
          image: []
        },
      ]
    },
    {
      year: '2022',
      jobs: [
        {
          date: `${dict.July} — ${dict.December}`,
          title: dict.English_Club_Member,
          company: 'English Club 1 Depok',
          description: dict.English_Club_Member_Description,
          image: [
            '/documents/organization/EC_0.png',
            '/documents/organization/EC_1.png',
            '/documents/organization/EC_2.png',
          ]
        },
        {
          date: `${dict.July} — ${dict.December}`,
          title: dict.NBK_Member,
          company: 'Nihongo Benkyoukai 1 Depok',
          description: dict.NBK_Member_Description,
          image: [
            '/documents/organization/NBK_0.JPG',
            '/documents/organization/NBK_1.JPG',
            '/documents/organization/NBK_2.JPG',
          ]
        }
      ]
    },
  ];

  return <ExperiencesClient experiences={organizationExperiences} />;
}
