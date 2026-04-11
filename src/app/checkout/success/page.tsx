'use client';

import Link from 'next/link';
import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';

interface StoredCartItem {
  selected?: boolean;
}

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('order_id');

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]') as StoredCartItem[];
    const remaining = cart.filter((item) => item.selected === false);
    localStorage.setItem('azmarino_cart', JSON.stringify(remaining));
    window.dispatchEvent(new Event('cart-updated'));
  }, []);

  return (
    <main className="section-shell py-16">
      <div className="surface-solid mx-auto max-w-3xl rounded-[2rem] px-6 py-14 text-center md:px-10">
        <p className="eyebrow">Order confirmed</p>
        <h1 className="display-title mt-4 text-5xl text-[var(--ink-strong)]">Thank you for shopping with Azmarino.</h1>
        <p className="soft-copy mx-auto mt-4 max-w-xl text-base">
          Your order is now in progress. A confirmation email has been sent, and tracking details will stay visible inside your account.
        </p>

        {orderId ? (
          <div className="mx-auto mt-8 max-w-sm rounded-[1.4rem] border border-[var(--line)] bg-white/72 px-5 py-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[var(--accent)]">Order reference</p>
            <p className="mt-2 text-sm font-bold text-[var(--ink-strong)]">{orderId}</p>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/orders" className="button-primary">
            View my orders
          </Link>
          <Link href="/products" className="button-secondary">
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Suspense fallback={<main className="section-shell py-16" />}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
