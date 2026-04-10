'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updateState = () => {
    const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]');
    setCartCount(cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0));
    setIsLoggedIn(!!localStorage.getItem('azmarino_token'));
  };

  useEffect(() => {
    updateState();
    window.addEventListener('cart-updated', updateState);
    return () => window.removeEventListener('cart-updated', updateState);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-rose-600">Azmarino</span>
            <span className="hidden sm:block text-sm text-slate-400 font-medium">ኣዝማሪኖ</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/products" className="hover:text-rose-600 transition-colors">Shop</Link>
            <Link href="/track" className="hover:text-rose-600 transition-colors">Track Order</Link>
            {isLoggedIn && <Link href="/orders" className="hover:text-rose-600 transition-colors">My Orders</Link>}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            {isLoggedIn ? (
              <Link href="/profile" className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            ) : (
              <Link href="/auth/login" className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-rose-700 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
