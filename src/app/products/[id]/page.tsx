'use client';

import Image from 'next/image';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import ProductCard from '../../../components/ProductCard';
import { useLang } from '../../../context/LanguageContext';
import { StarIcon } from '../../../components/Icons';
import type { Product } from '../../../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

interface Review {
  _id?: string;
  name?: string;
  date?: string;
  rating?: number;
  comment?: string;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, lang } = useLang();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        const data = await res.json();
        const p = data.data || data;
        setProduct(p);
        
        if (p.cjVariants?.length) {
          setSelectedVariantId(p.cjVariants[0].vid);
        }

        const [revRes, recRes] = await Promise.all([
          fetch(`${API_URL}/reviews/product/${id}`),
          fetch(`${API_URL}/products?category=${p.category}&limit=8`)
        ]);

        const revData = await revRes.json();
        const recData = await recRes.json();

        setReviews(Array.isArray(revData) ? revData : revData.reviews || []);
        setRecommended((recData.products || recData.data || []).filter((item: Product) => item._id !== id).slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const addToCart = () => {
    if (!product) return;

    const selectedVariant = product.cjVariants?.find(v => v.vid === selectedVariantId);

    if (product.cjVariants?.length && !selectedVariantId) {
      setError('Please select a style');
      return;
    }

    if (product.sizes?.length && !selectedSize) {
      setError('Please select a size');
      return;
    }
    if (product.colors?.length && !selectedColor) {
      setError('Please select a color');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]');
    
    // Create a unique ID for the cart item based on product, size, color and variant
    const itemId = `${product._id}|${selectedSize || 'none'}|${selectedColor || 'none'}|${selectedVariantId || 'none'}`;
    const existing = cart.find((i: any) => i.id === itemId);

    const productToSave = {
      ...product,
      price: selectedVariant?.price || product.price,
      image: selectedVariant?.image || product.image,
    };

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ 
        id: itemId, 
        product: productToSave, 
        quantity, 
        selectedSize, 
        selectedColor, 
        variantName: selectedVariant?.name,
        selected: true 
      });
    }

    localStorage.setItem('azmarino_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    setError('');
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="section-container py-20 animate-pulse">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-[3/4] bg-gray-100 rounded-2xl" />
          <div className="space-y-6">
            <div className="h-10 bg-gray-100 w-3/4" />
            <div className="h-6 bg-gray-100 w-1/4" />
            <div className="h-40 bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="section-container py-40 text-center">
        <h1 className="heading-lg mb-8">Product Not Found</h1>
        <Link href="/products" className="btn-black inline-flex">Return to Shop</Link>
      </div>
    </div>
  );

  const gallery = [product.image, ...(product.images || [])].filter(Boolean) as string[];
  const selectedVariant = product.cjVariants?.find(v => v.vid === selectedVariantId);
  const currentPrice = selectedVariant?.price || product.price;
  const currentImage = selectedVariant?.image || gallery[selectedImage];
  
  const discount = product.discount || (product.originalPrice && product.originalPrice > currentPrice ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100) : 0);
  const displayName = lang === 'ti' && product.nameTi ? product.nameTi : product.name;
  const displayDesc = lang === 'ti' && product.descriptionTi ? product.descriptionTi : product.description;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="section-container py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 label-caps mb-10 text-gray-400">
          <Link href="/" className="hover:text-black transition-colors">{t('home') || 'Home'}</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-black transition-colors">{t('shop')}</Link>
          <span>/</span>
          <span className="text-black">{product.category?.replace(/-/g, ' ')}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_450px] gap-12 xl:gap-20 items-start">
          
          {/* Left: Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 group">
              <Image src={currentImage} alt={displayName} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" priority />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5">
                  -{discount}% OFF
                </span>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {gallery.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${selectedImage === i ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <p className="label-caps mb-2 text-gray-400">{product.brand || 'Azmarino Premium'}</p>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black leading-none mb-4">{displayName}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1">
                <StarIcon className="w-3.5 h-3.5 text-amber-400" filled />
                <span className="text-xs font-black text-black">{product.rating?.toFixed(1) || '4.8'}</span>
              </div>
              <span className="w-px h-3 bg-gray-200" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{reviews.length || 12} {t('reviews')}</span>
              <span className="w-px h-3 bg-gray-200" />
              <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock && product.stock > 0 ? 'text-green-600' : 'text-rose-600'}`}>
                {product.stock && product.stock > 0 ? t('stockIn') : t('stockOut')}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-10 pb-8 border-b border-gray-100">
              <span className="text-4xl font-black tracking-tighter text-black">€{currentPrice.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > currentPrice && (
                <span className="text-lg font-bold text-gray-300 line-through">€{product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            {/* CJ Variants */}
            {product.cjVariants && product.cjVariants.length > 0 && (
              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-black mb-4">Select Style / Variant</p>
                <div className="grid grid-cols-2 gap-2">
                  {product.cjVariants.map(v => (
                    <button 
                      key={v.vid} 
                      onClick={() => setSelectedVariantId(v.vid)}
                      className={`p-3 text-[10px] font-bold border transition-all text-left flex flex-col gap-1 ${selectedVariantId === v.vid ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200 hover:border-black'}`}
                    >
                      <span className="uppercase tracking-tight line-clamp-1">{v.name}</span>
                      <span className={selectedVariantId === v.vid ? 'text-gray-400' : 'text-gray-500'}>€{v.price.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variants: Size */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-black">{t('selectSize')}</p>
                  <button className="text-[9px] font-black uppercase tracking-widest text-gray-400 underline hover:text-black">{t('sizeGuide') || 'Size Guide'}</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map(size => (
                    <button 
                      key={size} 
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 text-xs font-bold border transition-all ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200 hover:border-black'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variants: Color */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-black mb-4">{t('selectColor')}</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button 
                      key={color} 
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 h-12 text-[10px] font-black uppercase tracking-widest border transition-all ${selectedColor === color ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200 hover:border-black'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 mb-12">
              <div className="flex gap-3">
                <div className="flex items-center border border-gray-200 h-14 bg-gray-50">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-12 h-full hover:bg-white transition-colors text-lg font-bold">−</button>
                  <span className="w-12 text-center text-xs font-black">{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} className="w-12 h-full hover:bg-white transition-colors text-lg font-bold">+</button>
                </div>
                <button 
                  onClick={addToCart}
                  disabled={added}
                  className={`flex-1 h-14 btn-black text-xs ${added ? 'bg-green-600' : 'bg-black'}`}
                >
                  {added ? t('added') : t('addToCart')}
                </button>
              </div>
              {error && <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest text-center">{error}</p>}
            </div>

            {/* Features Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-black mb-1">{t('trustDelivery')}</p>
                <p className="text-[10px] font-medium text-gray-500 leading-tight">{t('trustDeliverySub')}</p>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-black mb-1">{t('trustPayment')}</p>
                <p className="text-[10px] font-medium text-gray-500 leading-tight">{t('trustPaymentSub')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Reviews Section */}
        <div className="mt-32 grid lg:grid-cols-2 gap-20">
          <div>
            <h2 className="heading-lg mb-8">{t('description')}</h2>
            <div className="text-sm text-gray-500 font-medium leading-relaxed space-y-4">
              <p>{displayDesc || t('defaultDescription') || 'This premium item has been meticulously curated for the Azmarino global collection. Quality, durability, and contemporary style are guaranteed.'}</p>
            </div>
          </div>
          <div>
            <h2 className="heading-lg mb-8">{t('reviews')}</h2>
            <div className="space-y-6">
              {reviews.length > 0 ? reviews.map((rev, i) => (
                <div key={i} className="pb-6 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-black uppercase tracking-widest text-black">{rev.name || 'Verified Buyer'}</p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <StarIcon key={j} className={`w-2.5 h-2.5 ${j < (rev.rating || 5) ? 'text-amber-400' : 'text-gray-200'}`} filled />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed italic">"{rev.comment || 'Exceeded my expectations. The quality is phenomenal.'}"</p>
                </div>
              )) : (
                <p className="text-xs font-bold text-gray-300 uppercase tracking-[0.2em] italic">{t('noReviews') || 'No reviews yet for this collection piece.'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Recommended Grid */}
        {recommended.length > 0 && (
          <section className="mt-32 pt-20 border-t border-gray-100">
            <div className="flex flex-col items-center mb-12">
              <p className="label-caps mb-2">{t('discoverMore')}</p>
              <h2 className="heading-lg">{t('related')}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {recommended.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </main>

      {/* Simple Footer for Product Page */}
      <footer className="bg-black text-white py-20 mt-20">
        <div className="section-container text-center">
           <img src="/logo.jpg" alt="Azmarino" className="w-16 h-16 mx-auto mb-8 rounded-xl grayscale invert p-1 bg-white" />
           <p className="label-caps text-white/40 tracking-[0.4em]">Azmarino Premium Global Concierge</p>
        </div>
      </footer>
    </div>
  );
}
