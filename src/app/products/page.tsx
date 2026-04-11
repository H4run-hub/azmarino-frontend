'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import ProductCard from '../../components/ProductCard';
import { useLang } from '../../context/LanguageContext';
import { SearchIcon } from '../../components/Icons';
import type { Product } from '../../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

function ProductsContent() {
  const { t } = useLang();
  const searchParams = useSearchParams();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const featured = searchParams.get('featured') === 'true';
  const newArrival = searchParams.get('newArrival') === 'true';

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const CATEGORIES = [
    { id: '', label: 'All' },
    { id: 'women-clothing', label: t('categories.women') },
    { id: 'men-clothing', label: t('categories.men') },
    { id: 'shoes', label: t('categories.shoes') },
    { id: 'electronics', label: t('categories.electronics') },
    { id: 'accessories', label: t('categories.accessories') },
    { id: 'beauty', label: t('categories.beauty') },
  ];

  useEffect(() => {
    setSearch(initialSearch);
    setCategory(initialCategory);
  }, [initialCategory, initialSearch]);

  const activeLabel = useMemo(() => {
    if (featured) return 'Featured Collection';
    if (newArrival) return t('newArrivals');
    if (category) return category.replace(/-/g, ' ').toUpperCase();
    if (search) return `"${search}"`;
    return 'All Collection';
  }, [category, featured, newArrival, search, t]);

  const fetchProducts = useCallback(async (reset = false, nextPage = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (category) params.set('category', category);
      if (featured) params.set('featured', 'true');
      if (newArrival) params.set('newArrival', 'true');
      params.set('page', String(nextPage));
      params.set('limit', '16');

      const response = await fetch(`${API_URL}/products?${params.toString()}`);
      const data = await response.json();
      const incoming = data.products || data.data || [];

      setProducts((current) => (reset ? incoming : [...current, ...incoming]));
      setPage(nextPage);
      setHasMore(incoming.length >= 16);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [category, featured, newArrival, search]);

  useEffect(() => {
    fetchProducts(true, 1);
  }, [fetchProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loading) {
          fetchProducts(false, page + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [fetchProducts, hasMore, loading, page]);

  return (
    <main className="section-container py-12">
      
      {/* Header & Filters */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 border-b border-gray-100 pb-8">
          <div>
            <p className="label-caps mb-2 text-gray-400">{t('shop')}</p>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">{activeLabel}</h1>
          </div>
          
          {/* Internal Search */}
          <div className="w-full md:w-80">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('search')}
                className="input-base pl-10 h-12"
              />
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 scrollbar-hide overflow-x-auto pb-2">
          {CATEGORIES.map((item) => (
            <button
              key={item.id || 'all'}
              onClick={() => setCategory(item.id)}
              className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest border transition-all rounded-full ${
                category === item.id
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-gray-200 hover:border-black'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section>
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-300 italic mb-4">No pieces matching your search</p>
            <button onClick={() => {setSearch(''); setCategory('');}} className="btn-black inline-flex">Clear Filters</button>
          </div>
        )}

        <div ref={loaderRef} className="py-20 flex justify-center">
          {loading && products.length > 0 && (
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          )}
          {!hasMore && products.length > 0 && (
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 italic">EndOfCollection</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Suspense fallback={<div className="section-container py-20 flex justify-center"><div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>}>
        <ProductsContent />
      </Suspense>
    </div>
  );
}
