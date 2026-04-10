'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setOrder(null);
    try {
      const res = await fetch(`${API_URL}/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order not found');
      setOrder(data.order);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-12 w-full">
        <h1 className="text-2xl font-black text-slate-800 mb-2">Track Your Order</h1>
        <p className="text-slate-500 text-sm mb-8">Enter your order number and email to track your delivery</p>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Order Number</label>
              <input required value={orderNumber} onChange={e => setOrderNumber(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="AZ-123456" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="you@example.com" />
            </div>
            {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl">{error}</div>}
            <button type="submit" disabled={loading} className="w-full bg-rose-600 text-white font-bold py-3 rounded-xl hover:bg-rose-700 disabled:opacity-50 transition-colors">
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>
        </div>
        {order && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400">Order Number</p>
                <p className="font-black text-slate-800 text-lg">{order.orderNumber}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-semibold text-blue-600 bg-blue-50">{order.status}</span>
            </div>
            {order.trackingNumber && (
              <div className="bg-slate-50 rounded-xl p-3 mb-4">
                <p className="text-xs text-slate-400 mb-1">Tracking Number</p>
                <p className="font-bold text-slate-800">{order.trackingNumber}</p>
              </div>
            )}
            <div className="space-y-2">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-slate-700">{item.name} x{item.quantity}</span>
                  <span className="font-semibold text-slate-800">EUR {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-rose-600">EUR {order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
