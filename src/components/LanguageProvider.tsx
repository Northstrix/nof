// src/components/LanguageProvider.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Locale, translations, supportedLocales } from '@/lib/translations';

type WritableLocale = typeof supportedLocales[number];

interface LanguageContextProps {
  locale: Locale;
  t: typeof translations[Locale];
  setLocale: (locale: Locale) => void;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read lang from URL
  const currentLangParam = searchParams.get('lang') as WritableLocale | null;
  const initialLang: WritableLocale =
    currentLangParam && supportedLocales.includes(currentLangParam)
      ? currentLangParam
      : 'en';

  const [locale, setLocaleInternal] = useState<WritableLocale>(initialLang);

  const setLocale = useCallback(
    (newLocale: WritableLocale) => {
      setLocaleInternal(newLocale);

      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (newLocale === 'en') {
        current.delete('lang');
      } else {
        current.set('lang', newLocale);
      }
      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.push(`${pathname}${query}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Sync state if URL changes externally (Back/Forward, etc.)
  useEffect(() => {
    if (currentLangParam && supportedLocales.includes(currentLangParam)) {
      if (currentLangParam !== locale) setLocaleInternal(currentLangParam);
    } else if (!currentLangParam && locale !== 'en') {
      setLocaleInternal('en');
    }
  }, [currentLangParam, locale]);

  const value = {
    locale,
    t: translations[locale],
    setLocale,
    isRtl: locale === 'he',
  };

  useEffect(() => {
    document.documentElement.dir = value.isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale, value.isRtl]);

  return (
    <LanguageContext.Provider value={value}>
      <div
        dir={value.isRtl ? 'rtl' : 'ltr'}
        className="min-h-screen text-foreground selection:bg-primary/30"
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
