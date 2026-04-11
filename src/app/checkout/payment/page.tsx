'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

function PaymentContent() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get('order');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [stripeUrl, setStripeUrl] = useState('');

  useEffect(() => {
    if (!orderId) {
      router.replace('/checkout');
      return;
    }

    const token = localStorage.getItem('azmarino_token');

    fetch(`${API_URL}/stripe/checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.url) throw new Error(data.message || 'Payment setup failed.');
        setStripeUrl(data.url);
        setStatus('ready');
        window.setTimeout(() => {
          window.location.href = data.url;
        }, 900);
      })
      .catch(() => setStatus('error'));
  }, [orderId, router]);

  return (
    <main className="section-shell py-16">
      <div className="surface-solid mx-auto max-w-3xl rounded-[2rem] px-6 py-14 text-center md:px-10">
        {status === 'loading' ? (
          <>
            <p className="eyebrow">Payment</p>
            <h1 className="display-title mt-4 text-5xl text-[var(--ink-strong)]">Preparing your secure checkout.</h1>
            <p className="soft-copy mx-auto mt-4 max-w-xl text-base">
              We are creating your Stripe session now. You will be redirected automatically in a moment.
            </p>
            <div className="mx-auto mt-8 h-12 w-12 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
          </>
        ) : null}

        {status === 'ready' ? (
          <>
            <p className="eyebrow">Redirecting</p>
            <h1 className="display-title mt-4 text-5xl text-[var(--ink-strong)]">Your Stripe page is ready.</h1>
            <p className="soft-copy mx-auto mt-4 max-w-xl text-base">
              If you are not redirected automatically, use the secure button below to continue payment.
            </p>
            <a href={stripeUrl} className="button-primary mt-8">
              Continue to Stripe
            </a>
          </>
        ) : null}

        {status === 'error' ? (
          <>
            <p className="eyebrow">Payment issue</p>
            <h1 className="display-title mt-4 text-5xl text-[var(--ink-strong)]">We could not create the payment session.</h1>
            <p className="soft-copy mx-auto mt-4 max-w-xl text-base">
              Please go back to checkout and try again. Your cart is still available.
            </p>
            <button onClick={() => router.push('/checkout')} className="button-primary mt-8">
              Return to checkout
            </button>
          </>
        ) : null}
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Suspense fallback={<main className="section-shell py-16" />}>
        <PaymentContent />
      </Suspense>
    </div>
  );
}
