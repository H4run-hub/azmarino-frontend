'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Lang = 'en' | 'ti';

const translations = {
  en: {
    shop: 'Shop',
    track: 'Track',
    orders: 'Orders',
    signIn: 'Sign In',
    search: 'Search 1,184+ products...',
    heroTitle1: 'Shop in',
    heroHighlight: 'Tigrinya',
    heroTitle2: 'or English.',
    heroSub: '1,184+ products. Free delivery across Europe. Secure payments.',
    shopNow: 'Shop Now',
    trackOrder: 'Track Order',
    freeDelivery: 'Free EU Delivery over €50',
    returns: '30-Day Returns',
    securePayments: 'Secure Stripe Payments',
    shopByCategory: 'Shop by Category',
    browse: 'Browse',
    viewAll: 'View all →',
    seeAll: 'See all →',
    topRated: 'Top Rated',
    curated: 'Curated',
    newArrivals: 'New Arrivals',
    fresh: 'Fresh',
    freeDeliveryBanner: 'Free delivery on orders over €50',
    shipsTo: 'Shipping to Germany, Netherlands, Sweden, Norway, UK + more',
    trustDelivery: 'Free EU Delivery',
    trustDeliverySub: 'On orders over €50',
    trustPayment: 'Secure Payment',
    trustPaymentSub: 'Powered by Stripe',
    trustReturns: '30-Day Returns',
    trustReturnsSub: 'Hassle-free returns',
    trustAI: 'Sara AI Support',
    trustAISub: 'Help in Tigrinya & English',
    footerTagline: "The world's first Eritrean diaspora store.",
    support: 'Support',
    categories: {
      women: 'Women', men: 'Men', shoes: 'Shoes',
      electronics: 'Electronics', accessories: 'Accessories', beauty: 'Beauty',
    },
    catSub: { women: 'ጓል', men: 'ወዲ', shoes: 'ሳእኒ', electronics: 'ኤለክትሮኒክስ', accessories: 'ኣጽዋር', beauty: 'ጽባቐ' },
  },
  ti: {
    shop: 'ድኳን',
    track: 'ትእዛዝ ርኸብ',
    orders: 'ትእዛዛት',
    signIn: 'እቶ',
    search: '1,184+ ፍርያት ድለ...',
    heroTitle1: 'ዕደጋ ብ',
    heroHighlight: 'ትግርኛ',
    heroTitle2: 'ወይ ብእንግሊዝ።',
    heroSub: '1,184+ ፍርያት። ናጻ ምብጻሕ ኣብ ኤውሮጳ። ድሕነታዊ ክፍሊት።',
    shopNow: 'ሕጂ ዕደጋ',
    trackOrder: 'ትእዛዝ ርኸብ',
    freeDelivery: 'ናጻ ምብጻሕ ኣብ ኤውሮጳ ንላዕሊ €50',
    returns: 'ምምላስ ኣብ 30 መዓልታት',
    securePayments: 'ድሕነታዊ ክፍሊት',
    shopNow2: 'ሕጂ ዕደጋ',
    shopByCategory: 'ብዓይነት ዕደጋ',
    browse: 'ድለ',
    viewAll: 'ኩሉ ርኣይ →',
    seeAll: 'ኩሉ ርኣይ →',
    topRated: 'ዝለዓለ ደረጃ',
    curated: 'ዝተመርጸ',
    newArrivals: 'ሓደስቲ ፍርያት',
    fresh: 'ሓዲሽ',
    freeDeliveryBanner: 'ናጻ ምብጻሕ ንትእዛዝ ዝበልጽ €50',
    shipsTo: 'ምብጻሕ ናብ ጀርመን፡ ሆለንድ፡ ስዊዲን፡ ኖርወይ፡ ዓባይ ብሪጣንያ + ካልኦት',
    trustDelivery: 'ናጻ ምብጻሕ ኤውሮጳ',
    trustDeliverySub: 'ንትእዛዝ ዝበልጽ €50',
    trustPayment: 'ድሕነታዊ ክፍሊት',
    trustPaymentSub: 'ብ Stripe',
    trustReturns: 'ምምላስ 30 መዓልታት',
    trustReturnsSub: 'ብዘይ ጸገም',
    trustAI: 'ሳራ AI ሓገዝ',
    trustAISub: 'ሓገዝ ብትግርኛን ብእንግሊዝን',
    footerTagline: 'ናይ ዓለም ቀዳማይ ድኳን ንኤርትራውያን ዳያስፖራ።',
    support: 'ሓገዝ',
    categories: {
      women: 'ጓል', men: 'ወዲ', shoes: 'ሳእኒ',
      electronics: 'ኤለክትሮኒክስ', accessories: 'ኣጽዋር', beauty: 'ጽባቐ',
    },
    catSub: { women: 'Women', men: 'Men', shoes: 'Shoes', electronics: 'Electronics', accessories: 'Accessories', beauty: 'Beauty' },
  },
};

const LanguageContext = createContext<{
  lang: Lang;
  toggle: () => void;
  t: (key: string) => string;
}>({ lang: 'en', toggle: () => {}, t: (k) => k });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('azmarino_lang') as Lang;
    if (saved === 'en' || saved === 'ti') setLang(saved);
  }, []);

  const toggle = () => {
    const next: Lang = lang === 'en' ? 'ti' : 'en';
    setLang(next);
    localStorage.setItem('azmarino_lang', next);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let val: any = translations[lang];
    for (const k of keys) { val = val?.[k]; }
    return val ?? key;
  };

  return <LanguageContext.Provider value={{ lang, toggle, t }}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);
export type { Lang };
