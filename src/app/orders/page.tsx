'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/Navbar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  paymentStatus?: string;
  createdAt: string;
  items: OrderItem[];
  trackingNumber?: string;
}

const formatPrice = (value: number) => `EUR ${value.toFixed(2)}`;

const statusTone: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-900',
  processing: 'bg-slate-900 text-white',
  shipped: 'bg-sky-100 text-sky-900',
  delivered: 'bg-emerald-100 text-emerald-900',
  cancelled: 'bg-rose-100 text-rose-900',
};

export default function OrdersPage() {
  const router = useRouter();
  const { t } = useLang();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('azmarino_token');
    if (!token) {
      router.replace('/auth/login');
      return;
    }

    const loadOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.message || t('ordersError'));
        }

        const nextOrders = payload.orders || payload.data || [];
        setOrders(Array.isArray(nextOrders) ? nextOrders : []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : t('ordersError'));
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [router, t]);

  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + (order.total || 0), 0),
    [orders]
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="section-container py-12">
        <section className="bg-gray-50 border border-gray-100 rounded-3xl px-6 py-8 md:px-10 md:py-10">
          <p className="label-caps mb-4 text-gray-400">{t('orderArchive')}</p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="heading-lg text-black">{t('ordersTitle')}</h1>
              <p className="text-sm text-gray-500 font-medium mt-4 max-w-2xl leading-relaxed">
                {t('ordersSubtitle')}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="bg-white border border-gray-100 p-6 rounded-2xl min-w-40 shadow-sm">
                <p className="text-3xl font-black text-black">{orders.length}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{t('ordersPlaced')}</p>
              </div>
              <div className="bg-white border border-gray-100 p-6 rounded-2xl min-w-40 shadow-sm">
                <p className="text-2xl font-black text-black leading-none">{formatPrice(totalSpent)}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">{t('totalSpend')}</p>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="mt-8 grid gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-44 bg-gray-50 rounded-3xl animate-pulse" />
            ))}
          </section>
        ) : error ? (
          <section className="mt-8 bg-white border border-gray-100 rounded-3xl px-6 py-10 text-center shadow-sm">
            <p className="label-caps text-rose-600 mb-4">Error</p>
            <h2 className="text-2xl font-black text-black">{t('ordersError')}</h2>
            <p className="mt-3 max-w-xl mx-auto text-sm text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-black mt-6 inline-flex"
            >
              Try again
            </button>
          </section>
        ) : orders.length === 0 ? (
          <section className="mt-8 bg-white border border-gray-100 rounded-3xl px-6 py-14 text-center shadow-sm">
            <p className="label-caps text-gray-400 mb-4">{t('noHistory')}</p>
            <h2 className="heading-lg text-black">{t('emptyOrders')}</h2>
            <p className="text-sm text-gray-500 font-medium mx-auto mt-4 max-w-xl">
              {t('firstOrder')}
            </p>
            <Link href="/products" className="btn-black mt-8 inline-flex">
              {t('discoverProducts')}
            </Link>
          </section>
        ) : (
          <section className="mt-8 grid gap-6">
            {orders.map((order) => (
              <article key={order._id} className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm hover:border-gray-200 transition-all">
                <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-black">{t('order')} #{order.orderNumber}</p>
                    <p className="mt-2 text-xs font-bold text-gray-400 uppercase tracking-tight">
                      {t('placedOn')} {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    {order.trackingNumber ? (
                      <p className="mt-2 text-xs font-bold text-gray-400 uppercase tracking-tight">{t('trackingNumber')}: <span className="font-black text-black">{order.trackingNumber}</span></p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${statusTone[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                    {order.paymentStatus ? (
                      <span className="rounded-full border border-gray-100 bg-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {t('payment')} {order.paymentStatus}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
                  <div className="space-y-4">
                    {order.items?.map((item, index) => (
                      <div key={`${order._id}-${index}`} className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-4">
                        <div>
                          <p className="text-sm font-black uppercase tracking-tight text-black leading-tight">{item.name}</p>
                          <p className="mt-1 text-[10px] font-bold text-gray-400 uppercase">{t('qty')} {item.quantity}</p>
                        </div>
                        <span className="text-sm font-black text-black">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 flex flex-col">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('orderTotal')}</p>
                    <p className="text-3xl font-black text-black tracking-tighter">{formatPrice(order.total || 0)}</p>
                    <div className="mt-auto pt-6 grid gap-3">
                      <Link href={`/track?orderNumber=${encodeURIComponent(order.orderNumber)}`} className="btn-outline h-12 text-[10px] border-gray-200">
                        {t('trackOrder')}
                      </Link>
                      <Link href="/products" className="btn-black h-12 text-[10px]">
                        {t('shopAgain')}
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
