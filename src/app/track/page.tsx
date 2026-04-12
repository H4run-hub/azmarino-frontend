'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useLang } from '../../context/LanguageContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface TrackedOrder {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  paymentStatus?: string;
  shippingAddress?: {
    fullName?: string;
    city?: string;
    country?: string;
  };
  items?: OrderItem[];
}

const timeline = ['pending', 'processing', 'shipped', 'delivered'];

function TrackOrderContent() {
  const { t } = useLang();
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const existingUser = localStorage.getItem('azmarino_user');
    const prefilledOrder = searchParams.get('orderNumber');

    if (prefilledOrder) {
      setOrderNumber(prefilledOrder);
    }

    if (existingUser) {
      try {
        const parsed = JSON.parse(existingUser);
        setEmail(parsed.email || '');
      } catch {
        // Ignore malformed local profile data.
      }
    }
  }, [searchParams]);

  const currentStep = useMemo(() => {
    if (!order) return -1;
    const index = timeline.indexOf(order.status);
    return index >= 0 ? index : 1;
  }, [order]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch(
        `${API_URL}/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Order not found.');
      }

      setOrder(payload.order || payload.data || null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Order not found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section-container py-12">
      <header className="mb-12 border-b border-gray-100 pb-8">
        <p className="label-caps mb-2 text-gray-400">{t('track')}</p>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">{t('trackingTitle')}</h1>
      </header>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
        
        {/* Track Form */}
        <div className="space-y-12">
          <form onSubmit={handleSubmit} className="p-8 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('orderNumber')}</label>
              <input
                required
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value)}
                placeholder="AZ-XXXXXX"
                className="input-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('email')}</label>
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-base"
              />
            </div>
            {error && <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest text-center">{error}</p>}
            <button type="submit" disabled={loading} className="btn-black w-full h-14">
              {loading ? t('locating') : t('searchOrder')}
            </button>
          </form>

          {/* Result */}
          {order && (
            <div className="p-8 border border-gray-100 rounded-3xl bg-gray-50/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-start mb-10 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{t('status')}</p>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-black">{order.status}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{t('created')}</p>
                  <p className="text-sm font-bold text-black">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-12">
                <div className="flex justify-between mb-4">
                  {timeline.map((step, i) => (
                    <div key={step} className="flex flex-col items-center gap-2">
                      <div className={`w-3 h-3 rounded-full border-2 ${i <= currentStep ? 'bg-black border-black' : 'bg-white border-gray-200'}`} />
                      <span className={`text-[8px] font-black uppercase tracking-widest ${i <= currentStep ? 'text-black' : 'text-gray-300'}`}>{step}</span>
                    </div>
                  ))}
                </div>
                <div className="relative h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-black transition-all duration-1000" 
                    style={{ width: `${(currentStep / (timeline.length - 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('trackingId')}</p>
                  <p className="text-xs font-black text-black">{order.trackingNumber || t('pendingAssignment')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('totalValue')}</p>
                  <p className="text-xs font-black text-black">€{order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <aside className="space-y-6">
          <div className="p-8 border border-gray-100 rounded-3xl bg-black text-white">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6">{t('trackingSupport')}</h2>
            <p className="text-xs text-gray-400 font-medium leading-relaxed mb-8">
              {t('trackingDesc')}
            </p>
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{t('realTimeUpdates')}</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{t('itemBreakdown')}</span>
               </div>
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Suspense fallback={<div className="section-container py-40 flex justify-center"><div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>}>
        <TrackOrderContent />
      </Suspense>
    </div>
  );
}
