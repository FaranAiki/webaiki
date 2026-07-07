'use server';

import { getDictionary } from '@/components/layout/Translator';
import {
  getWorkExperiences,
  getProjectExperiences,
  getOrganizationExperiences,
  getAwardExperiences
} from '@/lib/data';

export async function getTerminalData(lang: string) {
  const dict = await getDictionary(lang); // loads all

  return {
    workExp: getWorkExperiences(dict).flatMap(y => y.jobs),
    projectExp: getProjectExperiences(dict).flatMap(y => y.jobs),
    orgExp: getOrganizationExperiences(dict).flatMap(y => y.jobs),
    awardExp: getAwardExperiences(dict).flatMap(y => y.jobs),
  };
}
