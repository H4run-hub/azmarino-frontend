'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import ProductCard from '../../components/ProductCard';
import type { Product } from '../../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

const CATEGORIES = [
  { id: '', label: 'All' },
  { id: 'women-clothing', label: 'Women' },
  { id: 'men-clothing', label: 'Men' },
  { id: 'kids-clothing', label: 'Kids' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'beauty', label: 'Beauty' },
  { id: 'bags', label: 'Bags' },
];

function ProductsContent() {
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

  useEffect(() => {
    setSearch(initialSearch);
    setCategory(initialCategory);
  }, [initialCategory, initialSearch]);

  const activeLabel = useMemo(() => {
    if (featured) return 'Featured selection';
    if (newArrival) return 'New arrivals';
    if (category) return `Category: ${category.replace(/-/g, ' ')}`;
    if (search) return `Search: "${search}"`;
    return 'All products';
  }, [category, featured, newArrival, search]);

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
      { threshold: 0.2 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [fetchProducts, hasMore, loading, page]);

  return (
    <main className="section-shell pb-16">
      <section className="surface-panel rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
        <p className="eyebrow">Catalogue</p>
        <div className="mt-4 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <h1 className="display-title text-5xl text-[var(--ink-strong)] md:text-6xl">
              Discover the full Azmarino product edit.
            </h1>
            <p className="soft-copy mt-4 text-base">
              Search by taste, browse by category, and explore a cleaner global marketplace for fashion, beauty, and technology.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/68 px-5 py-4 text-sm text-[var(--muted)]">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[var(--accent)]">Active filter</p>
            <p className="mt-2 font-semibold text-[var(--ink-strong)]">{activeLabel}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Search</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by product, material, or category"
              className="w-full rounded-full border border-[var(--line)] bg-white px-5 py-4 text-sm text-[var(--ink-strong)] outline-none transition focus:border-[var(--accent)]"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((item) => (
              <button
                key={item.id || 'all'}
                onClick={() => setCategory(item.id)}
                className={`rounded-full px-4 py-3 text-xs font-extrabold uppercase tracking-[0.2em] transition ${
                  category === item.id
                    ? 'bg-[var(--ink-strong)] text-white'
                    : 'border border-[var(--line)] bg-white/66 text-[var(--ink)] hover:border-[rgba(158,36,52,0.25)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10">
        {loading && products.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="surface-solid h-[26rem] animate-pulse rounded-[1.7rem]" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {!products.length && (
              <div className="surface-solid mt-6 rounded-[1.8rem] px-6 py-14 text-center">
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--muted)]">No results</p>
                <p className="mx-auto mt-4 max-w-xl text-base text-[var(--muted)]">
                  Try another search term or remove a category filter to widen the catalogue.
                </p>
              </div>
            )}
          </>
        )}

        <div ref={loaderRef} className="flex justify-center py-10">
          {loading && products.length > 0 ? (
            <div className="h-10 w-10 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
          ) : !hasMore && products.length > 0 ? (
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted)]">No more products in this view.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Suspense fallback={<main className="section-shell py-16" />}>
        <ProductsContent />
      </Suspense>
    </div>
  );
}
