"use server";

import { t } from '@/components/Translator';

export default async function pageNotFound() {
  const not_found_text = await t('Not_Found');
  return (
    <div className='text-center pt-24'>
      <h2 className="hover:scale-105 transition-all duration-200">
        {not_found_text}
      </h2>
    </div>
  );
}
