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
          throw new Error(payload.message || 'Could not load your orders.');
        }

        const nextOrders = payload.orders || payload.data || [];
        setOrders(Array.isArray(nextOrders) ? nextOrders : []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Could not load your orders.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [router]);

  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + (order.total || 0), 0),
    [orders]
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="section-shell pb-16">
        <section className="surface-panel rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
          <p className="eyebrow">Order archive</p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="display-title text-5xl text-[var(--ink-strong)] md:text-6xl">Every order, delivery update, and receipt in one polished place.</h1>
              <p className="soft-copy mt-4 max-w-2xl text-base">
                Review your recent purchases, track fulfilment status, and jump back into the catalog whenever you are ready for the next order.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="metric-card min-w-40">
                <p className="metric-value">{orders.length}</p>
                <p className="metric-label">Orders placed</p>
              </div>
              <div className="metric-card min-w-40">
                <p className="metric-value">{formatPrice(totalSpent)}</p>
                <p className="metric-label">Total spend</p>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="mt-8 grid gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="surface-solid h-44 animate-pulse rounded-[2rem]" />
            ))}
          </section>
        ) : error ? (
          <section className="mt-8 surface-solid rounded-[2rem] px-6 py-10">
            <p className="eyebrow">Something went wrong</p>
            <h2 className="mt-4 text-2xl font-black text-[var(--ink-strong)]">We could not load your orders.</h2>
            <p className="mt-3 max-w-xl text-sm text-[var(--muted)]">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="button-primary mt-6"
            >
              Try again
            </button>
          </section>
        ) : orders.length === 0 ? (
          <section className="mt-8 surface-solid rounded-[2rem] px-6 py-14 text-center">
            <p className="eyebrow">No history yet</p>
            <h2 className="display-title mt-4 text-4xl text-[var(--ink-strong)]">Your order gallery is still empty.</h2>
            <p className="soft-copy mx-auto mt-4 max-w-xl text-base">
              Once you place your first order, the full timeline and payment status will appear here automatically.
            </p>
            <Link href="/products" className="button-primary mt-8">
              Discover products
            </Link>
          </section>
        ) : (
          <section className="mt-8 grid gap-6">
            {orders.map((order) => (
              <article key={order._id} className="surface-solid rounded-[2rem] p-6 md:p-8">
                <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--accent)]">Order {order.orderNumber}</p>
                    <p className="mt-3 text-sm text-[var(--muted)]">
                      Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    {order.trackingNumber ? (
                      <p className="mt-2 text-sm text-[var(--muted)]">Tracking number: <span className="font-semibold text-[var(--ink-strong)]">{order.trackingNumber}</span></p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] ${statusTone[order.status] || 'bg-[var(--accent-soft)] text-[var(--accent)]'}`}>
                      {order.status}
                    </span>
                    {order.paymentStatus ? (
                      <span className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                        Payment {order.paymentStatus}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_14rem]">
                  <div className="space-y-4">
                    {order.items?.map((item, index) => (
                      <div key={`${order._id}-${index}`} className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-[var(--line)] bg-white/70 px-4 py-4">
                        <div>
                          <p className="text-sm font-bold text-[var(--ink-strong)]">{item.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Quantity {item.quantity}</p>
                        </div>
                        <span className="text-sm font-extrabold text-[var(--ink-strong)]">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[1.6rem] border border-[var(--line)] bg-[rgba(255,255,255,0.74)] p-5">
                    <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--muted)]">Order total</p>
                    <p className="mt-3 text-3xl font-black text-[var(--ink-strong)]">{formatPrice(order.total || 0)}</p>
                    <div className="mt-6 grid gap-3">
                      <Link href={`/track?orderNumber=${encodeURIComponent(order.orderNumber)}`} className="button-secondary w-full justify-center">
                        Track order
                      </Link>
                      <Link href="/products" className="button-primary w-full justify-center">
                        Shop again
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
