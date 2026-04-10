'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import type { CartItem } from '../../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

interface Address {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [step, setStep] = useState<'address' | 'payment' | 'processing'>('address');
  const [address, setAddress] = useState<Address>({ street: '', city: '', country: '', postalCode: '' });
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('azmarino_token');
    if (!token) { router.replace('/auth/login'); return; }
    const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]');
    const selected = cart.filter((i: any) => i.selected !== false);
    if (selected.length === 0) { router.replace('/cart'); return; }
    setItems(selected);

    // Pre-fill address from profile
    const userRaw = localStorage.getItem('azmarino_user');
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        if (user.address) setAddress({ ...{ street: '', city: '', country: '', postalCode: '' }, ...user.address });
        if (user.phone) setPhone(user.phone);
      } catch {}
    }
  }, [router]);

  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping = total >= 50 ? 0 : 4.99;
  const grandTotal = total + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.country || !address.postalCode) {
      setError('Please fill in all address fields.');
      return;
    }
    setError('');
    setLoading(true);
    setStep('processing');

    const token = localStorage.getItem('azmarino_token');
    try {
      // Create order
      const orderRes = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: items.map(i => ({
            product: i.product._id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.image,
            selectedSize: i.selectedSize,
            selectedColor: i.selectedColor,
          })),
          shippingAddress: address,
          phone,
          notes,
          subtotal: total,
          shippingCost: shipping,
          total: grandTotal,
          paymentMethod: 'stripe',
        }),
      });

      if (!orderRes.ok) {
        const d = await orderRes.json();
        throw new Error(d.message || 'Failed to create order');
      }
      const order = await orderRes.json();

      // Create Stripe payment intent
      const piRes = await fetch(`${API_URL}/stripe/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId: order._id, amount: Math.round(grandTotal * 100) }),
      });

      if (!piRes.ok) {
        const d = await piRes.json();
        throw new Error(d.message || 'Payment setup failed');
      }
      const { clientSecret, orderId } = await piRes.json();

      // Redirect to Stripe hosted checkout or use Elements
      // For simplicity: redirect to payment page with order info
      router.push(`/checkout/payment?order=${orderId}&secret=${clientSecret}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStep('address');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full" />
        </div>
      </>
    );
  }

  if (step === 'processing') {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="animate-spin w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full" />
          <p className="text-slate-600 font-medium">Setting up your order...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-black text-slate-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Address Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
                <h2 className="font-bold text-slate-800">Shipping Address</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={e => setAddress(a => ({ ...a, street: e.target.value }))}
                    placeholder="123 Main Street, Apt 4B"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                      placeholder="Berlin"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={e => setAddress(a => ({ ...a, postalCode: e.target.value }))}
                      placeholder="10115"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Country</label>
                  <select
                    value={address.country}
                    onChange={e => setAddress(a => ({ ...a, country: e.target.value }))}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  >
                    <option value="">Select country</option>
                    <option value="Germany">Germany</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Norway">Norway</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Austria">Austria</option>
                    <option value="Belgium">Belgium</option>
                    <option value="France">France</option>
                    <option value="Italy">Italy</option>
                    <option value="Spain">Spain</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+49 123 456789"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Order Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Any special instructions..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="font-bold text-slate-800 mb-4">Payment</h2>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border-2 border-rose-600">
                  <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Credit / Debit Card</p>
                    <p className="text-xs text-slate-500">Powered by Stripe — Visa, Mastercard, Amex</p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded font-bold">VISA</span>
                    <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-bold">MC</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3">You will be redirected to Stripe to complete payment securely.</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl text-base transition-colors"
              >
                {loading ? 'Processing...' : `Place Order — €${grandTotal.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
              <h2 className="font-bold text-slate-800 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      {item.product.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{item.product.name}</p>
                      {item.selectedSize && <p className="text-xs text-slate-400">Size: {item.selectedSize}</p>}
                      {item.selectedColor && <p className="text-xs text-slate-400">Color: {item.selectedColor}</p>}
                      <p className="text-xs text-slate-500">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-rose-600 flex-shrink-0">
                      €{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-4 border-t border-slate-100 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600 font-semibold">Free</span> : `€${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-slate-400">Free shipping on orders over €50</p>
                )}
                <div className="flex justify-between font-black text-slate-900 text-base pt-2 border-t border-slate-100">
                  <span>Total</span>
                  <span className="text-rose-600">€{grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <Link href="/cart" className="block text-center text-sm text-slate-400 hover:text-rose-600 mt-4 transition-colors">
                ← Edit Cart
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
