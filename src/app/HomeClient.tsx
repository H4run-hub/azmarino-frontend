'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useLang } from '../context/LanguageContext';
import { BotIcon, ReturnIcon, ShieldIcon, ShipIcon } from '../components/Icons';
import type { Product } from '../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

const CATEGORIES = [
  { id: 'women-clothing', key: 'women', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800' },
  { id: 'men-clothing', key: 'men', img: 'https://images.unsplash.com/photo-1490578474895-6a9c96883ce4?auto=format&fit=crop&q=80&w=800' },
  { id: 'shoes', key: 'shoes', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' },
  { id: 'electronics', key: 'electronics', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800' },
  { id: 'accessories', key: 'accessories', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800' },
  { id: 'beauty', key: 'beauty', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800' },
];

const TRUST = [
  { Icon: ShipIcon, key: 'trustDelivery' },
  { Icon: ShieldIcon, key: 'trustPayment' },
  { Icon: ReturnIcon, key: 'trustReturns' },
  { Icon: BotIcon, key: 'trustAI' },
];

export default function HomeClient({ topRated, newArrivals }: { topRated: Product[]; newArrivals: Product[] }) {
  const { t } = useLang();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products?page=${page + 1}&limit=12`);
      const data = await res.json();
      const incoming = data.products || data.data || [];
      if (incoming.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prev => [...prev, ...incoming]);
        setPage(p => p + 1);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting && hasMore) fetchMore();
    }, { threshold: 0.1 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, page, loading]);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden bg-black flex items-center">
        <div className="absolute inset-0 opacity-60">
           <img 
             src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" 
             className="w-full h-full object-cover"
             alt="Hero"
           />
        </div>
        <div className="section-container relative z-10 text-white">
          <div className="max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-white/80">{t('trending')}</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-6">
              {t('heroTitle')}
            </h1>
            <p className="text-sm md:text-lg text-white/70 font-medium mb-8 max-w-lg leading-relaxed">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="btn-black bg-white text-black hover:bg-gray-100">
                {t('exploreBtn')}
              </Link>
              <Link href="/track" className="btn-outline bg-transparent text-white border-white hover:bg-white/10">
                {t('trackBtn')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-b border-gray-100 bg-gray-50/50 py-10">
        <div className="section-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {TRUST.map(({ Icon, key }) => (
              <div key={key} className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-black mb-4 group-hover:bg-black group-hover:text-white transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-black">{t(key)}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">{t(`${key}Sub`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20">
        <div className="section-container">
          <div className="flex flex-col items-center mb-12">
            <p className="label-caps mb-2">{t('shop')}</p>
            <h2 className="heading-lg text-center">{t('categoriesTitle')}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(cat => (
              <Link key={cat.id} href={`/products?category=${cat.id}`} className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-gray-100">
                <img src={cat.img} alt={cat.key} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-end p-4">
                  <p className="text-white text-[10px] font-black uppercase tracking-widest">{t(`categories.${cat.key}`)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated & New Arrivals Combined Grid */}
      <section className="py-20 bg-gray-50/30">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Top Rated */}
            <div>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="label-caps mb-1">{t('trending')}</p>
                  <h2 className="heading-lg">{t('topRated')}</h2>
                </div>
                <Link href="/products" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">
                  {t('discoverMore')} →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {topRated.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>

            {/* New Arrivals */}
            <div>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="label-caps mb-1">{t('trending')}</p>
                  <h2 className="heading-lg">{t('newArrivals')}</h2>
                </div>
                <Link href="/products?newArrival=true" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">
                  {t('discoverMore')} →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {newArrivals.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Product Grid */}
      <section className="py-24 border-t border-gray-100">
        <div className="section-container">
          <div className="flex flex-col items-center mb-16">
            <p className="label-caps mb-2">{t('discoverMore')}</p>
            <h2 className="heading-lg">{t('heroTitle')}</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>

          <div ref={loaderRef} className="py-20 flex flex-col items-center gap-4">
            {loading ? (
              <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : !hasMore ? (
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 italic">
                {t('endOfCollection')}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-24">
        <div className="section-container">
          <div className="flex flex-col md:flex-row justify-between gap-16">
            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="relative w-12 h-12 overflow-hidden rounded-xl bg-white p-1">
                  <img src="/logo.jpg" alt="Azmarino" className="w-full h-full object-contain" />
                </div>
                <p className="text-xl font-black uppercase tracking-tighter italic">Azmarino</p>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                {t('footerDesc')}
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div className="flex flex-col gap-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('navigation')}</p>
                <Link href="/products" className="text-xs font-bold uppercase tracking-widest hover:text-white transition-colors text-gray-400">{t('shop')}</Link>
                <Link href="/track" className="text-xs font-bold uppercase tracking-widest hover:text-white transition-colors text-gray-400">{t('track')}</Link>
                <Link href="/orders" className="text-xs font-bold uppercase tracking-widest hover:text-white transition-colors text-gray-400">{t('orders')}</Link>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('support')}</p>
                <a href="mailto:support@azmarino.online" className="text-xs font-bold uppercase tracking-widest hover:text-white transition-colors text-gray-400">{t('email')}</a>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 cursor-default">{t('helpCenter')}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 cursor-default">{t('returns')}</span>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">© {new Date().getFullYear()} Azmarino Premium Global. {t('allRightsReserved')}</p>
            <div className="flex gap-6 opacity-30 grayscale invert brightness-0">
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
