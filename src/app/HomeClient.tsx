'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import { ShipIcon, ShieldIcon, ReturnIcon, BotIcon } from '../components/Icons';

const CATEGORIES = [
  { id: 'women-clothing', label: 'Women' },
  { id: 'men-clothing', label: 'Men' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'beauty', label: 'Beauty' },
];

const TRUST = [
  { Icon: ShipIcon, label: 'Free EU Delivery' },
  { Icon: ShieldIcon, label: 'Secure Payment' },
  { Icon: ReturnIcon, label: '30-Day Returns' },
  { Icon: BotIcon, label: 'AI Support 24/7' },
];

export default function HomeClient({ topRated, newArrivals }: { topRated: any[]; newArrivals: any[] }) {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  const fetchMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api'}/products?page=${page + 1}&limit=12`);
      const data = await res.json();
      const newItems = data.products || data.data || [];
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prev => [...prev, ...newItems]);
        setPage(p => p + 1);
      }
    } catch (err) {
      console.error('Failed to fetch more products:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMore();
        }
      },
      { threshold: 0.1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [loader, hasMore, page, loading]);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#050505] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-black leading-[0.95] mb-4 tracking-tighter">
              GLOBAL <span className="text-rose-500">PREMIUM</span><br />SHOPPING.
            </h1>
            <p className="text-gray-400 text-sm md:text-base mb-6 max-w-lg mx-auto md:mx-0 font-medium">
              Experience the next generation of e-commerce. Curated global fashion, elite electronics, and worldwide delivery.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <Link href="/products"
                className="bg-white text-black font-black px-8 py-3 rounded-none transition-all hover:bg-rose-500 hover:text-white uppercase text-xs tracking-widest">
                Explore Collection
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md aspect-square bg-gradient-to-br from-rose-500/20 to-transparent border border-white/5 flex items-center justify-center relative group">
             <div className="absolute inset-4 border border-white/10 group-hover:border-rose-500/50 transition-colors" />
             <img src="/logo.jpg" alt="Azmarino" className="w-48 h-auto object-contain drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST.map(({ Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-2">
                <Icon className="w-4 h-4 text-rose-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center mb-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-rose-600 mb-1">Collections</h2>
          <h3 className="text-2xl font-black text-black uppercase tracking-tighter">Shop by Category</h3>
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5">
            {CATEGORIES.map(cat => (
              <Link key={cat.id} href={`/products?category=${cat.id}`}
                className="group relative aspect-[4/5] overflow-hidden bg-gray-100 flex flex-col items-center justify-center border border-gray-100 hover:border-black transition-all">
                <p className="text-black font-black text-[10px] uppercase tracking-widest group-hover:text-rose-600 transition-colors">
                  {cat.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Infinite Product Grid */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 mb-6 flex items-center justify-between">
            <h2 className="text-xl font-black text-black tracking-tighter uppercase">Recommended for You</h2>
            <div className="h-px flex-1 bg-gray-100 mx-4" />
        </div>

        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1.5">
            {topRated.map((p: any) => <ProductCard key={p._id} product={p} />)}
            {newArrivals.map((p: any) => <ProductCard key={p._id} product={p} />)}
            {products.map((p: any) => <ProductCard key={p._id} product={p} />)}
          </div>

          {/* Loader */}
          <div ref={loader} className="py-10 flex justify-center w-full">
            {loading && (
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-none animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading...</span>
              </div>
            )}
            {!hasMore && (
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">End of Collection</span>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
            <div className="relative w-40 h-10 mb-8 opacity-80">
              <img src="/logo.jpg" alt="Azmarino" className="w-full h-full object-contain grayscale invert" />
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-8">
                <Link href="/products" className="hover:text-rose-500 transition-colors">Shop</Link>
                <Link href="/track" className="hover:text-rose-500 transition-colors">Track</Link>
                <Link href="/orders" className="hover:text-rose-500 transition-colors">Orders</Link>
                <a href="mailto:support@azmarino.online" className="hover:text-rose-500 transition-colors">Support</a>
            </div>
            <p className="text-[9px] text-gray-600 font-medium tracking-widest">© {new Date().getFullYear()} AZMARINO PREMIUM. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}
