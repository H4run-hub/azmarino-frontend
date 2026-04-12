'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useT } from '../i18n/LanguageProvider';
import { BagIcon, SearchIcon, UserIcon, MenuIcon, CloseIcon, GlobeIcon } from './Icons';

// ... (rest of helper functions)

export default function Navbar() {
  const router = useRouter();
  const { code: lang, toggle, t } = useT();
  const [cartCount, setCartCount] = useState(0);
// ... (rest of state and effects)

  return (
    <header className={`sticky top-0 z-[90] w-full transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm py-4' : 'bg-white border-b border-gray-100 py-8'
    }`}>
      <div className="section-container">
        <div className="flex items-center justify-between gap-12">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-5 group shrink-0">
            <div className="relative w-14 h-14 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
              <Image src="/logo.jpg" alt="Azmarino" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="hidden md:block">
              <p className="text-[16px] font-black uppercase tracking-[0.4em] text-black leading-none mb-2 italic">Azmarino</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">Premium Global Edit</p>
            </div>
          </Link>

          {/* Nav Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-12">
            <Link href="/products" className="text-[14px] font-black uppercase tracking-[0.2em] text-gray-900 hover:text-gray-500 transition-colors">
              {t('shop')}
            </Link>
            <Link href="/track" className="text-[14px] font-black uppercase tracking-[0.2em] text-gray-900 hover:text-gray-500 transition-colors">
              {t('track')}
            </Link>
            {isLoggedIn && (
              <Link href="/orders" className="text-[14px] font-black uppercase tracking-[0.2em] text-gray-900 hover:text-gray-500 transition-colors">
                {t('orders')}
              </Link>
            )}
          </nav>

          {/* Search - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('search')}
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:bg-white focus:border-black/5 outline-none transition-all"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Lang Toggle */}
            <button onClick={toggle} className="hidden sm:flex items-center gap-3 px-6 py-3 rounded-2xl border border-gray-100 hover:border-black transition-all">
              <GlobeIcon className="w-5 h-5 text-gray-900" />
              <span className="text-[12px] font-black uppercase tracking-widest">{lang === 'en' ? 'TI' : 'EN'}</span>
            </button>

            {/* Account */}
            <Link href={isLoggedIn ? "/profile" : "/auth/login"} className="p-2.5 rounded-full hover:bg-gray-50 transition-colors">
              <UserIcon className="w-5 h-5 text-gray-900" />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2.5 rounded-full hover:bg-gray-50 transition-colors">
              <BagIcon className="w-5 h-5 text-gray-900" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[8px] font-black flex items-center justify-center rounded-full">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2.5 rounded-full hover:bg-gray-50 transition-colors">
              {mobileOpen ? <CloseIcon className="w-5 h-5 text-gray-900" /> : <MenuIcon className="w-5 h-5 text-gray-900" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-100 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t('search')}
                  className="w-full bg-gray-50 rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none"
                />
              </div>
            </form>
            <div className="flex flex-col gap-1">
              <Link href="/products" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-bold uppercase tracking-widest text-gray-900 hover:bg-gray-50 rounded-xl">
                {t('shop')}
              </Link>
              <Link href="/track" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-bold uppercase tracking-widest text-gray-900 hover:bg-gray-50 rounded-xl">
                {t('track')}
              </Link>
              {isLoggedIn && (
                <Link href="/orders" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-bold uppercase tracking-widest text-gray-900 hover:bg-gray-50 rounded-xl">
                  {t('orders')}
                </Link>
              )}
            </div>
            <div className="flex items-center gap-2 p-4 mt-2 bg-gray-50 rounded-2xl">
              <button onClick={toggle} className="flex-1 btn-outline h-12">
                <GlobeIcon className="w-4 h-4" />
                {lang === 'en' ? 'TIGRINYA' : 'ENGLISH'}
              </button>
              {!isLoggedIn && (
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="flex-1 btn-black h-12">
                  {t('signIn')}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
