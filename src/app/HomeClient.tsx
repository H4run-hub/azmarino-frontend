'use client';

import Link from 'next/link';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useLang } from '../context/LanguageContext';
import { BotIcon, ReturnIcon, ShieldIcon, ShipIcon } from '../components/Icons';
import type { Product } from '../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

const CATEGORIES = [
  { id: 'women-clothing', key: 'women', note: 'Tailored edits, occasionwear, and elevated staples.' },
  { id: 'men-clothing', key: 'men', note: 'Modern essentials, outerwear, and everyday refinement.' },
  { id: 'shoes', key: 'shoes', note: 'Clean silhouettes for work, travel, and evenings out.' },
  { id: 'electronics', key: 'electronics', note: 'Reliable devices, audio, and premium accessories.' },
  { id: 'accessories', key: 'accessories', note: 'Finishing pieces for gifting, travel, and wardrobe depth.' },
  { id: 'beauty', key: 'beauty', note: 'Skin, care, and self-gifting with a polished point of view.' },
];

const TRUST = [
  { Icon: ShipIcon, key: 'trustDelivery', subKey: 'trustDeliverySub' },
  { Icon: ShieldIcon, key: 'trustPayment', subKey: 'trustPaymentSub' },
  { Icon: ReturnIcon, key: 'trustReturns', subKey: 'trustReturnsSub' },
  { Icon: BotIcon, key: 'trustAI', subKey: 'trustAISub' },
];

const formatCount = (count: number) => `${count}+`;

interface HomeClientProps {
  topRated: Product[];
  newArrivals: Product[];
}

interface ProductFeedResponse {
  products?: Product[];
  data?: Product[];
}

export default function HomeClient({ topRated, newArrivals }: HomeClientProps) {
  const { t } = useLang();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchMore = useEffectEvent(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/products?page=${page + 1}&limit=12`);
      const data = (await response.json()) as ProductFeedResponse;
      const incoming = data.products || data.data || [];
      const knownIds = new Set([
        ...topRated.map((item) => item._id),
        ...newArrivals.map((item) => item._id),
        ...products.map((item) => item._id),
      ]);
      const nextItems = incoming.filter((item) => !knownIds.has(item._id));

      if (incoming.length === 0) {
        setHasMore(false);
      } else {
        setProducts((current) => [...current, ...nextItems]);
        setPage((current) => current + 1);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchMore();
        }
      },
      { threshold: 0.2 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="pb-16">
      <section className="section-shell pt-2">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="surface-panel subtle-grid overflow-hidden rounded-[2rem] px-6 py-8 md:px-10 md:py-12">
            <p className="eyebrow">Curated worldwide</p>
            <div className="mt-6 max-w-3xl">
              <h1 className="display-title section-title text-[var(--ink-strong)] md:max-w-2xl">
                Premium global shopping shaped for modern diaspora life.
              </h1>
              <p className="soft-copy mt-5 max-w-xl text-base md:text-lg">
                Fashion, beauty, and technology brought together in one calm, trusted storefront. Azmarino is built for discovery, gifting, and everyday quality.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="button-primary">
                Explore the collection
              </Link>
              <Link href="/track" className="button-secondary">
                Track an order
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="metric-card">
                <p className="metric-value">{formatCount(1184)}</p>
                <p className="metric-label">Curated products</p>
              </div>
              <div className="metric-card">
                <p className="metric-value">48h</p>
                <p className="metric-label">Fast dispatch target</p>
              </div>
              <div className="metric-card">
                <p className="metric-value">30d</p>
                <p className="metric-label">Returns window</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="surface-solid rounded-[2rem] p-6 md:p-8">
              <p className="eyebrow">Why Azmarino</p>
              <h2 className="display-title mt-4 text-3xl text-[var(--ink-strong)]">Professional service without the noise.</h2>
              <p className="soft-copy mt-4 text-sm">
                Every touchpoint is designed to feel clear, premium, and dependable: strong product curation, transparent delivery, and support that is easy to reach.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {TRUST.map(({ Icon, key, subKey }) => (
                <div key={key} className="surface-solid rounded-[1.6rem] p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-bold text-[var(--ink-strong)]">{t(key)}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">{t(subKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Collections</p>
            <h2 className="display-title mt-3 text-4xl text-[var(--ink-strong)]">Browse by category</h2>
          </div>
          <Link href="/products" className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
            View all
          </Link>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CATEGORIES.map((category, index) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="surface-solid group rounded-[1.9rem] p-6 transition duration-300 hover:-translate-y-1 hover:border-[rgba(158,36,52,0.22)]"
            >
              <div className="flex items-center justify-between">
                <span className="display-title text-3xl text-[var(--ink-strong)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="rounded-full border border-[var(--line)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[var(--muted)]">
                  {t(`categories.${category.key}`)}
                </span>
              </div>
              <p className="mt-10 text-lg font-semibold text-[var(--ink-strong)]">{category.note}</p>
              <p className="mt-10 text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
                Shop {t(`categories.${category.key}`)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-shell mt-16">
        <div className="grid gap-12 xl:grid-cols-2">
          <div>
            <p className="eyebrow">Top rated</p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <h2 className="display-title text-4xl text-[var(--ink-strong)]">Best-performing picks</h2>
              <Link href="/products" className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
                Shop all
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {topRated.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">New arrivals</p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <h2 className="display-title text-4xl text-[var(--ink-strong)]">Fresh additions this week</h2>
              <Link href="/products?newArrival=true" className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
                New now
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-16">
        <div className="surface-solid rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            <div>
              <p className="eyebrow">Editorial note</p>
              <h2 className="display-title mt-4 text-4xl text-[var(--ink-strong)]">
                A marketplace that feels considered, not crowded.
              </h2>
              <p className="soft-copy mt-4 max-w-xl">
                We are building Azmarino around trust, clarity, and premium taste. That means strong catalog curation, dependable support, and a calmer path from discovery to checkout.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.6rem] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
                <p className="text-sm font-bold text-[var(--ink-strong)]">Support that stays close</p>
                <p className="mt-2 text-sm text-[var(--muted)]">Track orders, review history, and reach the Sara assistant without leaving the storefront.</p>
              </div>
              <div className="rounded-[1.6rem] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
                <p className="text-sm font-bold text-[var(--ink-strong)]">Premium checkout flow</p>
                <p className="mt-2 text-sm text-[var(--muted)]">Clear order summaries, Stripe-backed payments, and delivery details that are easy to trust.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">More to discover</p>
            <h2 className="display-title mt-3 text-4xl text-[var(--ink-strong)]">Expanded catalogue</h2>
          </div>
          <p className="text-sm text-[var(--muted)]">Freshly loaded from the live product feed.</p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div ref={loaderRef} className="flex justify-center py-10">
          {loading ? (
            <div className="h-10 w-10 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
          ) : !hasMore ? (
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--muted)]">You have reached the end of the current catalogue.</p>
          ) : null}
        </div>
      </section>

      <footer className="section-shell mt-16">
        <div className="surface-solid rounded-[2rem] px-6 py-8 md:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow">Azmarino</p>
              <p className="display-title mt-3 text-3xl text-[var(--ink-strong)]">Global shopping with a steadier point of view.</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm font-semibold text-[var(--muted)]">
              <Link href="/products">Shop</Link>
              <Link href="/track">Track</Link>
              <Link href="/orders">Orders</Link>
              <a href="mailto:support@azmarino.online">support@azmarino.online</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
