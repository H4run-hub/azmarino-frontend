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

const INPUT_CLS = "w-full px-3 py-2.5 rounded-none border border-gray-200 text-xs font-bold focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white";
const LABEL_CLS = "block text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1";

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
          <div className="animate-spin w-6 h-6 border-2 border-black border-t-transparent rounded-none" />
        </div>
      </>
    );
  }

  if (step === 'processing') {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-none" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Setting up your order...</p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-2 sm:px-4 lg:px-6 py-6 w-full">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xs font-black uppercase tracking-[0.3em] text-rose-600">Step 02</h1>
          <h2 className="text-2xl font-black text-black uppercase tracking-tighter">Checkout</h2>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        <div className="grid lg:grid-cols-3 gap-1.5">
          {/* Address Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-1.5">
              <div className="bg-white border border-gray-100 p-4 space-y-3">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600">Shipping Address</h2>
                <div>
                  <label className={LABEL_CLS}>Street Address</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={e => setAddress(a => ({ ...a, street: e.target.value }))}
                    placeholder="123 Main Street, Apt 4B"
                    required
                    className={INPUT_CLS}
                  />
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label className={LABEL_CLS}>City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                      placeholder="Berlin"
                      required
                      className={INPUT_CLS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Postal Code</label>
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={e => setAddress(a => ({ ...a, postalCode: e.target.value }))}
                      placeholder="10115"
                      required
                      className={INPUT_CLS}
                    />
                  </div>
                </div>
                <div>
                  <label className={LABEL_CLS}>Country</label>
                  <select
                    value={address.country}
                    onChange={e => setAddress(a => ({ ...a, country: e.target.value }))}
                    required
                    className={INPUT_CLS}
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
                  <label className={LABEL_CLS}>Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+49 123 456789"
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Order Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Any special instructions..."
                    rows={2}
                    className={`${INPUT_CLS} resize-none`}
                  />
                </div>
              </div>

              <div className="bg-white border border-gray-100 p-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600 mb-3">Payment</h2>
                <div className="flex items-center gap-3 p-3 bg-gray-50 border border-black">
                  <div className="w-3 h-3 rounded-none bg-black flex items-center justify-center">
                    <div className="w-1 h-1 bg-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-black">Credit / Debit Card</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Stripe — Visa, Mastercard, Amex</p>
                  </div>
                </div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-2">You will be redirected to Stripe to complete payment securely.</p>
              </div>

              {error && (
                <div className="border border-rose-600 text-rose-600 px-3 py-2 text-[10px] font-black uppercase tracking-widest">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-rose-600 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-none transition-colors"
              >
                {loading ? 'Processing...' : `Place Order — €${grandTotal.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white border border-gray-100 p-4 sticky top-16">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600 mb-3">Order Summary</h2>
              <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <div className="w-12 h-12 bg-gray-50 flex-shrink-0 border border-gray-100">
                      {item.product.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-black truncate">{item.product.name}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">x{item.quantity}</p>
                    </div>
                    <span className="text-[10px] font-black text-black flex-shrink-0">
                      €{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-700">
                  <span>Subtotal</span>
                  <span className="text-black">€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-700">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-rose-600' : 'text-black'}>{shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Free shipping over €50</p>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-black">Total</span>
                  <span className="text-base font-black text-black">€{grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <Link href="/cart" className="block text-center text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-rose-600 mt-3 transition-colors">
                ← Edit Cart
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
