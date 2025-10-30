'use client';

import { useLanguage } from '@/contexts/language-context';
import { dictionaries, Dictionary } from '@/lib/i18n';
import get from 'lodash.get';

export function useTranslation() {
  const { language } = useLanguage();
  const dictionary = dictionaries[language];

  const t = (key: string,
    options?: { [key: string]: string | number }
  ): string => {
    let value = get(dictionary, key, key);
    if(options){
      Object.keys(options).forEach(optKey => {
        value = value.replace(`{{${optKey}}}`, String(options[optKey]));
      });
    }
    return value;
  };
  
  return { t, dictionary };
}
