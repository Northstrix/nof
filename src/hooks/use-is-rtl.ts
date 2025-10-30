'use client';

import { useLanguage } from '@/contexts/language-context';

export default function useIsRTL() {
  try {
    const { dir } = useLanguage();
    return dir === 'rtl';
  } catch (e) {
    // This can happen if used outside the provider, e.g. in storybook
    // or if the provider hasn't mounted.
    if (typeof window !== 'undefined' && document.documentElement.dir === 'rtl') {
        return true;
    }
    return false;
  }
}
