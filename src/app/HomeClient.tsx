'use client';

import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import { useLang } from '../context/LanguageContext';
import { ShipIcon, ShieldIcon, ReturnIcon, BotIcon } from '../components/Icons';

const CATEGORIES = [
  { id: 'women-clothing', key: 'women', color: 'from-rose-400 to-rose-600', pattern: '👗' },
  { id: 'men-clothing', key: 'men', color: 'from-slate-600 to-slate-800', pattern: '👔' },
  { id: 'shoes', key: 'shoes', color: 'from-amber-400 to-orange-500', pattern: '👟' },
  { id: 'electronics', key: 'electronics', color: 'from-blue-500 to-indigo-600', pattern: '📱' },
  { id: 'accessories', key: 'accessories', color: 'from-purple-400 to-purple-600', pattern: '✨' },
  { id: 'beauty', key: 'beauty', color: 'from-pink-400 to-pink-600', pattern: '💄' },
];

const TRUST = [
  { Icon: ShipIcon, key: 'trustDelivery', subKey: 'trustDeliverySub', color: 'text-rose-600', bg: 'bg-rose-50' },
  { Icon: ShieldIcon, key: 'trustPayment', subKey: 'trustPaymentSub', color: 'text-blue-600', bg: 'bg-blue-50' },
  { Icon: ReturnIcon, key: 'trustReturns', subKey: 'trustReturnsSub', color: 'text-green-600', bg: 'bg-green-50' },
  { Icon: BotIcon, key: 'trustAI', subKey: 'trustAISub', color: 'text-purple-600', bg: 'bg-purple-50' },
];

export default function HomeClient({ topRated, newArrivals }: { topRated: any[]; newArrivals: any[] }) {
  const { t } = useLang();

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0a0a0a] text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-rose-900/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1.5 rounded-full mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">ኣዝማሪኖ · Azmarino</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] mb-4">
              {t('heroTitle1')}{' '}
              <span className="text-rose-400">{t('heroHighlight')}</span><br />
              {t('heroTitle2')}
            </h1>
            <p className="text-gray-400 text-base md:text-lg mb-7 leading-relaxed">{t('heroSub')}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products"
                className="bg-rose-600 hover:bg-rose-700 text-white font-black px-7 py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-sm">
                {t('shopNow')}
              </Link>
              <Link href="/track"
                className="border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
                {t('trackOrder')}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
              {[t('freeDelivery'), t('returns'), t('securePayments')].map(s => (
                <span key={s} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-rose-500" />{s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] mb-0.5">{t('browse')}</p>
              <h2 className="text-xl md:text-2xl font-black text-gray-900">{t('shopByCategory')}</h2>
            </div>
            <Link href="/products" className="text-xs font-bold text-gray-400 hover:text-rose-600 transition-colors">{t('viewAll')}</Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5">
            {CATEGORIES.map(cat => (
              <Link key={cat.id} href={`/products?category=${cat.id}`}
                className={`group relative rounded-2xl overflow-hidden bg-gradient-to-br ${cat.color} aspect-square flex flex-col items-center justify-center hover:scale-[1.03] transition-transform duration-300 cursor-pointer`}>
                <span className="text-3xl mb-1 drop-shadow group-hover:scale-110 transition-transform duration-300">
                  {cat.pattern}
                </span>
                <p className="text-white font-black text-xs text-center leading-tight drop-shadow">
                  {t(`categories.${cat.key}`)}
                </p>
                <p className="text-white/70 text-[10px] text-center">
                  {t(`catSub.${cat.key}`)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated */}
      {topRated.length > 0 && (
        <section className="py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] mb-0.5">{t('curated')}</p>
                <h2 className="text-xl md:text-2xl font-black text-gray-900">{t('topRated')}</h2>
              </div>
              <Link href="/products" className="text-xs font-bold text-gray-400 hover:text-rose-600 transition-colors">{t('seeAll')}</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {topRated.map((p: any) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Promo strip */}
      <section className="py-5 bg-rose-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-white text-center sm:text-left">
          <div>
            <p className="font-black text-lg leading-tight">{t('freeDeliveryBanner')}</p>
            <p className="text-rose-200 text-sm">{t('shipsTo')}</p>
          </div>
          <Link href="/products" className="flex-shrink-0 bg-white text-rose-600 font-black px-6 py-2.5 rounded-xl hover:bg-rose-50 transition-colors text-sm">
            {t('shopNow')}
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] mb-0.5">{t('fresh')}</p>
                <h2 className="text-xl md:text-2xl font-black text-gray-900">{t('newArrivals')}</h2>
              </div>
              <Link href="/products?newArrival=true" className="text-xs font-bold text-gray-400 hover:text-rose-600 transition-colors">{t('seeAll')}</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {newArrivals.map((p: any) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Trust bar */}
      <section className="py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST.map(({ Icon, key, subKey, color, bg }) => (
              <div key={key} className="flex items-center gap-3">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">{t(key)}</p>
                  <p className="text-xs text-gray-500 leading-tight">{t(subKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] text-gray-500 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-rose-600 rounded-md flex items-center justify-center">
                <span className="text-white font-black text-[10px]">AZ</span>
              </div>
              <span className="text-white font-black text-sm">Azmarino</span>
              <span className="text-gray-600 text-sm">· ኣዝማሪኖ</span>
            </div>
            <p className="text-xs text-center">{t('footerTagline')}</p>
            <div className="flex gap-5 text-xs">
              <Link href="/track" className="hover:text-white transition-colors">{t('track')}</Link>
              <Link href="/products" className="hover:text-white transition-colors">{t('shop')}</Link>
              <a href="mailto:support@azmarino.online" className="hover:text-white transition-colors">{t('support')}</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
