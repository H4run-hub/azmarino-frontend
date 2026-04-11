'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type Lang = 'en' | 'ti';

const translations = {
  en: {
    shop: 'Shop',
    track: 'Track order',
    orders: 'Orders',
    signIn: 'Sign in',
    search: 'Search curated products, fashion, beauty, and tech',
    trustDelivery: 'Delivery across Europe',
    trustDeliverySub: 'Fast, tracked dispatch',
    trustPayment: 'Secure payments',
    trustPaymentSub: 'Powered by Stripe',
    trustReturns: 'Flexible returns',
    trustReturnsSub: 'Simple and customer-first',
    trustAI: 'Sara support',
    trustAISub: 'Fast help when you need it',
    categories: {
      women: 'Women',
      men: 'Men',
      shoes: 'Shoes',
      electronics: 'Electronics',
      accessories: 'Accessories',
      beauty: 'Beauty',
    },
  },
  ti: {
    shop: 'ድኳን',
    track: 'ትእዛዝ ክትትል',
    orders: 'ትእዛዛት',
    signIn: 'እቶ',
    search: 'ፍርያት ድለ',
    trustDelivery: 'ምብጻሕ ናብ ኤውሮጳ',
    trustDeliverySub: 'ፍጡን እና ተኸታታሊ',
    trustPayment: 'ድሕነታዊ ክፍሊት',
    trustPaymentSub: 'ብ Stripe',
    trustReturns: 'ቀሊል ምምላስ',
    trustReturnsSub: 'ብዘይ ጸገም',
    trustAI: 'ሳራ ሓገዝ',
    trustAISub: 'ቅልጡፍ ሓገዝ',
    categories: {
      women: 'ደቂ ኣንስትዮ',
      men: 'ደቂ ተባዕትዮ',
      shoes: 'ጫማ',
      electronics: 'ኤሌክትሮኒክስ',
      accessories: 'ኣክሰሰሪ',
      beauty: 'ጽባቐ',
    },
  },
} as const;

const LanguageContext = createContext<{
  lang: Lang;
  toggle: () => void;
  t: (key: string) => string;
}>({
  lang: 'en',
  toggle: () => undefined,
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === 'undefined') {
      return 'en';
    }

    const saved = localStorage.getItem('azmarino_lang');
    return saved === 'ti' ? 'ti' : 'en';
  });

  const toggle = () => {
    const next = lang === 'en' ? 'ti' : 'en';
    setLang(next);
    localStorage.setItem('azmarino_lang', next);
  };

  const t = (key: string) => {
    const parts = key.split('.');
    let value: unknown = translations[lang];

    for (const part of parts) {
      value = typeof value === 'object' && value !== null ? (value as Record<string, unknown>)[part] : undefined;
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
export type { Lang };
