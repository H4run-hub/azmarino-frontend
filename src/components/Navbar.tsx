'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const updateState = () => {
    const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]');
    setCartCount(cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0));
    setIsLoggedIn(!!localStorage.getItem('azmarino_token'));
  };

  useEffect(() => {
    updateState();
    window.addEventListener('cart-updated', updateState);
    const onScroll = () => setScrolled(window.scrollY > 10);
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
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'shadow-sm'} border-b border-gray-100`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">A</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black text-gray-900 tracking-tight">Azmarino</span>
                <span className="text-xs text-gray-400 font-medium hidden sm:block">ኣዝማሪኖ</span>
              </div>
            </Link>

            {/* Search bar — desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search 1,184+ products..."
                  className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 flex-shrink-0">
              <Link href="/products" className="hover:text-rose-600 transition-colors">Shop</Link>
              <Link href="/track" className="hover:text-rose-600 transition-colors">Track</Link>
              {isLoggedIn && <Link href="/orders" className="hover:text-rose-600 transition-colors">Orders</Link>}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-1 ml-auto md:ml-0 flex-shrink-0">
              {/* Mobile search toggle */}
              <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors" onClick={() => setMobileOpen(o => !o)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Cart */}
              <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Profile / Sign in */}
              {isLoggedIn ? (
                <Link href="/profile" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              ) : (
                <Link href="/auth/login" className="hidden sm:block bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                  Sign In
                </Link>
              )}

              {/* Mobile hamburger */}
              <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors" onClick={() => setMobileOpen(o => !o)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-3 space-y-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
            <nav className="flex flex-col gap-1">
              {[
                { href: '/products', label: 'Shop All Products' },
                { href: '/track', label: 'Track Order' },
                ...(isLoggedIn ? [{ href: '/orders', label: 'My Orders' }, { href: '/profile', label: 'My Profile' }] : []),
              ].map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                  {link.label}
                </Link>
              ))}
              {!isLoggedIn && (
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                  className="mt-1 w-full bg-rose-600 text-white text-sm font-semibold py-2.5 px-4 rounded-xl text-center hover:bg-rose-700 transition-colors">
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
