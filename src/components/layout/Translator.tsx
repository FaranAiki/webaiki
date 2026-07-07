import 'server-only';
import fs from 'fs';
import path from 'path';

export type TranslationDict = Record<string, string>;

const memoryCache: Record<string, Record<string, string>> = {};

export const getDictionary = async (locale: string, namespaces?: string[]): Promise<Record<string, string>> => {
  const cacheKey = namespaces ? `${locale}_${namespaces.sort().join('_')}` : locale;
  if (memoryCache[cacheKey]) {
    return memoryCache[cacheKey];
  }

  try {
    const localeDir = path.join(process.cwd(), 'public', 'locales', locale);
    if (!fs.existsSync(localeDir)) {
      if (locale !== 'en') return getDictionary('en', namespaces);
      return {};
    }

    const files = fs.readdirSync(localeDir);
    let dict: Record<string, string> = {};

    for (const file of files) {
      if (file.endsWith('.json')) {
        const namespace = file.replace('.json', '');
        if (!namespaces || namespaces.includes(namespace)) {
          const filePath = path.join(localeDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const parsed = JSON.parse(content);
          dict = { ...dict, ...parsed };
        }
      }
    }

    memoryCache[cacheKey] = dict;
    return dict;
  } catch (error) {
    console.error(`Failed to load dictionary for locale ${locale}:`, error);
    if (locale !== 'en') {
      return getDictionary('en', namespaces);
    }
    return {};
  }
};
