'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { PlayIcon, StarIcon } from './Icons';
import type { Product } from '../lib/api';

interface Props { product: Product; }

export default function ProductCard({ product }: Props) {
  const { lang } = useLang();
  const [imgIdx, setImgIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const allImages = [product.image, ...(product.images || [])].filter(Boolean) as string[];
  const hasVideo = !!(product as any).videos?.length;

  const discount = product.discount || (product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);

  const name = lang === 'ti' && product.nameTi ? product.nameTi : product.name;

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]');
    const ex = cart.find((i: any) => i.id === product._id);
    if (ex) ex.quantity += 1;
    else cart.push({ id: product._id, product, quantity: 1, selected: true });
    localStorage.setItem('azmarino_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <Link
      href={`/products/${product._id}`}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col"
      onMouseEnter={() => allImages.length > 1 && setImgIdx(1)}
      onMouseLeave={() => setImgIdx(0)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden flex-shrink-0">
        {/* Skeleton */}
        {!imgLoaded && <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />}

        <Image
          src={allImages[imgIdx] || '/placeholder.jpg'}
          alt={product.name}
          fill
          className={`object-cover transition-all duration-500 group-hover:scale-[1.04] ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onLoad={() => setImgLoaded(true)}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full tracking-wide">
              -{discount}%
            </span>
          )}
          {product.newArrival && !discount && (
            <span className="bg-black text-white text-[10px] font-black px-2 py-0.5 rounded-full tracking-wide">
              NEW
            </span>
          )}
          {hasVideo && (
            <span className="bg-black/70 text-white rounded-full p-1 flex items-center justify-center w-5 h-5">
              <PlayIcon className="w-2.5 h-2.5" />
            </span>
          )}
        </div>

        {/* Image dots indicator */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {allImages.slice(0, 4).map((_, i) => (
              <div key={i} className={`rounded-full bg-white/80 transition-all duration-200 ${imgIdx === i ? 'w-3 h-1.5' : 'w-1.5 h-1.5 opacity-60'}`} />
            ))}
          </div>
        )}

        {/* Quick add — slides up on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <button onClick={addToCart}
            className={`w-full py-2.5 text-xs font-black uppercase tracking-widest transition-colors ${added ? 'bg-green-500 text-white' : 'bg-black/90 hover:bg-black text-white'}`}>
            {added ? (lang === 'ti' ? '✓ ተወሲኹ' : '✓ Added') : (lang === 'ti' ? 'ቅልጡፍ ወስኽ' : 'Quick Add')}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-0.5">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{name}</h3>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-gray-900">€{product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">€{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          {product.rating && (
            <div className="flex items-center gap-0.5">
              <StarIcon className="w-3 h-3 text-amber-400" filled />
              <span className="text-[11px] text-gray-500 font-semibold">{product.rating}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
