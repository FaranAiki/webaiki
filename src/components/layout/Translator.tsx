import 'server-only';

import en from '../../../public/locales/en.json';
import id from '../../../public/locales/id.json';
import zh from '../../../public/locales/zh.json';
import jp from '../../../public/locales/jp.json';
import ru from '../../../public/locales/ru.json';
import fr from '../../../public/locales/fr.json';
import ar from '../../../public/locales/ar.json';
import es from '../../../public/locales/es.json';
import ko from '../../../public/locales/ko.json';
import de from '../../../public/locales/de.json';
import nl from '../../../public/locales/nl.json';
import ha from '../../../public/locales/ha.json';
import he from '../../../public/locales/he.json';
import el from '../../../public/locales/el.json';
import hi from '../../../public/locales/hi.json';
import pt from '../../../public/locales/pt.json';
import bn from '../../../public/locales/bn.json';
import vi from '../../../public/locales/vi.json';

export type TranslationDict = Record<string, string>;

const dictionaries: Record<string, Record<string, string>> = {
  en: en as unknown as Record<string, string>,
  id: id as unknown as Record<string, string>,
  zh: zh as unknown as Record<string, string>,
  jp: jp as unknown as Record<string, string>,
  ru: ru as unknown as Record<string, string>,
  fr: fr as unknown as Record<string, string>,
  ar: ar as unknown as Record<string, string>,
  es: es as unknown as Record<string, string>,
  ko: ko as unknown as Record<string, string>,
  de: de as unknown as Record<string, string>,
  nl: nl as unknown as Record<string, string>,
  ha: ha as unknown as Record<string, string>,
  he: he as unknown as Record<string, string>,
  el: el as unknown as Record<string, string>,
  hi: hi as unknown as Record<string, string>,
  pt: pt as unknown as Record<string, string>,
  bn: bn as unknown as Record<string, string>,
  vi: vi as unknown as Record<string, string>,
};

export const getDictionary = async (locale: string): Promise<Record<string, string>> => {
  return dictionaries[locale] || dictionaries.en;
};
