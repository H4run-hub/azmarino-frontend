'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '../lib/api';

interface Props { product: Product; }

export default function ProductCard({ product }: Props) {
  const [imgIndex, setImgIndex] = useState(0);
  const [added, setAdded] = useState(false);

  const allImages = [product.image, ...(product.images || [])].filter(Boolean) as string[];
  const hasMultiple = allImages.length > 1;
  const hasVideo = !!(product as any).videos?.length;

  const discount = product.discount || (product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]');
    const existing = cart.find((i: any) => i.id === product._id);
    if (existing) { existing.quantity += 1; } else { cart.push({ id: product._id, product, quantity: 1, selected: true }); }
    localStorage.setItem('azmarino_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Link
      href={`/products/${product._id}`}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col"
      onMouseEnter={() => hasMultiple && setImgIndex(1)}
      onMouseLeave={() => setImgIndex(0)}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
        <Image
          src={allImages[imgIndex] || '/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          {product.newArrival && !discount && (
            <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">
              NEW
            </span>
          )}
        </div>

        {/* Video badge */}
        {hasVideo && (
          <div className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1.5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        )}

        {/* Image dots */}
        {hasMultiple && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {allImages.slice(0, 4).map((_, i) => (
              <div key={i} className={`rounded-full transition-all duration-200 ${imgIndex === i ? 'w-3 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/60'}`} />
            ))}
          </div>
        )}

        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={addToCart}
            className={`w-full py-3 text-sm font-bold transition-colors ${added ? 'bg-green-500 text-white' : 'bg-black/90 hover:bg-black text-white'}`}
          >
            {added ? '✓ Added' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1">
        <p className="text-xs text-gray-400 capitalize font-medium">{product.category?.replace(/-/g, ' ')}</p>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{product.name}</h3>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-gray-900">€{product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">€{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          {product.rating && (
            <div className="flex items-center gap-0.5">
              <span className="text-amber-400 text-xs">★</span>
              <span className="text-xs text-gray-500 font-medium">{product.rating}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
