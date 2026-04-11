'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

const INPUT_CLS = "w-full border border-gray-200 rounded-none px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white";
const LABEL_CLS = "block text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1";

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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-2 sm:px-4 lg:px-6 py-6 w-full">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xs font-black uppercase tracking-[0.3em] text-rose-600">Tracking</h1>
          <h2 className="text-2xl font-black text-black uppercase tracking-tighter">Track Order</h2>
          <div className="h-px flex-1 bg-gray-100" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Enter your order number and email to track delivery</p>

        <div className="bg-white border border-gray-100 p-4 mb-2">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className={LABEL_CLS}>Order Number</label>
              <input required value={orderNumber} onChange={e => setOrderNumber(e.target.value)}
                className={INPUT_CLS} placeholder="AZ-123456" />
            </div>
            <div>
              <label className={LABEL_CLS}>Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className={INPUT_CLS} placeholder="you@example.com" />
            </div>
            {error && <div className="border border-rose-600 text-rose-600 text-[10px] font-black uppercase tracking-widest p-2">{error}</div>}
            <button type="submit" disabled={loading} className="w-full bg-black hover:bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-none disabled:opacity-50 transition-colors">
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>
        </div>

        {order && (
          <div className="bg-white border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Order Number</p>
                <p className="text-sm font-black text-black tracking-tight">{order.orderNumber}</p>
              </div>
              <span className="px-2 py-1 text-[9px] font-black uppercase tracking-widest text-rose-600 border border-rose-600">{order.status}</span>
            </div>
            {order.trackingNumber && (
              <div className="bg-gray-50 border border-gray-100 p-3 mb-4">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Tracking Number</p>
                <p className="text-xs font-black text-black tracking-tight">{order.trackingNumber}</p>
              </div>
            )}
            <div className="space-y-1.5">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-[10px] font-bold">
                  <span className="text-gray-700 truncate pr-2">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                  <span className="text-black font-black flex-shrink-0">€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-2 flex justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-black">Total</span>
                <span className="text-sm font-black text-black">€{order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
