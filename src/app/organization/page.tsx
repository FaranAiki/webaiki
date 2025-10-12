import type { Metadata } from "next";
import "../globals.css";
import { t } from '@/components/Translator';
import ExperiencesClient from '@/components/ExperienceDisplayer';

export const metadata: Metadata = {
  title: "Faran Aiki's Organization History",
  description: "Faran Aiki's Organization and Activities",
};

// This is the main Server Component
export default async function OrganizationExperiencesPage() {
  // All async data fetching happens here on the server
  const organizationExperiences = [
    {
      year: '2025',
      jobs: [
        {
          date: await t('October — Present'),
          title: await t('Software_Engineer'),
          company: 'Analitica',
          description: await t('Software_Engineer_Description'),
          image: [
            '/documents/work/Analitica Software Engineer_0.png',
            '/documents/work/Analitica Software Engineer_1.png',
          ] // TODO make this a carousel
        },
        {
          date: await t('August — Present'),
          title: await t('Mathematics_Private_Tutor'),
          company: 'KPM-Nol Persen',
          description: await t('Mathematics_Private_Tutor_Description'),
          image: [
            '/documents/work/KPM-Nol Persen_0.png',
            '/documents/work/KPM-Nol Persen_1.jpg',
            '/documents/work/KPM-Nol Persen_2.jpg'
          ]// TODO make this a carousel
        },
        {
          date: await t('May — September'),
          title: await t('Education_Team'),
          company: 'Analitica',
          description: await t('Education_Team_Description'),
          image: [
            '/documents/work/Analitica Education Team_0.png',
            '/documents/work/Analitica Education Team_1.png',
          ]// TODO make this a carousel
        }
      ]
    }
  ];

  // Render the client component and pass the fully resolved data as props
  return <ExperiencesClient experiences={organizationExperiences} />;
}
