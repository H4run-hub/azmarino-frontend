'use client';

import { useEffect, useRef, useState } from 'react';
import { useT } from '../i18n/LanguageProvider';

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, languages, t } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const current = languages.find((l) => l.code === lang) ?? languages[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t('nav.language')}
        className={`flex items-center gap-1.5 rounded-none border border-transparent hover:border-black transition-colors ${
          compact ? 'px-2 py-1.5' : 'px-3 py-2'
        }`}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
          {current.code.toUpperCase()}
        </span>
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none" className="text-gray-500">
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 min-w-[200px] bg-white border border-black shadow-[6px_6px_0_0_rgba(0,0,0,0.08)] z-50">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-600">
              {t('nav.language')}
            </p>
          </div>
          <ul className="max-h-80 overflow-auto">
            {languages.map((l) => {
              const active = l.code === lang;
              return (
                <li key={l.code}>
                  <button
                    type="button"
                    onClick={() => {
                      setLang(l.code);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      active ? 'bg-black text-white' : 'hover:bg-rose-50 text-gray-900'
                    }`}
                  >
                    <span className="text-base leading-none">{l.flag}</span>
                    <span className="flex-1 min-w-0">
                      <span className={`block text-[10px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-gray-900'}`}>
                        {l.label}
                      </span>
                      <span className={`block text-[10px] font-bold truncate ${active ? 'text-rose-200' : 'text-gray-500'}`}>
                        {l.native}
                      </span>
                    </span>
                    {active && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
