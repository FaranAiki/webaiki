import os

translator_ts = """import 'server-only';

import en from '../../../public/locales/en.json';

export type TranslationDict = typeof en;

const dictionaries: Record<string, () => Promise<TranslationDict>> = {
  en: () => import('../../../public/locales/en.json').then((module) => module.default as TranslationDict),
  id: () => import('../../../public/locales/id.json').then((module) => module.default as TranslationDict),
  zh: () => import('../../../public/locales/zh.json').then((module) => module.default as TranslationDict),
  jp: () => import('../../../public/locales/jp.json').then((module) => module.default as TranslationDict),
  ru: () => import('../../../public/locales/ru.json').then((module) => module.default as TranslationDict),
  fr: () => import('../../../public/locales/fr.json').then((module) => module.default as TranslationDict),
  ar: () => import('../../../public/locales/ar.json').then((module) => module.default as TranslationDict),
  es: () => import('../../../public/locales/es.json').then((module) => module.default as TranslationDict),
  ko: () => import('../../../public/locales/ko.json').then((module) => module.default as TranslationDict),
  de: () => import('../../../public/locales/de.json').then((module) => module.default as TranslationDict),
  nl: () => import('../../../public/locales/nl.json').then((module) => module.default as TranslationDict),
  ha: () => import('../../../public/locales/ha.json').then((module) => module.default as TranslationDict),
  he: () => import('../../../public/locales/he.json').then((module) => module.default as TranslationDict),
  el: () => import('../../../public/locales/el.json').then((module) => module.default as TranslationDict),
  hi: () => import('../../../public/locales/hi.json').then((module) => module.default as TranslationDict),
  pt: () => import('../../../public/locales/pt.json').then((module) => module.default as TranslationDict),
  bn: () => import('../../../public/locales/bn.json').then((module) => module.default as TranslationDict),
  vi: () => import('../../../public/locales/vi.json').then((module) => module.default as TranslationDict),
};

export const getDictionary = async (locale: string): Promise<TranslationDict> => {
  const loader = dictionaries[locale] || dictionaries.en;
  return loader();
};
"""

with open('src/components/layout/Translator.tsx', 'w') as f:
    f.write(translator_ts)

with open('src/lib/data.ts', 'r') as f:
    data_ts = f.read()

# Replace the type Dictionary = ... with import
data_ts = data_ts.replace('type Dictionary = Record<string, string | string[]>;', 'import type { TranslationDict as Dictionary } from "@/components/layout/Translator";')

with open('src/lib/data.ts', 'w') as f:
    f.write(data_ts)

print("done")
