
"use client";

import { useLanguage } from '@/components/LanguageProvider';

export function useTranslation() {
  const { t, locale, isRtl } = useLanguage();
  return { 
    t: (key: string) => (t as any)[key] || key, 
    locale, 
    isRtl 
  };
}
