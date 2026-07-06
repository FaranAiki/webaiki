with open('src/components/layout/Translator.tsx', 'r') as f:
    text = f.read()

# Replace all of it
new_text = """import 'server-only';

export type TranslationDict = Record<string, string>;

const dictionaries: Record<string, () => Promise<Record<string, string>>> = {
  en: () => import('../../../public/locales/en.json').then((module) => module.default as unknown as Record<string, string>),
  id: () => import('../../../public/locales/id.json').then((module) => module.default as unknown as Record<string, string>),
  zh: () => import('../../../public/locales/zh.json').then((module) => module.default as unknown as Record<string, string>),
  jp: () => import('../../../public/locales/jp.json').then((module) => module.default as unknown as Record<string, string>),
  ru: () => import('../../../public/locales/ru.json').then((module) => module.default as unknown as Record<string, string>),
  fr: () => import('../../../public/locales/fr.json').then((module) => module.default as unknown as Record<string, string>),
  ar: () => import('../../../public/locales/ar.json').then((module) => module.default as unknown as Record<string, string>),
  es: () => import('../../../public/locales/es.json').then((module) => module.default as unknown as Record<string, string>),
  ko: () => import('../../../public/locales/ko.json').then((module) => module.default as unknown as Record<string, string>),
  de: () => import('../../../public/locales/de.json').then((module) => module.default as unknown as Record<string, string>),
  nl: () => import('../../../public/locales/nl.json').then((module) => module.default as unknown as Record<string, string>),
  ha: () => import('../../../public/locales/ha.json').then((module) => module.default as unknown as Record<string, string>),
  he: () => import('../../../public/locales/he.json').then((module) => module.default as unknown as Record<string, string>),
  el: () => import('../../../public/locales/el.json').then((module) => module.default as unknown as Record<string, string>),
  hi: () => import('../../../public/locales/hi.json').then((module) => module.default as unknown as Record<string, string>),
  pt: () => import('../../../public/locales/pt.json').then((module) => module.default as unknown as Record<string, string>),
  bn: () => import('../../../public/locales/bn.json').then((module) => module.default as unknown as Record<string, string>),
  vi: () => import('../../../public/locales/vi.json').then((module) => module.default as unknown as Record<string, string>),
};

export const getDictionary = async (locale: string): Promise<Record<string, string>> => {
  const loader = dictionaries[locale] || dictionaries.en;
  return loader();
};
"""
with open('src/components/layout/Translator.tsx', 'w') as f:
    f.write(new_text)

print("done")
