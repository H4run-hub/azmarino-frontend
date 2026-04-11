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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 py-6 w-full">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xs font-black uppercase tracking-[0.3em] text-rose-600">Account</h1>
          <h2 className="text-2xl font-black text-black uppercase tracking-tighter">My Orders</h2>
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{orders.length} Orders</span>
        </div>

        {loading ? (
          <div className="space-y-1.5">
            {Array.from({length:3}).map((_,i) => <div key={i} className="border border-gray-100 p-4 animate-pulse h-24 bg-gray-50" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="border border-gray-100 py-20 flex flex-col items-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">No orders yet</p>
            <Link href="/products" className="bg-black hover:bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-none transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-1.5">
            {orders.map((order: any) => (
              <div key={order._id} className="bg-white border border-gray-100 hover:border-black transition-colors p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Order Number</p>
                    <p className="text-xs font-black text-black tracking-tight">{order.orderNumber}</p>
                  </div>
                  <span className="px-2 py-1 text-[9px] font-black uppercase tracking-widest text-rose-600 border border-rose-600">
                    {order.status}
                  </span>
                </div>
                <div className="text-[10px] font-bold text-gray-600 mb-3 line-clamp-1">
                  {order.items?.slice(0,2).map((item: any, idx: number) => (
                    <span key={idx}>{item.name}{idx < Math.min(order.items.length,2)-1 ? ' • ' : ''}</span>
                  ))}
                  {order.items?.length > 2 && <span className="text-gray-400"> +{order.items.length-2} more</span>}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className="text-sm font-black text-black">€{order.total?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
