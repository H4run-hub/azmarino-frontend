'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('order_id');

  useEffect(() => {
    // Clear selected items from cart
    try {
      const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]');
      const remaining = cart.filter((i: any) => i.selected === false);
      localStorage.setItem('azmarino_cart', JSON.stringify(remaining));
      window.dispatchEvent(new Event('cart-updated'));
    } catch {}
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Order Confirmed!</h1>
        <p className="text-slate-500 mb-1">Thank you for shopping with Azmarino.</p>
        <p className="text-slate-500 mb-6">A confirmation email has been sent to you.</p>
        {orderId && (
          <div className="bg-slate-50 rounded-xl px-6 py-3 mb-8">
            <p className="text-xs text-slate-400 mb-1">Order ID</p>
            <p className="font-mono font-bold text-slate-700 text-sm">{orderId}</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/orders" className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">
            View My Orders
          </Link>
          <Link href="/products" className="border-2 border-slate-200 text-slate-700 font-bold px-8 py-3 rounded-xl hover:border-rose-600 hover:text-rose-600 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<Navbar />}>
      <SuccessContent />
    </Suspense>
  );
}
