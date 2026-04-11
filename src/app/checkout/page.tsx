'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import type { CartItem } from '../../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

interface AddressForm {
  fullName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
}

interface CheckoutCartItem extends CartItem {
  selected?: boolean;
}

const formatPrice = (value: number) => `EUR ${value.toFixed(2)}`;

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [address, setAddress] = useState<AddressForm>({
    fullName: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    phone: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('azmarino_token');
    const userRaw = localStorage.getItem('azmarino_user');
    const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]') as CheckoutCartItem[];

    if (!token || !userRaw) {
      router.replace('/auth/login');
      return;
    }

    const selectedItems = cart.filter((item) => item.selected !== false);
    if (!selectedItems.length) {
      router.replace('/cart');
      return;
    }

    try {
      const user = JSON.parse(userRaw);
      setUserEmail(user.email || '');
      setUserId(user._id || user.id || null);
      setAddress({
        fullName: user.name || '',
        address: user.address?.street || '',
        city: user.address?.city || '',
        country: user.address?.country || '',
        postalCode: user.address?.postalCode || user.address?.zip || '',
        phone: user.phone || '',
      });
    } catch {
      router.replace('/auth/login');
      return;
    }

    setItems(selectedItems);
  }, [router]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );
  const shippingCost = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + shippingCost;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!address.fullName || !address.address || !address.city || !address.country) {
      setError('Please complete the shipping form before continuing.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('azmarino_token');
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: userEmail,
          userId,
          items: items.map((item) => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
          })),
          shippingAddress: address,
          subtotal,
          shippingCost,
          total,
          notes,
          paymentMethod: 'stripe',
          paymentStatus: 'pending',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Could not create your order.');
      }

      const order = data.order || data.data;
      router.push(`/checkout/payment?order=${order._id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong while preparing payment.');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="section-shell py-16">
          <div className="surface-solid rounded-[2rem] px-6 py-16 text-center">
            <div className="mx-auto h-10 w-10 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="section-shell pb-16">
        <section className="surface-panel rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
          <p className="eyebrow">Checkout</p>
          <h1 className="display-title mt-4 text-5xl text-[var(--ink-strong)] md:text-6xl">Confirm your details and continue to Stripe.</h1>
          <p className="soft-copy mt-4 max-w-2xl text-base">
            Review your address, keep your order summary visible, and complete payment through a secure hosted checkout.
          </p>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="surface-solid rounded-[2rem] p-6 md:p-8">
              <p className="eyebrow">Shipping</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Full name</span>
                  <input value={address.fullName} onChange={(event) => setAddress((current) => ({ ...current, fullName: event.target.value }))} className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]" required />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Street address</span>
                  <input value={address.address} onChange={(event) => setAddress((current) => ({ ...current, address: event.target.value }))} className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]" required />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">City</span>
                  <input value={address.city} onChange={(event) => setAddress((current) => ({ ...current, city: event.target.value }))} className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]" required />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Postal code</span>
                  <input value={address.postalCode} onChange={(event) => setAddress((current) => ({ ...current, postalCode: event.target.value }))} className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Country</span>
                  <input value={address.country} onChange={(event) => setAddress((current) => ({ ...current, country: event.target.value }))} className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]" required />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Phone</span>
                  <input value={address.phone} onChange={(event) => setAddress((current) => ({ ...current, phone: event.target.value }))} className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]" />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Notes</span>
                  <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]" placeholder="Optional delivery instructions" />
                </label>
              </div>
            </div>

            <div className="surface-solid rounded-[2rem] p-6 md:p-8">
              <p className="eyebrow">Payment</p>
              <div className="mt-5 rounded-[1.5rem] border border-[rgba(158,36,52,0.16)] bg-[var(--accent-soft)] p-5">
                <p className="text-sm font-bold text-[var(--ink-strong)]">Hosted Stripe checkout</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  You will be redirected to a secure Stripe page to complete payment and return to Azmarino once the order is confirmed.
                </p>
              </div>
            </div>

            {error ? (
              <div className="rounded-[1.3rem] border border-[rgba(158,36,52,0.2)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent)]">
                {error}
              </div>
            ) : null}

            <button type="submit" disabled={loading} className="button-primary w-full justify-center">
              {loading ? 'Preparing payment...' : `Continue to payment - ${formatPrice(total)}`}
            </button>
          </form>

          <aside className="surface-panel h-fit rounded-[2rem] p-6 xl:sticky xl:top-28">
            <p className="eyebrow">Order summary</p>
            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink-strong)]">{item.product.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                      Qty {item.quantity}
                      {item.selectedSize ? ` | Size ${item.selectedSize}` : ''}
                      {item.selectedColor ? ` | Color ${item.selectedColor}` : ''}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[var(--ink-strong)]">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between text-[var(--muted)]">
                <span>Subtotal</span>
                <span className="font-semibold text-[var(--ink-strong)]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[var(--muted)]">
                <span>Shipping</span>
                <span className="font-semibold text-[var(--ink-strong)]">{shippingCost === 0 ? 'Included' : formatPrice(shippingCost)}</span>
              </div>
              <div className="border-t border-[var(--line)] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Total</span>
                  <span className="text-xl font-extrabold text-[var(--ink-strong)]">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <Link href="/cart" className="button-secondary mt-6 w-full justify-center">
              Back to cart
            </Link>
          </aside>
        </section>
      </main>
    </div>
  );
}
