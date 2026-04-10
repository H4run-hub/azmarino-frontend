'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import ProductCard from '../../../components/ProductCard';
import type { Product } from '../../../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

interface ProductWithVideo extends Product {
  videos?: string[];
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<ProductWithVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Infinite scroll recommended
  const [recommended, setRecommended] = useState<any[]>([]);
  const [recPage, setRecPage] = useState(1);
  const [recLoading, setRecLoading] = useState(false);
  const [hasMoreRec, setHasMoreRec] = useState(true);
  const loader = useRef(null);

  // Zoom state
  const [zoom, setZoom] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('azmarino_token'));
    fetch(`${API_URL}/products/${id}`)
      .then(r => r.json())
      .then(d => {
        const p = d.data || d;
        setProduct(p);
        setLoading(false);
        // Load initial recommended based on category
        if (p.category) {
            fetch(`${API_URL}/products?category=${p.category}&limit=8&exclude=${id}`)
                .then(r => r.json())
                .then(rd => setRecommended(rd.products || rd.data || []));
        }
      })
      .catch(() => setLoading(false));
      
    fetch(`${API_URL}/reviews/product/${id}`)
      .then(r => r.json())
      .then(d => setReviews(Array.isArray(d) ? d : d.reviews || []))
      .catch(() => {});
  }, [id]);

  const fetchMoreRec = async () => {
    if (recLoading || !hasMoreRec || !product) return;
    setRecLoading(true);
    try {
      const res = await fetch(`${API_URL}/products?category=${product.category}&page=${recPage + 1}&limit=12&exclude=${id}`);
      const data = await res.json();
      const newItems = data.products || data.data || [];
      if (newItems.length === 0) setHasMoreRec(false);
      else {
        setRecommended(prev => [...prev, ...newItems]);
        setRecPage(p => p + 1);
      }
    } finally { setRecLoading(false); }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMoreRec) fetchMoreRec();
    }, { threshold: 0.1 });
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [loader, hasMoreRec, recPage, recLoading, product]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePos({ x, y });
  };

  if (loading) return <><Navbar /><div className="max-w-7xl mx-auto px-4 py-10 animate-pulse"><div className="grid md:grid-cols-2 gap-10"><div className="aspect-square bg-gray-100 rounded-2xl" /><div className="space-y-4"><div className="h-8 bg-gray-100 rounded w-3/4" /><div className="h-12 bg-gray-100 rounded w-1/4" /><div className="h-40 bg-gray-100 rounded" /></div></div></div></>;

  if (!product) return <><Navbar /><div className="flex flex-col items-center justify-center min-h-[50vh]"><p>Product not found.</p></div></>;

  const allImages = [product.image, ...(product.images || [])].filter(Boolean) as string[];
  const allMedia = [
    ...allImages.map(src => ({ type: 'image' as const, src })),
    ...(product.videos || []).map(src => ({ type: 'video' as const, src })),
  ];
  const currentMedia = allMedia[selectedMedia] || { type: 'image' as const, src: '/placeholder.jpg' };
  const discount = product.discount || (product.originalPrice && product.price < product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]');
    const key = `${product._id}|size:${selectedSize}|color:${selectedColor}`;
    const existing = cart.find((i: any) => i.id === key);
    if (existing) existing.quantity += quantity;
    else cart.push({ id: key, product, quantity, selectedSize, selectedColor, selected: true });
    localStorage.setItem('azmarino_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        {/* Breadcrumb - Denser */}
        <nav className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-black transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-black truncate">{product.category?.replace(/-/g, ' ')}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-10 mb-10">
          {/* Media Gallery - Zoomable */}
          <div className="space-y-2">
            <div 
              className="relative aspect-[4/5] bg-gray-50 overflow-hidden cursor-crosshair border border-gray-100"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={handleMouseMove}
            >
              {currentMedia.type === 'video' ? (
                <video src={currentMedia.src} controls autoPlay muted loop className="w-full h-full object-cover" />
              ) : (
                <>
                  <Image src={currentMedia.src} alt={product.name} fill className={`object-cover transition-opacity duration-300 ${zoom ? 'opacity-0' : 'opacity-100'}`} priority />
                  {zoom && (
                    <div 
                      className="absolute inset-0 z-10 w-full h-full"
                      style={{
                        backgroundImage: `url(${currentMedia.src})`,
                        backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                        backgroundSize: '250%',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                  )}
                </>
              )}
              {discount > 0 && <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-tighter shadow-xl">-{discount}% OFF</span>}
            </div>

            {/* Scrollable Thumbnails */}
            {allMedia.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {allMedia.map((media, i) => (
                  <button key={i} onClick={() => setSelectedMedia(i)} className={`relative w-14 h-14 flex-shrink-0 border transition-all ${selectedMedia === i ? 'border-black' : 'border-gray-100 grayscale hover:grayscale-0'}`}>
                    {media.type === 'video' ? <div className="w-full h-full bg-black flex items-center justify-center text-white text-[8px]">VIDEO</div> : <Image src={media.src} alt="" fill className="object-cover" sizes="56px" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Denser & ULTRA Professional */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] mb-0.5">{product.category?.replace(/-/g, ' ')}</p>
              <h1 className="text-xl md:text-3xl font-black text-black leading-[1.1] tracking-tighter uppercase">{product.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                 <div className="flex items-center gap-0.5">
                    <span className="text-amber-400 text-xs">★</span>
                    <span className="text-[11px] font-black text-black">{product.rating}</span>
                 </div>
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.reviews || reviews.length} REVIEWS</span>
                 <span className="h-3 w-px bg-gray-200" />
                 <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">IN STOCK</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2 py-3 border-y border-gray-100">
              <span className="text-3xl font-black text-black tracking-tighter">€{product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through font-bold">€{product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            {/* Description - Compact */}
            <div className="text-[11px] text-gray-500 leading-relaxed font-medium">
              <p className="line-clamp-4">{product.description}</p>
            </div>

            {/* Variants */}
            <div className="space-y-4">
                {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-black flex justify-between">
                        <span>Select Size</span>
                        {selectedSize && <span className="text-rose-600">Selected: {selectedSize}</span>}
                    </p>
                    <div className="grid grid-cols-5 gap-1.5">
                    {product.sizes.map(size => (
                        <button key={size} onClick={() => setSelectedSize(size)} className={`h-10 text-[10px] font-black border transition-all ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-900 hover:border-black'}`}>{size}</button>
                    ))}
                    </div>
                </div>
                )}

                {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-black flex justify-between">
                        <span>Select Color</span>
                        {selectedColor && <span className="text-rose-600">Selected: {selectedColor}</span>}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                    {product.colors.map(color => (
                        <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 h-10 text-[10px] font-black border transition-all uppercase tracking-tighter ${selectedColor === color ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-900 hover:border-black'}`}>{color}</button>
                    ))}
                    </div>
                </div>
                )}
            </div>

            {/* Add to Cart - Denser */}
            <div className="pt-4 space-y-3">
                <div className="flex gap-2">
                    <div className="flex items-center border border-gray-200 h-12">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-full hover:bg-gray-50 text-xs font-bold">−</button>
                        <span className="w-10 text-center text-xs font-black">{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-full hover:bg-gray-50 text-xs font-bold">+</button>
                    </div>
                    <button 
                        onClick={addToCart}
                        disabled={added}
                        className={`flex-1 h-12 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${added ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-rose-600 active:scale-[0.98]'}`}
                    >
                        {added ? '✓ Item Added' : 'Add to Collection'}
                    </button>
                </div>
            </div>
          </div>
        </div>

        {/* Recommended - Infinite */}
        <section className="mt-16 border-t border-gray-100 pt-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-black tracking-tighter uppercase">Discover More</h2>
                <div className="h-px flex-1 bg-gray-100 mx-6" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1.5">
                {recommended.map((p: any) => <ProductCard key={p._id} product={p} />)}
            </div>
            <div ref={loader} className="py-12 flex justify-center">
                {recLoading && <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />}
            </div>
        </section>
      </main>

      {/* Mini Footer */}
      <footer className="bg-[#050505] text-white py-10 mt-10 text-center border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
            <img src="/logo.jpg" alt="Azmarino" className="w-24 h-auto mx-auto mb-6 opacity-50 grayscale invert" />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">Azmarino Premium Global Concierge</p>
        </div>
      </footer>
    </div>
  );
}
