'use client';

import { useEffect, useState, useCallback } from 'react';
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

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      params.set('page', reset ? '1' : String(page));
      params.set('limit', '24');
      if (searchParams.get('featured')) params.set('featured', 'true');
      if (searchParams.get('newArrival')) params.set('newArrival', 'true');

      const res = await fetch(`${API_URL}/products?${params}`);
      const data = await res.json();
      const items = data.products || data.data || [];
      if (reset) { setProducts(items); setPage(1); } else { setProducts(prev => [...prev, ...items]); }
      setHasMore(items.length >= 24);
    } catch { } finally { setLoading(false); }
  }, [search, category, page, searchParams]);

  useEffect(() => { fetchProducts(true); }, [search, category]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text" placeholder="Search products..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === c.id ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-rose-50'}`}>
              {c.label}
            </button>
          ))}
        </div>
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
                <div className="aspect-square bg-slate-200" />
                <div className="p-3 space-y-2"><div className="h-3 bg-slate-200 rounded w-1/2" /><div className="h-4 bg-slate-200 rounded" /><div className="h-4 bg-slate-200 rounded w-3/4" /></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
            {products.length === 0 && <div className="text-center py-20 text-slate-500">No products found.</div>}
            {hasMore && !loading && (
              <div className="text-center mt-8">
                <button onClick={() => { setPage(p => p + 1); fetchProducts(); }}
                  className="bg-rose-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-rose-700 transition-colors">
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
