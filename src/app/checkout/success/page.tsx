'use client';

import Link from 'next/link';
import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { useLang } from '../../../context/LanguageContext';

interface StoredCartItem {
  selected?: boolean;
}

function SuccessContent() {
  const { t } = useLang();
  const params = useSearchParams();
  const orderId = params.get('order_id');

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]') as StoredCartItem[];
    const remaining = cart.filter((item) => item.selected === false);
    localStorage.setItem('azmarino_cart', JSON.stringify(remaining));
    window.dispatchEvent(new Event('cart-updated'));
  }, []);

  return (
    <main className="section-container py-16">
      <div className="bg-white border border-gray-100 mx-auto max-w-3xl rounded-3xl px-6 py-14 text-center md:px-10 shadow-sm">
        <p className="label-caps mb-4 text-gray-400">{t('orderConfirmed')}</p>
        <h1 className="heading-lg mb-6">{t('thankYou')}</h1>
        <p className="text-sm text-gray-500 font-medium mx-auto mt-4 max-w-xl leading-relaxed">
          {t('orderInProgress')}
        </p>

        {orderId ? (
          <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('orderReference')}</p>
            <p className="mt-2 text-sm font-black text-black">{orderId}</p>
          </div>
        ) : null}

        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/orders" className="btn-black h-14 px-10">
            {t('viewMyOrders')}
          </Link>
          <Link href="/products" className="btn-outline h-14 px-10 border-gray-200">
            {t('continueShopping')}
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
