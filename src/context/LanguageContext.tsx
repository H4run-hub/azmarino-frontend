'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type Lang = 'en' | 'ti';

const translations = {
  en: {
    // Navigation
    shop: 'Shop',
    track: 'Track Order',
    orders: 'My Orders',
    signIn: 'Sign In',
    cart: 'Cart',
    search: 'Search for products, fashion and tech...',
    
    // Hero & Home
    heroTitle: 'Global Premium Collection',
    heroSubtitle: 'Experience the next generation of e-commerce. Curated global fashion, elite electronics, and worldwide delivery.',
    exploreBtn: 'Explore Collection',
    trackBtn: 'Track Your Order',
    
    // Sections
    topRated: 'Top Rated',
    newArrivals: 'New Arrivals',
    trending: 'Trending Now',
    categoriesTitle: 'Shop By Category',
    discoverMore: 'Discover More',
    
    // Trust
    trustDelivery: 'Worldwide Shipping',
    trustDeliverySub: 'Fast, tracked delivery to your door',
    trustPayment: 'Secure Checkout',
    trustPaymentSub: 'Encrypted payments via Stripe',
    trustReturns: 'Hassle-Free Returns',
    trustReturnsSub: '14-day return policy',
    trustAI: 'Sara AI Support',
    trustAISub: 'Instant help with your shopping',
    
    // Product Detail
    addToCart: 'Add to Collection',
    added: '✓ Added to Cart',
    selectSize: 'Select Size',
    selectColor: 'Select Color',
    quantity: 'Quantity',
    description: 'Description',
    reviews: 'Customer Reviews',
    stockIn: 'In Stock',
    stockOut: 'Out of Stock',
    related: 'You May Also Like',
    
    // Auth & General
    email: 'Email Address',
    password: 'Password',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    
    // Categories
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
    // Navigation
    shop: 'ድኳን',
    track: 'ትእዛዝ ክትትል',
    orders: 'ትእዛዛተይ',
    signIn: 'እቶ',
    cart: 'ኩረት',
    search: 'ፍርያት፣ ፋሽንን ቴክኖሎጂን ድለ...',
    
    // Hero & Home
    heroTitle: 'ዓለምለኻዊ ክብርቲ ስብስብ',
    heroSubtitle: 'ሓድሽ ወለዶ ናይ ኢንተርነት ዕዳጋ ተለማመዱ። ዝተመርጹ ዓለምለኻዊ ፋሽን፣ ዘመናዊ ኤሌክትሮኒክስ፣ ከምኡ’ውን ናብ ዝሃለኹምዎ ነብጽሕ።',
    exploreBtn: 'ስብስብ ዳህስስ',
    trackBtn: 'ትእዛዝካ ተኸታተል',
    
    // Sections
    topRated: 'ዝበለጸ ተቐባልነት',
    newArrivals: 'ሓደስቲ ዝኣተዉ',
    trending: 'ሕጂ ዘለዉ',
    categoriesTitle: 'ብዓይነት ድለ',
    discoverMore: 'ተወሳኺ ዳህስስ',
    
    // Trust
    trustDelivery: 'ዓለምለኻዊ መብጻሕቲ',
    trustDeliverySub: 'ቅልጡፍን ውሑስን መብጻሕቲ',
    trustPayment: 'ውሑስ ክፍሊት',
    trustPaymentSub: 'ብ Stripe ዝተሓለወ ክፍሊት',
    trustReturns: 'ቀሊል ምምላስ',
    trustReturnsSub: 'ናይ 14 መዓልቲ ናይ ምምላስ መሰል',
    trustAI: 'ሳራ AI ሓገዝ',
    trustAISub: 'ንዕዳጋኹም ቅልጡፍ ሓገዝ',
    
    // Product Detail
    addToCart: 'ናብ ኩረት ወስኽ',
    added: '✓ ተወሲኹ ኣሎ',
    selectSize: 'ዓቐን መረጽ',
    selectColor: 'ሕብሪ መረጽ',
    quantity: 'ብዝሒ',
    description: 'መግለጺ',
    reviews: 'ናይ ዓማዊል ርእይቶ',
    stockIn: 'ኣብ መኽዘን ኣሎ',
    stockOut: 'ተወዲኡ',
    related: 'ክፈትውዎ ትኽእሉ ኢኹም',
    
    // Auth & General
    email: 'ኢመይል ኣድራሻ',
    password: 'ፓስወርድ',
    login: 'እቶ',
    register: 'ተመዝገብ',
    logout: 'ውጻእ',
    
    // Categories
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
    let value: any = translations[lang];

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        value = undefined;
        break;
      }
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
