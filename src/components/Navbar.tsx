'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BagIcon, SearchIcon, UserIcon, MenuIcon, CloseIcon } from './Icons';
import LanguageSwitcher from './LanguageSwitcher';
import { useT } from '../i18n/LanguageProvider';

export default function Navbar() {
  const router = useRouter();
  const { t } = useT();
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const updateState = () => {
    const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]');
    setCartCount(cart.reduce((s: number, i: { quantity?: number }) => s + (i.quantity || 1), 0));
    setIsLoggedIn(!!localStorage.getItem('azmarino_token'));
  };

  useEffect(() => {
    updateState();
    window.addEventListener('cart-updated', updateState);
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('cart-updated', updateState);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Marquee announcement bar */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 text-white text-[10px] font-black uppercase tracking-[0.3em] py-1.5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
          <span className="w-1 h-1 bg-white rounded-none" />
          <span>{t('hero.badge')}</span>
          <span className="w-1 h-1 bg-white rounded-none" />
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-all duration-200 ${
          scrolled ? 'shadow-[0_2px_20px_rgba(0,0,0,0.06)] border-b border-gray-100' : 'border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center h-14 gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0 group" aria-label="Azmarino">
              <div className="relative w-10 h-10 mr-2 transition-transform group-hover:scale-105">
                <img src="/logo.svg" alt="Azmarino" className="w-full h-full object-contain" />
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-base font-black tracking-tight text-black">Azmarino</span>
                <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-rose-600">
                  {t('footer.tagline')}
                </span>
              </div>
            </Link>

            {/* Search — desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl ml-4">
              <div className="relative w-full">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('nav.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-none text-xs font-bold focus:outline-none focus:border-black focus:bg-white transition-all placeholder:text-gray-400 placeholder:font-medium"
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </form>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-5 text-[10px] font-black uppercase tracking-widest text-gray-800 flex-shrink-0">
              <Link href="/products" className="hover:text-rose-600 transition-colors">
                {t('nav.shop')}
              </Link>
              <Link href="/track" className="hover:text-rose-600 transition-colors">
                {t('nav.track')}
              </Link>
              {isLoggedIn && (
                <Link href="/orders" className="hover:text-rose-600 transition-colors">
                  {t('nav.orders')}
                </Link>
              )}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 ml-auto">
              <div className="hidden sm:block">
                <LanguageSwitcher compact />
              </div>

              <Link
                href="/cart"
                aria-label={t('nav.cart')}
                className="relative p-2 rounded-none hover:bg-gray-100 transition-colors"
              >
                <BagIcon className="w-5 h-5 text-gray-800" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-rose-600 text-white text-[9px] font-black rounded-none min-w-4 h-4 px-1 flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {isLoggedIn ? (
                <Link
                  href="/profile"
                  aria-label={t('nav.profile')}
                  className="p-2 rounded-none hover:bg-gray-100 transition-colors"
                >
                  <UserIcon className="w-5 h-5 text-gray-800" />
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden sm:block bg-black hover:bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-none transition-colors ml-1"
                >
                  {t('nav.signIn')}
                </Link>
              )}

              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="lg:hidden p-2 rounded-none hover:bg-gray-100 text-gray-800 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <CloseIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-4 pb-6 space-y-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('nav.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-none text-xs font-bold focus:outline-none focus:border-black"
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </form>

            <nav className="space-y-0.5">
              {[
                { href: '/products', label: t('nav.shop') },
                { href: '/track', label: t('nav.track') },
                ...(isLoggedIn
                  ? [
                      { href: '/orders', label: t('nav.orders') },
                      { href: '/profile', label: t('nav.profile') },
                    ]
                  : []),
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-3 py-3 rounded-none text-[11px] font-black uppercase tracking-widest text-gray-800 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <LanguageSwitcher />
              {!isLoggedIn && (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="bg-black text-white text-[10px] font-black uppercase tracking-widest py-2.5 px-5 rounded-none text-center hover:bg-rose-600 transition-colors"
                >
                  {t('nav.signIn')}
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
