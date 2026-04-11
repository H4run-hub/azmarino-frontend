'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '../context/LanguageContext';
import { BagIcon, SearchIcon, UserIcon, MenuIcon, CloseIcon, GlobeIcon } from './Icons';

const readCartCount = () => {
  if (typeof window === 'undefined') return 0;
  const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]');
  return cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
};

const readLoggedIn = () => {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem('azmarino_token'));
};

export default function Navbar() {
  const router = useRouter();
  const { lang, toggle, t } = useLang();
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setCartCount(readCartCount());
    setIsLoggedIn(readLoggedIn());
    
    const syncState = () => {
      setCartCount(readCartCount());
      setIsLoggedIn(readLoggedIn());
    };
    const onScroll = () => setScrolled(window.scrollY > 20);
    
    window.addEventListener('cart-updated', syncState);
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('cart-updated', syncState);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/products?search=${encodeURIComponent(search.trim())}`);
    setMobileOpen(false);
  };

  return (
    <header className={`sticky top-0 z-[90] w-full transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm py-2' : 'bg-white border-b border-gray-100 py-4'
    }`}>
      <div className="section-container">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
              <Image src="/logo.jpg" alt="Azmarino" fill className="object-cover transition-transform group-hover:scale-110" />
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black leading-none mb-1">Azmarino</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter leading-none">Premium Edit</p>
            </div>
          </Link>

          {/* Nav Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/products" className="text-[11px] font-black uppercase tracking-widest text-gray-900 hover:text-gray-500 transition-colors">
              {t('shop')}
            </Link>
            <Link href="/track" className="text-[11px] font-black uppercase tracking-widest text-gray-900 hover:text-gray-500 transition-colors">
              {t('track')}
            </Link>
            {isLoggedIn && (
              <Link href="/orders" className="text-[11px] font-black uppercase tracking-widest text-gray-900 hover:text-gray-500 transition-colors">
                {t('orders')}
              </Link>
            )}
          </nav>

          {/* Search - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('search')}
                className="w-full bg-gray-50 border border-transparent rounded-full py-2 pl-10 pr-4 text-xs font-medium focus:bg-white focus:border-gray-200 outline-none transition-all"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Lang Toggle */}
            <button onClick={toggle} className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-gray-50 transition-colors">
              <GlobeIcon className="w-4 h-4 text-gray-900" />
              <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'en' ? 'TI' : 'EN'}</span>
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
