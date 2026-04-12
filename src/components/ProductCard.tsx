'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { StarIcon } from './Icons';
import type { Product } from '../lib/api';

interface Props {
  product: Product;
}

const formatPrice = (price: number) => `€${price.toFixed(2)}`;

export default function ProductCard({ product }: Props) {
  const { lang, t } = useLang();
  const [hover, setHover] = useState(false);

  const images = [product.image, ...(product.images || [])].filter(Boolean) as string[];
  const discount = product.discount || (
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0
  );

  const displayName = lang === 'ti' && product.nameTi ? product.nameTi : product.name;

  return (
    <Link
      href={`/products/${product._id}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 border border-gray-100 rounded-xl">
        <Image
          src={(hover && images[1]) ? images[1] : images[0] || '/logo.jpg'}
          alt={displayName}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-all duration-700 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="bg-black text-white text-[8px] font-black uppercase tracking-widest px-2 py-1">
              -{discount}%
            </span>
          )}
          {product.newArrival && (
            <span className="bg-white text-black text-[8px] font-black uppercase tracking-widest px-2 py-1 border border-gray-100">
              {t('new')}
            </span>
          )}
        </div>

        {/* Quick View / Hover Action */}
        <div className={`absolute inset-x-0 bottom-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300`}>
           <div className="btn-black w-full text-[8px] h-10 py-0">
              {t('viewDetails') || 'View Details'}
           </div>
        </div>
      </div>

      <div className="mt-3 space-y-1 px-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-tight line-clamp-1 flex-1">
            {displayName}
          </h3>
          {product.rating && (
            <div className="flex items-center gap-0.5">
              <StarIcon className="w-2.5 h-2.5 text-amber-400" filled />
              <span className="text-[9px] font-black text-gray-400">{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-black text-black">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[10px] text-gray-400 line-through font-bold">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        
        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
          {(product.category || 'Collection').replace(/-/g, ' ')}
        </p>
      </div>
    </Link>
  );
}
