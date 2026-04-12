'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import { ShipIcon, ShieldIcon, ReturnIcon, BotIcon } from '../components/Icons';
import { useT } from '../i18n/LanguageProvider';
import type { Product } from '../lib/api';

const CATEGORIES = [
  { id: 'women-clothing', key: 'cat.women', tone: 'from-rose-500 to-rose-700' },
  { id: 'men-clothing', key: 'cat.men', tone: 'from-zinc-700 to-black' },
  { id: 'shoes', key: 'cat.shoes', tone: 'from-amber-500 to-rose-600' },
  { id: 'electronics', key: 'cat.electronics', tone: 'from-sky-600 to-indigo-900' },
  { id: 'accessories', key: 'cat.accessories', tone: 'from-emerald-600 to-teal-900' },
  { id: 'beauty', key: 'cat.beauty', tone: 'from-fuchsia-500 to-rose-700' },
];

const STATS = [
  { value: '85+', key: 'stats.countries' },
  { value: '12K+', key: 'stats.products' },
  { value: '250K+', key: 'stats.customers' },
  { value: '4.9★', key: 'stats.rating' },
];

const TRUST = [
  { Icon: ShipIcon, key: 'trust.delivery' },
  { Icon: ShieldIcon, key: 'trust.secure' },
  { Icon: ReturnIcon, key: 'trust.returns' },
  { Icon: BotIcon, key: 'trust.support' },
];

