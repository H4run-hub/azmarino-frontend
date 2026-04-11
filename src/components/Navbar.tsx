'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '../context/LanguageContext';
import { BagIcon, SearchIcon, UserIcon, MenuIcon, CloseIcon, GlobeIcon } from './Icons';

interface StoredCartItem {
  quantity?: number;
}

const readCartCount = () => {
  const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]') as StoredCartItem[];
  return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
};

const readLoggedIn = () => Boolean(localStorage.getItem('azmarino_token'));

export default function Navbar() {
  const router = useRouter();
  const { lang, toggle, t } = useLang();
  const [cartCount, setCartCount] = useState(() => (typeof window === 'undefined' ? 0 : readCartCount()));
  const [isLoggedIn, setIsLoggedIn] = useState(() => (typeof window === 'undefined' ? false : readLoggedIn()));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(() => (typeof window === 'undefined' ? false : window.scrollY > 10));

  useEffect(() => {
    const syncState = () => {
      setCartCount(readCartCount());
      setIsLoggedIn(readLoggedIn());
    };
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('cart-updated', syncState);
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('cart-updated', syncState);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = search.trim();
    if (!query) return;
    router.push(`/products?search=${encodeURIComponent(query)}`);
    setSearch('');
    setMobileOpen(false);
  };

  const navLinks = [
    { href: '/products', label: t('shop') },
    { href: '/track', label: t('track') },
    ...(isLoggedIn ? [{ href: '/orders', label: t('orders') }] : []),
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-[var(--line)] bg-[rgba(255,250,244,0.72)] backdrop-blur-xl">
        <div className="section-shell hidden sm:flex items-center justify-between py-2 text-[0.68rem] uppercase tracking-[0.28em] text-[var(--muted)]">
          <span>Premium global marketplace for the Eritrean diaspora</span>
          <span>Secure checkout. Delivery across Europe.</span>
        </div>
      </div>

      <div className={`transition-all duration-300 ${scrolled ? 'pt-2 pb-3' : 'pt-4 pb-4'}`}>
        <div className="section-shell">
          <div className="surface-panel rounded-[30px] px-4 md:px-6">
            <div className="flex items-center gap-3 py-3 md:py-4">
              <Link href="/" className="flex items-center gap-3 min-w-0">
                <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-white/70 bg-white/70">
                  <Image src="/logo.jpg" alt="Azmarino" fill className="object-cover" sizes="44px" priority />
                </div>
                <div className="min-w-0">
                  <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.34em] text-[var(--accent)]">Azmarino</p>
                  <p className="display-title text-xl leading-none text-[var(--ink-strong)] md:text-[1.7rem]">Global premium edit</p>
                </div>
              </Link>

              <nav className="ml-6 hidden items-center gap-5 lg:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-semibold text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <form onSubmit={handleSearch} className="ml-auto hidden flex-1 max-w-xl lg:block">
                <label className="relative block">
                  <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={t('search')}
                    className="w-full rounded-full border border-[var(--line)] bg-white/70 py-3 pl-11 pr-4 text-sm text-[var(--ink-strong)] outline-none transition focus:border-[var(--accent)]"
                  />
                </label>
              </form>

              <div className="ml-auto flex items-center gap-1.5 lg:ml-4">
                <button
                  onClick={toggle}
                  className="hidden items-center gap-2 rounded-full border border-[var(--line)] bg-white/60 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--ink)] transition hover:border-[rgba(158,36,52,0.25)] md:inline-flex"
                  title="Switch language"
                >
                  <GlobeIcon className="h-3.5 w-3.5" />
                  {lang === 'en' ? 'TI' : 'EN'}
                </button>

                <Link href="/cart" className="relative rounded-full border border-[var(--line)] bg-white/60 p-3 transition hover:border-[rgba(158,36,52,0.25)]">
                  <BagIcon className="h-5 w-5 text-[var(--ink)]" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-black text-white">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>

                {isLoggedIn ? (
                  <Link href="/profile" className="hidden rounded-full border border-[var(--line)] bg-white/60 p-3 transition hover:border-[rgba(158,36,52,0.25)] md:inline-flex">
                    <UserIcon className="h-5 w-5 text-[var(--ink)]" />
                  </Link>
                ) : (
                  <Link href="/auth/login" className="hidden button-primary px-5 py-3 text-sm md:inline-flex">
                    {t('signIn')}
                  </Link>
                )}

                <button
                  onClick={() => setMobileOpen((open) => !open)}
                  className="inline-flex rounded-full border border-[var(--line)] bg-white/60 p-3 transition hover:border-[rgba(158,36,52,0.25)] lg:hidden"
                >
                  {mobileOpen ? <CloseIcon className="h-5 w-5 text-[var(--ink)]" /> : <MenuIcon className="h-5 w-5 text-[var(--ink)]" />}
                </button>
              </div>
            </div>

            {mobileOpen && (
              <div className="border-t border-[var(--line)] py-4 lg:hidden">
                <form onSubmit={handleSearch}>
                  <label className="relative block">
                    <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder={t('search')}
                      className="w-full rounded-full border border-[var(--line)] bg-white/80 py-3 pl-11 pr-4 text-sm text-[var(--ink-strong)] outline-none transition focus:border-[var(--accent)]"
                    />
                  </label>
                </form>

                <div className="mt-4 grid gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-2xl border border-[var(--line)] bg-white/60 px-4 py-3 text-sm font-semibold text-[var(--ink)]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={toggle}
                    className="button-secondary flex-1 px-4 py-3 text-sm"
                  >
                    <GlobeIcon className="h-4 w-4" />
                    {lang === 'en' ? 'Switch to TI' : 'Switch to EN'}
                  </button>
                  {!isLoggedIn && (
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="button-primary flex-1 px-4 py-3 text-sm">
                      {t('signIn')}
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
