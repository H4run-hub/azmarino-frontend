'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import type { Product } from '../../lib/api';

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selected?: boolean;
  selectedSize?: string;
  selectedColor?: string;
}

const formatPrice = (value: number) => `EUR ${value.toFixed(2)}`;

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = () => {
      const stored = JSON.parse(localStorage.getItem('azmarino_cart') || '[]') as CartItem[];
      setCart(stored);
    };
    loadCart();
    window.addEventListener('cart-updated', loadCart);
    return () => window.removeEventListener('cart-updated', loadCart);
  }, []);

  const saveCart = (nextCart: CartItem[]) => {
    localStorage.setItem('azmarino_cart', JSON.stringify(nextCart));
    window.dispatchEvent(new Event('cart-updated'));
    setCart(nextCart);
  };

  const updateQuantity = (id: string, delta: number) => {
    saveCart(
      cart.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)
    );
  };

  const removeItem = (id: string) => {
    saveCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="section-shell pb-16">
        <section className="surface-panel rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
          <p className="eyebrow">Cart</p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="display-title text-5xl text-[var(--ink-strong)] md:text-6xl">Review your selections before checkout.</h1>
              <p className="soft-copy mt-4 text-base">
                Adjust quantities, confirm your chosen variants, and continue into a cleaner Stripe-backed payment flow.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/68 px-5 py-4 text-sm text-[var(--muted)]">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[var(--accent)]">Items</p>
              <p className="mt-2 font-semibold text-[var(--ink-strong)]">{cart.length} products selected</p>
            </div>
          </div>
        </section>

        {cart.length === 0 ? (
          <section className="surface-solid mt-8 rounded-[2rem] px-6 py-16 text-center">
            <p className="eyebrow">Cart empty</p>
            <h2 className="display-title mt-4 text-4xl text-[var(--ink-strong)]">Your next favorite item is still waiting.</h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-[var(--muted)]">
              Browse the catalogue to discover the latest premium fashion, beauty, and technology picks.
            </p>
            <Link href="/products" className="button-primary mt-8">
              Browse the catalogue
            </Link>
          </section>
        ) : (
          <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="space-y-4">
              {cart.map((item) => (
                <article key={item.id} className="surface-solid flex flex-col gap-5 rounded-[1.8rem] p-5 sm:flex-row sm:items-center">
                  <div className="relative aspect-square w-full max-w-[8rem] overflow-hidden rounded-[1.4rem] bg-[linear-gradient(180deg,#f6efe5,#ebe1d1)]">
                    <Image src={item.product?.image || '/logo.jpg'} alt={item.product?.name || 'Product'} fill className="object-cover" sizes="128px" />
                  </div>

                  <div className="flex-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[var(--muted)]">
                      {(item.product?.category || 'collection').replace(/-/g, ' ')}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-[var(--ink-strong)]">{item.product?.name}</h2>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                      {item.selectedSize ? <span>Size {item.selectedSize}</span> : null}
                      {item.selectedColor ? <span>Color {item.selectedColor}</span> : null}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:items-end">
                    <p className="text-base font-extrabold text-[var(--ink-strong)]">{formatPrice(item.product?.price || 0)}</p>
                    <div className="inline-flex items-center rounded-full border border-[var(--line)] bg-white/72">
                      <button onClick={() => updateQuantity(item.id, -1)} className="px-4 py-3 text-sm font-bold">-</button>
                      <span className="min-w-10 px-2 text-center text-sm font-extrabold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="px-4 py-3 text-sm font-bold">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="surface-panel h-fit rounded-[2rem] p-6 xl:sticky xl:top-28">
              <p className="eyebrow">Summary</p>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-center justify-between text-[var(--muted)]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[var(--ink-strong)]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-[var(--muted)]">
                  <span>Shipping</span>
                  <span className="font-semibold text-[var(--ink-strong)]">{shipping === 0 ? 'Included' : formatPrice(shipping)}</span>
                </div>
                <div className="border-t border-[var(--line)] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Total</span>
                    <span className="text-xl font-extrabold text-[var(--ink-strong)]">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link href="/checkout" className="button-primary w-full">
                  Proceed to checkout
                </Link>
                <Link href="/products" className="button-secondary w-full">
                  Continue shopping
                </Link>
              </div>
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}
