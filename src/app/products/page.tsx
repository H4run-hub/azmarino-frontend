'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import ProductCard from '../../components/ProductCard';
import type { Product } from '../../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

const CATEGORIES = [
  { id: '', label: 'All' },
  { id: 'men-clothing', label: "Men's" },
  { id: 'women-clothing', label: "Women's" },
  { id: 'kids-clothing', label: 'Kids' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'beauty', label: 'Beauty' },
  { id: 'bags', label: 'Bags' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement>(null);

  const fetchProducts = useCallback(async (reset = false, nextPage?: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      params.set('page', reset ? '1' : String(nextPage ?? page));
      params.set('limit', '24');
      if (searchParams.get('featured')) params.set('featured', 'true');
      if (searchParams.get('newArrival')) params.set('newArrival', 'true');

      const res = await fetch(`${API_URL}/products?${params}`);
      const data = await res.json();
      const items = data.products || data.data || [];
      if (reset) {
        setProducts(items);
        setPage(1);
      } else {
        setProducts(prev => [...prev, ...items]);
        setPage(nextPage ?? page);
      }
      setHasMore(items.length >= 24);
    } catch { } finally { setLoading(false); }
  }, [search, category, page, searchParams]);

  // Reset on filter change
  useEffect(() => { fetchProducts(true); }, [search, category]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchProducts(false, page + 1);
      }
    }, { threshold: 0.1 });
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [loader, hasMore, loading, page, fetchProducts]);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-6 w-full">
      {/* Search + Filters */}
      <div className="mb-4">
        <input
          type="text" placeholder="Search products..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
        />
      </div>
      <div className="flex gap-1.5 flex-wrap mb-6 overflow-x-auto">
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCategory(c.id)}
            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap ${category === c.id ? 'bg-black text-white' : 'border border-gray-200 text-gray-700 hover:border-black'}`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading && products.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white overflow-hidden border border-gray-100 animate-pulse">
              <div className="aspect-[3/4] bg-gray-100" />
              <div className="p-2 space-y-1.5"><div className="h-2.5 bg-gray-100 rounded w-1/2" /><div className="h-3 bg-gray-100 rounded" /></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1.5">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
          {products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No products found.</p>
            </div>
          )}
        </>
      )}

      {/* Infinite scroll trigger */}
      <div ref={loader} className="py-10 flex justify-center">
        {loading && products.length > 0 && (
          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
        )}
        {!hasMore && products.length > 0 && (
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">End of Collection</p>
        )}
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
                <div className="aspect-square bg-slate-200" />
                <div className="p-3 space-y-2"><div className="h-3 bg-slate-200 rounded w-1/2" /><div className="h-4 bg-slate-200 rounded" /></div>
              </div>
            ))}
          </div>
        </main>
      }>
        <ProductsContent />
      </Suspense>
    </div>
  );
}