export default function HomeClient({
  topRated,
  newArrivals,
}: {
  topRated: Product[];
  newArrivals: Product[];
}) {
  const { t } = useT();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement>(null);

  const fetchMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api'}/products?page=${page + 1}&limit=12`,
      );
      const data = await res.json();
      const newItems = data.products || data.data || [];
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => [...prev, ...newItems]);
        setPage((p) => p + 1);
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
        if (entries[0].isIntersecting && hasMore) fetchMore();
      },
      { threshold: 0.1 },
    );
    const el = loader.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, page, loading]);

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7f0f0f] via-[#b91c1c] to-[#450a0a] text-white">
        {/* starfield */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* glowing halos */}
        <div className="absolute -top-20 -left-20 w-[420px] h-[420px] bg-rose-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-20 w-[520px] h-[520px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          {/* left copy */}
          <div className="relative text-center md:text-start">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-rose-300 rounded-none animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('hero.eyebrow')}</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.9] tracking-tighter mb-6">
              <span className="block">{t('hero.title1')}</span>
              <span className="block text-rose-200">{t('hero.title2')}</span>
              <span className="block italic font-serif bg-gradient-to-r from-amber-200 to-rose-100 bg-clip-text text-transparent">
                {t('hero.title3')}
              </span>
            </h1>

            <p className="text-rose-100/80 text-sm md:text-base mb-8 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <Link
                href="/products"
                className="bg-white text-black font-black px-8 py-3.5 rounded-none transition-all hover:bg-rose-200 uppercase text-[11px] tracking-[0.25em] shadow-[6px_6px_0_0_rgba(0,0,0,0.35)] hover:shadow-[3px_3px_0_0_rgba(0,0,0,0.35)] hover:translate-x-[3px] hover:translate-y-[3px]"
              >
                {t('hero.ctaPrimary')}
              </Link>
              <Link
                href="/products?newArrival=true"
                className="border border-white/40 text-white font-black px-8 py-3.5 rounded-none hover:bg-white hover:text-black uppercase text-[11px] tracking-[0.25em] transition-all"
              >
                {t('hero.ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

          {/* right logo display */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-radial from-amber-300/20 to-transparent blur-2xl" />
            <div className="relative w-full max-w-sm aspect-square">
              <div className="absolute inset-0 border border-white/15" />
              <div className="absolute inset-3 border border-white/10" />
              <div className="absolute inset-6 border border-amber-300/20" />
              <div className="absolute inset-0 flex items-center justify-center p-10">
                <img
                  src="/logo.svg"
                  alt="Azmarino"
                  className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                />
              </div>
              {/* corner marks */}
              <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-300" />
              <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-300" />
              <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-300" />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-300" />
            </div>
          </div>
        </div>

        {/* Stats band */}
        <div className="relative border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.key} className="text-center md:text-start">
                <div className="text-2xl md:text-3xl font-black text-white tracking-tighter">{s.value}</div>
                <div className="text-[9px] font-black uppercase tracking-[0.25em] text-rose-200/70 mt-1">
                  {t(s.key)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-5 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST.map(({ Icon, key }) => (
              <div
                key={key}
                className="flex items-center justify-center md:justify-start gap-3 px-3 py-2 border border-transparent hover:border-gray-200 transition-colors"
              >
                <span className="flex items-center justify-center w-8 h-8 bg-rose-50 text-rose-600 border border-rose-100">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">{t(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-rose-600 mb-2">
              {t('categories.eyebrow')}
            </h2>
            <h3 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tighter">
              {t('categories.title')}
            </h3>
          </div>
          <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent mx-6" />
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className={`group relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${cat.tone} flex flex-col justify-end p-5 border border-black/10 hover:border-black transition-all`}
              >
                <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '16px 16px',
                  }}
                />
                <div className="relative">
                  <p className="text-white/70 text-[9px] font-black uppercase tracking-[0.3em] mb-1">
                    {t('categories.eyebrow')}
                  </p>
                  <p className="text-white font-black text-xl md:text-2xl uppercase tracking-tighter">
                    {t(cat.key)}
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/90 group-hover:text-white">
                    {t('hero.ctaPrimary')}
                    <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top rated strip */}
      {topRated.length > 0 && (
        <section className="py-10 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 mb-5 flex items-end justify-between">
            <h2 className="text-xl md:text-2xl font-black text-black tracking-tighter uppercase">
              {t('section.topRated')}
            </h2>
            <Link
              href="/products"
              className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-rose-600"
            >
              {t('hero.ctaPrimary')} →
            </Link>
          </div>
          <div className="max-w-7xl mx-auto px-2 sm:px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
              {topRated.slice(0, 12).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Editorial promo */}
      <section className="py-16 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-rose-400 mb-4">
              {t('promo.eyebrow')}
            </p>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-5">
              {t('promo.title')}
            </h3>
            <p className="text-gray-300 text-sm max-w-lg mb-7 leading-relaxed">{t('promo.body')}</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-white hover:text-black text-white font-black px-7 py-3.5 uppercase text-[11px] tracking-[0.25em] transition-colors"
            >
              {t('promo.cta')} →
            </Link>
          </div>
          <div className="relative aspect-square max-w-sm mx-auto w-full">
            <div className="absolute inset-0 border border-white/10" />
            <div className="absolute inset-4 border border-rose-500/30" />
            <div className="absolute inset-0 flex items-center justify-center p-10">
              <img src="/logo.svg" alt="Azmarino" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 mb-5 flex items-end justify-between">
            <h2 className="text-xl md:text-2xl font-black text-black tracking-tighter uppercase">
              {t('section.newArrivals')}
            </h2>
            <Link
              href="/products?newArrival=true"
              className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-rose-600"
            >
              {t('hero.ctaPrimary')} →
            </Link>
          </div>
          <div className="max-w-7xl mx-auto px-2 sm:px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
              {newArrivals.slice(0, 12).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Infinite recommended grid */}
      <section className="py-10 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 mb-5 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-black text-black tracking-tighter uppercase">
            {t('section.recommended')}
          </h2>
          <div className="h-px flex-1 bg-gray-200 mx-4" />
        </div>

        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          <div ref={loader} className="py-12 flex justify-center w-full">
            {loading && (
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-none animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {t('product.loading')}
                </span>
              </div>
            )}
            {!hasMore && (
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                {t('product.endOfCollection')}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter strip */}
      <section className="py-14 bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-rose-200 mb-3">
            {t('footer.newsletter')}
          </p>
          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-3">
            {t('promo.title')}
          </h3>
          <p className="text-rose-100/80 text-sm mb-6">{t('footer.newsletterSubtitle')}</p>
          <form
            className="flex max-w-md mx-auto gap-2"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              type="email"
              placeholder={t('footer.emailPlaceholder')}
              className="flex-1 px-4 py-3 bg-white text-black text-xs font-bold rounded-none placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-none hover:bg-white hover:text-black transition-colors"
            >
              {t('footer.subscribe')}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white pt-16 pb-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.svg" alt="Azmarino" className="w-12 h-12" />
              <div>
                <div className="text-xl font-black tracking-tight">Azmarino</div>
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-400">
                  {t('footer.tagline')}
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-xs max-w-md leading-relaxed">{t('promo.body')}</p>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-400 mb-4">
              {t('footer.shop')}
            </h4>
            <ul className="space-y-2.5 text-[11px] font-bold text-gray-400">
              <li>
                <Link href="/products" className="hover:text-white">
                  {t('nav.shop')}
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white">
                  {t('footer.track')}
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white">
                  {t('footer.orders')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-400 mb-4">
              {t('footer.support')}
            </h4>
            <ul className="space-y-2.5 text-[11px] font-bold text-gray-400">
              <li>
                <a href="mailto:support@azmarino.online" className="hover:text-white">
                  support@azmarino.online
                </a>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white">
                  {t('nav.profile')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-gray-600 font-bold tracking-widest uppercase">
            © {new Date().getFullYear()} Azmarino Premium. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <span>EN · ትግርኛ · አማርኛ · العربية · FR · IT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
