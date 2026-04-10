import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

const CATEGORIES = [
  { id: 'women-clothing', label: "Women", labelTi: 'ጓል', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80' },
  { id: 'men-clothing', label: "Men", labelTi: 'ወዲ', image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400&q=80' },
  { id: 'shoes', label: "Shoes", labelTi: 'ሳእኒ', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
  { id: 'electronics', label: "Electronics", labelTi: 'ኤለክትሮኒክስ', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80' },
  { id: 'accessories', label: "Accessories", labelTi: 'ኣጽዋር', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80' },
  { id: 'beauty', label: "Beauty", labelTi: 'ጽባቐ', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80' },
];

async function getProducts(params: string) {
  try {
    const res = await fetch(`${API_URL}/products?${params}&limit=8`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.products || data.data || [];
  } catch { return []; }
}

export default async function HomePage() {
  const [topRated, newArrivals] = await Promise.all([
    getProducts('sort=-rating'),
    getProducts('newArrival=true&sort=-createdAt'),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0f0f0f] text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80"
            alt="Fashion hero"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-xl">
            <span className="inline-block bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
              ኣዝማሪኖ · Azmarino
            </span>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
              Shop in<br />
              <span className="text-rose-400">Tigrinya</span><br />
              or English.
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              1,184+ products. Free delivery across Europe.<br />Secure payments. Built for the diaspora.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-base">
                Shop Now
              </Link>
              <Link href="/track" className="bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-6 py-3.5 rounded-xl transition-colors border border-white/20 text-base">
                Track Order
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2"><span className="text-green-400">✓</span> Free EU Delivery over €50</span>
              <span className="flex items-center gap-2"><span className="text-green-400">✓</span> 30-Day Returns</span>
              <span className="flex items-center gap-2"><span className="text-green-400">✓</span> Secure Stripe Payments</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-rose-600 text-sm font-bold uppercase tracking-widest mb-1">Browse</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">Shop by Category</h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-gray-500 hover:text-rose-600 transition-colors hidden sm:block">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100"
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white">
                  <p className="font-bold text-sm leading-tight">{cat.label}</p>
                  <p className="text-xs text-white/70">{cat.labelTi}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Products */}
      {topRated.length > 0 && (
        <section className="py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-rose-600 text-sm font-bold uppercase tracking-widest mb-1">Curated</p>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900">Top Rated</h2>
              </div>
              <Link href="/products" className="text-sm font-semibold text-gray-500 hover:text-rose-600 transition-colors">
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {topRated.map((p: any) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="py-10 bg-rose-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white text-center md:text-left">
            <div>
              <h3 className="text-2xl md:text-3xl font-black mb-1">Free delivery on orders over €50</h3>
              <p className="text-rose-200">Shipping to Germany, Netherlands, Sweden, Norway, UK + more</p>
            </div>
            <Link href="/products" className="flex-shrink-0 bg-white text-rose-600 font-bold px-8 py-3 rounded-xl hover:bg-rose-50 transition-colors">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-rose-600 text-sm font-bold uppercase tracking-widest mb-1">Fresh</p>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900">New Arrivals</h2>
              </div>
              <Link href="/products?newArrival=true" className="text-sm font-semibold text-gray-500 hover:text-rose-600 transition-colors">
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {newArrivals.map((p: any) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Trust */}
      <section className="py-12 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🚚', title: 'Free EU Delivery', sub: 'On orders over €50' },
              { icon: '🔒', title: 'Secure Payment', sub: 'Powered by Stripe' },
              { icon: '↩️', title: '30-Day Returns', sub: 'Hassle-free returns' },
              { icon: '🤖', title: 'Sara AI Support', sub: 'Help in Tigrinya & English' },
            ].map(item => (
              <div key={item.title} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{item.icon}</span>
                <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                <p className="text-xs text-gray-500">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f0f0f] text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-rose-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xs">A</span>
              </div>
              <span className="text-white font-black text-lg">Azmarino</span>
              <span className="text-gray-500">· ኣዝማሪኖ</span>
            </div>
            <p className="text-sm text-center">© {new Date().getFullYear()} Azmarino. The world's first Eritrean diaspora store.</p>
            <div className="flex gap-4 text-sm">
              <Link href="/track" className="hover:text-white transition-colors">Track Order</Link>
              <Link href="/products" className="hover:text-white transition-colors">Shop</Link>
              <a href="mailto:support@azmarino.online" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
