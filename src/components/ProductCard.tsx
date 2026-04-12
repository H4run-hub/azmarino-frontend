'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { PlayIcon, StarIcon } from './Icons';
import type { Product } from '../lib/api';
import { useT } from '../i18n/LanguageProvider';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { t } = useT();
  const [imgIdx, setImgIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const allImages = [product.image, ...(product.images || [])].filter(Boolean) as string[];
  const hasVideo = !!(product as unknown as { videos?: unknown[] }).videos?.length;

  const discount =
    product.discount ||
    (product.originalPrice && product.price < product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0);

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]');
    const ex = cart.find((i: { id: string }) => i.id === product._id);
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
      className="group relative bg-white rounded-none overflow-hidden border border-gray-100 hover:border-black transition-all duration-300 flex flex-col"
      onMouseEnter={() => allImages.length > 1 && setImgIdx(1)}
      onMouseLeave={() => setImgIdx(0)}
    >
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden flex-shrink-0">
        {!imgLoaded && <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />}

        <Image
          src={allImages[imgIdx] || '/placeholder.jpg'}
          alt={product.name}
          fill
          className={`object-cover transition-all duration-500 group-hover:scale-[1.04] ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onLoad={() => setImgLoaded(true)}
        />

        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-none uppercase tracking-widest">
              -{discount}%
            </span>
          )}
          {product.newArrival && !discount && (
            <span className="bg-black text-white text-[9px] font-black px-1.5 py-0.5 rounded-none uppercase tracking-widest">
              {t('product.new')}
            </span>
          )}
          {hasVideo && (
            <span className="bg-black/70 text-white rounded-none p-1 flex items-center justify-center w-5 h-5">
              <PlayIcon className="w-2.5 h-2.5" />
            </span>
          )}
        </div>

        {allImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {allImages.slice(0, 4).map((_, i) => (
              <div
                key={i}
                className={`rounded-full bg-white/80 transition-all duration-200 ${
                  imgIdx === i ? 'w-3 h-1.5' : 'w-1.5 h-1.5 opacity-60'
                }`}
              />
            ))}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <button
            onClick={addToCart}
            className={`w-full py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
              added ? 'bg-rose-600 text-white' : 'bg-black hover:bg-rose-600 text-white'
            }`}
          >
            {added ? t('product.added') : t('product.quickAdd')}
          </button>
        </div>
      </div>

      <div className="p-2 flex flex-col gap-0">
        <h3 className="text-xs font-semibold text-gray-900 line-clamp-1 leading-tight">{product.name}</h3>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-[13px] font-black text-gray-900">€{product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] text-gray-400 line-through">€{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          {product.rating && (
            <div className="flex items-center gap-0.5">
              <StarIcon className="w-2.5 h-2.5 text-amber-400" filled />
              <span className="text-[10px] text-gray-500 font-bold">{product.rating}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
