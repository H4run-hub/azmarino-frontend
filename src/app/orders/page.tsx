'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('azmarino_token');
    if (!token) { window.location.href = '/auth/login'; return; }
    fetch(`${API_URL}/orders/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setOrders(d.orders || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full">
        <h1 className="text-2xl font-black text-slate-800 mb-6">My Orders</h1>
        {loading ? (
          <div className="space-y-4">
            {Array.from({length:3}).map((_,i) => <div key={i} className="bg-white rounded-2xl p-4 animate-pulse h-24 border border-slate-100" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-slate-500 mb-6">No orders yet</p>
            <Link href="/products" className="bg-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-rose-700 transition-colors">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order._id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-slate-400">Order Number</p>
                    <p className="font-bold text-slate-800">{order.orderNumber}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold text-blue-600 bg-blue-50 capitalize">{order.status}</span>
                </div>
                <div className="text-sm text-slate-600 mb-3">
                  {order.items?.slice(0,2).map((item: any, idx: number) => (
                    <span key={idx}>{item.name}{idx < Math.min(order.items.length,2)-1 ? ', ' : ''}</span>
                  ))}
                  {order.items?.length > 2 && <span className="text-slate-400"> +{order.items.length-2} more</span>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-rose-600">EUR {order.total?.toFixed(2)}</span>
                  <span className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
