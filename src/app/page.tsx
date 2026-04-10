import Link from 'next/link';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

const CATEGORIES = [
  { id: 'men-clothing', label: "Men's Clothing", labelTi: 'ክዳን ወዲ', emoji: '👔' },
  { id: 'women-clothing', label: "Women's Clothing", labelTi: 'ክዳን ጓል', emoji: '👗' },
  { id: 'kids-clothing', label: "Kids' Clothing", labelTi: 'ክዳን ቆልዓ', emoji: '👶' },
  { id: 'electronics', label: 'Electronics', labelTi: 'ኤለክትሮኒክስ', emoji: '📱' },
  { id: 'shoes', label: 'Shoes', labelTi: 'ሳእኒ', emoji: '👟' },
  { id: 'accessories', label: 'Accessories', labelTi: 'ኣጽዋር', emoji: '👜' },
];

async function getProducts(params: string) {
  try {
    const res = await fetch(`${API_URL}/products?${params}&limit=8`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.products || data.data || [];
  } catch { return []; }
}

export default async function HomePage() {
  const [featured, newArrivals] = await Promise.all([
    getProducts('sort=-rating'),
    getProducts('newArrival=true&sort=-createdAt'),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="bg-gradient-to-br from-rose-600 via-rose-700 to-rose-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <p className="text-rose-200 text-sm font-semibold uppercase tracking-wider mb-4">World&apos;s First Eritrean Diaspora Store</p>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">Shop in<br /><span className="text-rose-200">Tigrinya</span><br />or English</h1>
            <p className="text-rose-100 text-lg mb-8 max-w-md">2,000+ products. Free delivery across Europe. Secure Stripe payments.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/products" className="bg-white text-rose-700 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors text-lg text-center">Shop Now</Link>
              <Link href="/track" className="border-2 border-white text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors text-lg text-center">Track Order</Link>
            </div>
          </div>
          <div className="flex-1 max-w-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center">
              <div className="text-6xl mb-4">🛍️</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[['2K+','Products'],['FREE','EU Delivery'],['30d','Returns'],['🔒','Stripe Pay']].map(([v,l]) => (
                  <div key={l} className="bg-white/10 rounded-xl p-3"><div className="text-2xl font-black">{v}</div><div className="text-rose-200">{l}</div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {CATEGORIES.map(cat => (
              <Link key={cat.id} href={`/products?category=${cat.id}`} className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all group">
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-xs font-semibold text-slate-700 text-center group-hover:text-rose-700">{cat.label}</span>
                <span className="text-xs text-slate-400 text-center">{cat.labelTi}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-800">Featured Products</h2>
              <Link href="/products" className="text-rose-600 font-semibold text-sm hover:text-rose-700">View All →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map((p: any) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-800">New Arrivals ✨</h2>
              <Link href="/products?newArrival=true" className="text-rose-600 font-semibold text-sm hover:text-rose-700">View All →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {newArrivals.map((p: any) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[{emoji:'🚚',title:'Free EU Delivery',sub:'On all orders to Europe'},{emoji:'🔒',title:'Secure Payment',sub:'Powered by Stripe'},{emoji:'↩️',title:'30-Day Returns',sub:'Hassle-free returns'},{emoji:'💬',title:'Sara AI Support',sub:'Chat in Tigrinya or English'}].map(b => (
              <div key={b.title} className="flex flex-col items-center gap-2 p-4">
                <span className="text-3xl">{b.emoji}</span>
                <div className="font-bold text-slate-800">{b.title}</div>
                <div className="text-sm text-slate-500">{b.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div><span className="text-white font-black text-xl">Azmarino</span><span className="ml-2 text-slate-500">ኣዝማሪኖ</span></div>
          <div className="flex gap-6 text-sm">
            <Link href="/products" className="hover:text-white transition-colors">Shop</Link>
            <Link href="/track" className="hover:text-white transition-colors">Track Order</Link>
            <a href="mailto:support@azmarino.online" className="hover:text-white transition-colors">Support</a>
          </div>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} Azmarino. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
