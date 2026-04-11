'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import ProductCard from '../../components/ProductCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

interface CartItem { id: string; product: any; quantity: number; selectedSize?: string; selectedColor?: string; selected: boolean; }

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discover, setDiscover] = useState<any[]>([]);
  const [discoverPage, setDiscoverPage] = useState(1);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [hasMoreDiscover, setHasMoreDiscover] = useState(true);
  const loader = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('azmarino_cart') || '[]'));
    const onUpdate = () => setCart(JSON.parse(localStorage.getItem('azmarino_cart') || '[]'));
    window.addEventListener('cart-updated', onUpdate);
    return () => window.removeEventListener('cart-updated', onUpdate);
  }, []);

  const fetchDiscover = async (nextPage: number) => {
    if (discoverLoading || !hasMoreDiscover) return;
    setDiscoverLoading(true);
    try {
      const res = await fetch(`${API_URL}/products?sort=-rating&page=${nextPage}&limit=12`);
      const data = await res.json();
      const items = data.products || data.data || [];
      if (items.length === 0) { setHasMoreDiscover(false); }
      else { setDiscover(prev => [...prev, ...items]); setDiscoverPage(nextPage); }
    } catch { } finally { setDiscoverLoading(false); }
  };

  useEffect(() => { fetchDiscover(1); }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreDiscover && !discoverLoading) {
        fetchDiscover(discoverPage + 1);
      }
    }, { threshold: 0.1 });
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [loader, hasMoreDiscover, discoverLoading, discoverPage]);

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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-2 sm:px-4 lg:px-6 py-6 w-full">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xs font-black uppercase tracking-[0.3em] text-rose-600">Bag</h1>
          <h2 className="text-2xl font-black text-black uppercase tracking-tighter">Shopping Cart</h2>
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{cart.length} Items</span>
        </div>

        {cart.length === 0 ? (
          <div className="border border-gray-100 py-20 flex flex-col items-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Your bag is empty</p>
            <Link href="/products" className="bg-black hover:bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-none transition-colors">
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-1.5">
            <div className="flex-1 space-y-1.5">
              {cart.map(item => (
                <div key={item.id} className="bg-white border border-gray-100 hover:border-black transition-colors p-1.5 flex gap-2">
                  <div className="relative w-20 h-20 bg-gray-50 flex-shrink-0">
                    <Image src={item.product?.image || '/placeholder.jpg'} alt={item.product?.name || ''} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <h3 className="text-xs font-bold text-black line-clamp-2 leading-tight">{item.product?.name}</h3>
                      <div className="flex gap-2 mt-0.5">
                        {item.selectedSize && <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Size: {item.selectedSize}</span>}
                        {item.selectedColor && <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Color: {item.selectedColor}</span>}
                      </div>
                    </div>
                    <p className="text-[13px] font-black text-black">€{item.product?.price?.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between py-0.5">
                    <button onClick={() => remove(item.id)} className="text-gray-300 hover:text-rose-600 text-xs font-black transition-colors" title="Remove">✕</button>
                    <div className="flex items-center border border-gray-200">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-black font-black hover:bg-black hover:text-white transition-colors">−</button>
                      <span className="text-[11px] font-black w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-black font-black hover:bg-black hover:text-white transition-colors">+</button>
                    </div>
                    <p className="text-[10px] font-black text-rose-600">€{((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:w-72">
              <div className="bg-white border border-gray-100 p-4 sticky top-16">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600 mb-3">Summary</h2>
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-700"><span>Subtotal</span><span className="text-black">€{total.toFixed(2)}</span></div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-700"><span>Delivery</span><span className="text-rose-600">Free</span></div>
                  <div className="border-t border-gray-100 pt-2 flex justify-between"><span className="text-[10px] font-black uppercase tracking-widest text-black">Total</span><span className="text-base font-black text-black">€{total.toFixed(2)}</span></div>
                </div>
                <Link href="/checkout" className="block w-full bg-black hover:bg-rose-600 text-white text-center text-[10px] font-black uppercase tracking-widest py-3 rounded-none transition-colors">
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Discover More */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-10 w-full">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-black whitespace-nowrap">Discover More</h2>
          <div className="h-px flex-1 bg-gray-100" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1.5">
          {discover.map((p: any) => <ProductCard key={p._id} product={p} />)}
        </div>
        <div ref={loader} className="py-8 flex justify-center">
          {discoverLoading && <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-none animate-spin" />}
          {!hasMoreDiscover && discover.length > 0 && <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">End of Collection</p>}
        </div>
      </section>
    </div>
  );
}
