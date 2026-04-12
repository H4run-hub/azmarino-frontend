'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { LANGUAGES, LangCode, translations } from './translations';

type LanguageContextValue = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
  languages: typeof LANGUAGES;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'azmarino_lang';
const DEFAULT_LANG: LangCode = 'en';

function detectInitialLang(): LangCode {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  const stored = localStorage.getItem(STORAGE_KEY) as LangCode | null;
  if (stored && translations[stored]) return stored;
  const nav = (navigator.language || '').slice(0, 2).toLowerCase();
  if ((translations as Record<string, unknown>)[nav]) return nav as LangCode;
  return DEFAULT_LANG;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(DEFAULT_LANG);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initial = detectInitialLang();
    setLangState(initial);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const entry = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
    document.documentElement.lang = lang;
    document.documentElement.dir = entry.dir;
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang, ready]);

  const setLang = useCallback((l: LangCode) => setLangState(l), []);

  const t = useCallback(
    (key: string) => translations[lang]?.[key] ?? translations.en[key] ?? key,
    [lang]
  );

  const dir = (LANGUAGES.find((l) => l.code === lang)?.dir ?? 'ltr') as 'ltr' | 'rtl';

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    const fallback = (key: string) => translations.en[key] ?? key;
    return {
      lang: DEFAULT_LANG as LangCode,
      setLang: () => {},
      t: fallback,
      dir: 'ltr' as const,
      languages: LANGUAGES,
    };
  }
  return ctx;
}
