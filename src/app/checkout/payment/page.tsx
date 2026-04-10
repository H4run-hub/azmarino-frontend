'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

function PaymentContent() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get('order');
  const clientSecret = params.get('secret');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [stripeUrl, setStripeUrl] = useState('');

  useEffect(() => {
    if (!orderId || !clientSecret) { router.replace('/cart'); return; }

    // Create a Stripe Checkout Session redirect URL from server
    const token = localStorage.getItem('azmarino_token');
    fetch(`${API_URL}/stripe/checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ orderId }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.url) {
          setStripeUrl(d.url);
          setStatus('ready');
          // Auto-redirect after 1.5s
          setTimeout(() => { window.location.href = d.url; }, 1500);
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [orderId, clientSecret, router]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full mb-4" />
            <p className="text-slate-600 font-medium">Preparing secure payment...</p>
          </>
        )}
        {status === 'ready' && (
          <>
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Redirecting to Stripe</h2>
            <p className="text-slate-500 text-sm mb-6">You will be redirected to complete your payment securely.</p>
            <a
              href={stripeUrl}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 py-3 rounded-xl transition-colors"
            >
              Continue to Payment
            </a>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Payment Setup Failed</h2>
            <p className="text-slate-500 text-sm mb-6">We could not set up your payment. Please try again.</p>
            <button
              onClick={() => router.push('/checkout')}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 py-3 rounded-xl transition-colors"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="animate-spin w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full" />
        </div>
      </>
    }>
      <PaymentContent />
    </Suspense>
  );
}
