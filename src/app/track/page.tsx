'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';

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

const formatPrice = (value: number) => `EUR ${value.toFixed(2)}`;

const timeline = ['pending', 'processing', 'shipped', 'delivered'];

function TrackOrderContent() {
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
    if (!order) {
      return -1;
    }
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
    <main className="section-shell pb-16">
      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_0.95fr]">
        <div className="surface-panel rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
          <p className="eyebrow">Track delivery</p>
          <h1 className="display-title mt-4 text-5xl text-[var(--ink-strong)] md:text-6xl">Follow your order from confirmation to doorstep.</h1>
          <p className="soft-copy mt-4 max-w-2xl text-base">
            Enter your order number and the email used at checkout to view the latest status, tracking details, and item summary.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            <label className="block">
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Order number</span>
              <input
                required
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                placeholder="AZ-123456-ABCD"
                className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]"
              />
            </label>

            {error ? (
              <div className="rounded-[1.3rem] border border-[rgba(158,36,52,0.2)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent)]">
                {error}
              </div>
            ) : null}

            <button type="submit" disabled={loading} className="button-primary mt-2 justify-center">
              {loading ? 'Checking status...' : 'Track order'}
            </button>
          </form>
        </div>

        <aside className="surface-solid rounded-[2rem] p-6 md:p-8">
          <p className="eyebrow">What you will see</p>
          <div className="mt-6 grid gap-4">
            <div className="metric-card">
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">Live status</p>
              <p className="mt-3 text-lg font-bold text-[var(--ink-strong)]">Confirmation, fulfilment, shipment, and final delivery updates.</p>
            </div>
            <div className="metric-card">
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">Tracking details</p>
              <p className="mt-3 text-lg font-bold text-[var(--ink-strong)]">Carrier reference, estimated arrival, and purchase summary.</p>
            </div>
            <div className="rounded-[1.6rem] border border-[rgba(176,134,74,0.3)] bg-[rgba(176,134,74,0.1)] p-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--gold)]">Tip</p>
              <p className="mt-3 text-sm leading-7 text-[var(--ink)]">
                Sign in before placing your next order and we will keep the email field ready for faster tracking.
              </p>
            </div>
          </div>
        </aside>
      </section>

      {order ? (
        <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_21rem]">
          <article className="surface-solid rounded-[2rem] p-6 md:p-8">
            <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--accent)]">Order {order.orderNumber}</p>
                <h2 className="mt-3 text-3xl font-black text-[var(--ink-strong)]">Status: {order.status}</h2>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] px-5 py-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Payment</p>
                <p className="mt-2 text-base font-bold capitalize text-[var(--ink-strong)]">{order.paymentStatus || 'pending'}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {timeline.map((step, index) => {
                const active = currentStep >= index;
                return (
                  <div
                    key={step}
                    className={`rounded-[1.5rem] border px-4 py-5 ${
                      active
                        ? 'border-[rgba(158,36,52,0.22)] bg-[var(--accent-soft)]'
                        : 'border-[var(--line)] bg-white'
                    }`}
                  >
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">Step {index + 1}</p>
                    <p className="mt-3 text-sm font-black capitalize text-[var(--ink-strong)]">{step}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Tracking number</p>
                <p className="mt-3 text-lg font-bold text-[var(--ink-strong)]">{order.trackingNumber || 'Assigned once shipped'}</p>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Estimated delivery</p>
                <p className="mt-3 text-lg font-bold text-[var(--ink-strong)]">
                  {order.estimatedDelivery
                    ? new Date(order.estimatedDelivery).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                    : 'We will add this once the carrier confirms dispatch'}
                </p>
              </div>
            </div>

            {order.shippingAddress ? (
              <div className="mt-6 rounded-[1.6rem] border border-[var(--line)] bg-white/60 p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Shipping destination</p>
                <p className="mt-3 text-sm font-semibold text-[var(--ink-strong)]">{order.shippingAddress.fullName || 'Recipient'}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {[order.shippingAddress.city, order.shippingAddress.country].filter(Boolean).join(', ')}
                </p>
              </div>
            ) : null}
          </article>

          <aside className="surface-panel h-fit rounded-[2rem] p-6 xl:sticky xl:top-28">
            <p className="eyebrow">Purchase summary</p>
            <div className="mt-5 space-y-4">
              {order.items?.map((item, index) => (
                <div key={`${item.name}-${index}`} className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink-strong)]">{item.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Qty {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-[var(--ink-strong)]">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-[var(--line)] pt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Order total</span>
                <span className="text-xl font-extrabold text-[var(--ink-strong)]">{formatPrice(order.total || 0)}</span>
              </div>
            </div>
          </aside>
        </section>
      ) : null}
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Suspense fallback={<main className="section-shell py-16" />}>
        <TrackOrderContent />
      </Suspense>
    </div>
  );
}
