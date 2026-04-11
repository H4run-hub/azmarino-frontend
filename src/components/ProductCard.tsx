'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { StarIcon } from './Icons';
import type { Product } from '../lib/api';

interface Props {
  product: Product;
}

interface StoredCartItem {
  id: string;
  product: Product;
  quantity: number;
  selected?: boolean;
}

const formatPrice = (price: number) => `EUR ${price.toFixed(2)}`;

export default function ProductCard({ product }: Props) {
  const [imageIndex, setImageIndex] = useState(0);
  const [added, setAdded] = useState(false);

  const images = [product.image, ...(product.images || [])].filter(Boolean) as string[];
  const displayName = product.name;
  const discount = product.discount || (
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0
  );

  const addToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]') as StoredCartItem[];
    const existing = cart.find((item) => item.id === product._id);

    if (existing) existing.quantity += 1;
    else cart.push({ id: product._id, product, quantity: 1, selected: true });

    localStorage.setItem('azmarino_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <Link
      href={`/products/${product._id}`}
      onMouseEnter={() => images.length > 1 && setImageIndex(1)}
      onMouseLeave={() => setImageIndex(0)}
      className="group block"
    >
      <article className="surface-solid overflow-hidden rounded-[1.65rem] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(43,40,36,0.11)]">
        <div className="relative aspect-[4/5] overflow-hidden bg-[linear-gradient(180deg,#f6efe5,#ebe1d1)]">
          <Image
            src={images[imageIndex] || '/logo.jpg'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <div className="flex flex-wrap gap-2">
              {discount > 0 && (
                <span className="rounded-full bg-[var(--ink-strong)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em] text-white">
                  Save {discount}%
                </span>
              )}
              {product.newArrival && (
                <span className="rounded-full bg-white/82 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[var(--accent)]">
                  New
                </span>
              )}
            </div>

            {product.rating ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/84 px-2.5 py-1 text-[10px] font-bold text-[var(--ink-strong)]">
                <StarIcon className="h-3 w-3 text-[var(--gold)]" filled />
                {product.rating.toFixed(1)}
              </span>
            ) : null}
          </div>

          <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition duration-300 group-hover:translate-y-0">
            <button
              onClick={addToCart}
              className={`w-full rounded-full px-4 py-3 text-xs font-extrabold uppercase tracking-[0.24em] transition ${
                added ? 'bg-[var(--gold)] text-[var(--ink-strong)]' : 'bg-[var(--ink-strong)] text-white hover:bg-[var(--accent)]'
              }`}
            >
              {added ? 'Added to cart' : 'Quick add'}
            </button>
          </div>
        </div>

        <div className="space-y-3 px-4 pb-5 pt-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--muted)]">
              {(product.category || 'collection').replace(/-/g, ' ')}
            </p>
            <h3 className="text-sm font-semibold leading-6 text-[var(--ink-strong)]">
              {displayName}
            </h3>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-[var(--ink-strong)]">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price ? (
                <span className="text-xs font-medium text-[var(--muted)] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              ) : null}
            </div>

            {product.stock !== undefined ? (
              <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
                {product.stock > 0 ? 'In stock' : 'Low stock'}
              </span>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}
