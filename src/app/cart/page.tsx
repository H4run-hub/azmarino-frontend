'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../components/Navbar';

interface CartItem { id: string; product: any; quantity: number; selectedSize?: string; selectedColor?: string; selected: boolean; }

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('azmarino_cart') || '[]'));
    const onUpdate = () => setCart(JSON.parse(localStorage.getItem('azmarino_cart') || '[]'));
    window.addEventListener('cart-updated', onUpdate);
    return () => window.removeEventListener('cart-updated', onUpdate);
  }, []);

  const save = (updated: CartItem[]) => {
    localStorage.setItem('azmarino_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
    setCart(updated);
  };

  const updateQty = (id: string, delta: number) => {
    const updated = cart.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i);
    save(updated);
  };

  const remove = (id: string) => save(cart.filter(i => i.id !== id));

  const total = cart.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-2xl font-black text-slate-800 mb-6">Shopping Cart</h1>
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-slate-500 mb-6">Your cart is empty</p>
            <Link href="/products" className="bg-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-rose-700 transition-colors">Browse Products</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-3">
              {cart.map(item => (
                <div key={item.id} className="bg-white rounded-2xl p-4 flex gap-4 border border-slate-100 shadow-sm">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <Image src={item.product?.image || '/placeholder.jpg'} alt={item.product?.name || ''} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 text-sm line-clamp-2">{item.product?.name}</h3>
                    {item.selectedSize && <p className="text-xs text-slate-400">Size: {item.selectedSize}</p>}
                    {item.selectedColor && <p className="text-xs text-slate-400">Color: {item.selectedColor}</p>}
                    <p className="text-rose-600 font-bold mt-1">€{item.product?.price?.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => remove(item.id)} className="text-slate-400 hover:text-red-500 text-xs">✕</button>
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-2 py-1">
                      <button onClick={() => updateQty(item.id, -1)} className="text-slate-600 font-bold w-5 text-center">−</button>
                      <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="text-slate-600 font-bold w-5 text-center">+</button>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">€{((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:w-72">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm sticky top-20">
                <h2 className="font-black text-slate-800 text-lg mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-slate-600"><span>Subtotal</span><span>€{total.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm text-slate-600"><span>Delivery</span><span className="text-green-600 font-semibold">FREE</span></div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-slate-800"><span>Total</span><span className="text-rose-600">€{total.toFixed(2)}</span></div>
                </div>
                <Link href="/checkout" className="block w-full bg-rose-600 text-white text-center font-bold py-3 rounded-xl hover:bg-rose-700 transition-colors">
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
