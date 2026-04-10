'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '../context/LanguageContext';
import { BagIcon, SearchIcon, UserIcon, MenuIcon, CloseIcon, GlobeIcon } from './Icons';

export default function Navbar() {
  const router = useRouter();
  const { lang, toggle, t } = useLang();
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const updateState = () => {
    const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]');
    setCartCount(cart.reduce((s: number, i: any) => s + (i.quantity || 1), 0));
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
    <header className={`sticky top-0 z-50 bg-white transition-all duration-200 ${scrolled ? 'shadow-[0_2px_15px_rgba(0,0,0,0.05)]' : 'border-b border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center h-11 gap-2">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 mr-2">
            <div className="relative w-28 h-7">
              <img
                src="/logo.jpg"
                alt="Azmarino"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          {/* Search — desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg">
            <div className="relative w-full">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('search')}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all placeholder:text-gray-400"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </form>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600 flex-shrink-0">
            <Link href="/products" className="hover:text-rose-600 transition-colors">{t('shop')}</Link>
            <Link href="/track" className="hover:text-rose-600 transition-colors">{t('track')}</Link>
            {isLoggedIn && <Link href="/orders" className="hover:text-rose-600 transition-colors">{t('orders')}</Link>}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-0.5 ml-auto">
            {/* Language toggle */}
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-xs font-bold text-gray-600"
              title="Switch language"
            >
              <GlobeIcon className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'ትግ' : 'EN'}</span>
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <BagIcon className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            {isLoggedIn ? (
              <Link href="/profile" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <UserIcon className="w-5 h-5 text-gray-700" />
              </Link>
            ) : (
              <Link href="/auth/login" className="hidden sm:block bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold px-3 py-1.5 rounded-lg transition-colors ml-1">
                {t('signIn')}
              </Link>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(o => !o)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors ml-0.5">
              {mobileOpen ? <CloseIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-5 space-y-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t('search')}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </form>

          <nav className="space-y-0.5">
            {[
              { href: '/products', label: t('shop') },
              { href: '/track', label: t('track') },
              ...(isLoggedIn ? [
                { href: '/orders', label: t('orders') },
                { href: '/profile', label: lang === 'en' ? 'Profile' : 'ፕሮፋይል' },
              ] : []),
            ].map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex gap-2 pt-1">
            <button onClick={toggle}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:border-rose-600 hover:text-rose-600 transition-colors">
              <GlobeIcon className="w-4 h-4" />
              {lang === 'en' ? 'ትግርኛ' : 'English'}
            </button>
            {!isLoggedIn && (
              <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                className="flex-1 bg-rose-600 text-white text-sm font-bold py-2 px-4 rounded-xl text-center hover:bg-rose-700 transition-colors">
                {t('signIn')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
