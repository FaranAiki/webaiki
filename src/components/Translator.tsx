import { cookies } from 'next/headers'; 

import fs from 'fs';
import path from 'path';

type LanguageTranslations = {
  [key: string]: string;
};
// Define the main type for all your locales
type AllLocales = {
  [lang: string]: LanguageTranslations;
};

function getAllLocales(): AllLocales {
  const localesDir = path.join(process.cwd(), 'public', 'locales');
  
  const filenames = fs.readdirSync(localesDir);

  const allLocales : AllLocales = {};

  filenames.forEach((filename) => {
    if (path.extname(filename) === '.json') {
      const lang = path.basename(filename, '.json');

      const filePath = path.join(localesDir, filename);

      const fileContents = fs.readFileSync(filePath, 'utf8');
      const jsonContent = JSON.parse(fileContents);

      allLocales[lang] = jsonContent;
    }
  });

  return allLocales;
}

export async function Translate(s: string): Promise<string> {
  const cookieStore = await cookies();
  const language = cookieStore.get('language') || {'value': 'id'};
  if (!(s in locales[language.value])) 
    return 'error-no-locales';
  return locales[language.value][s]; 
}

export const t = Translate;

export const locales = getAllLocales();

