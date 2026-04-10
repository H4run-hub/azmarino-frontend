'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '../lib/api';

interface Props { product: Product; }

export default function ProductCard({ product }: Props) {
  const discount = product.discount || (product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]');
    const existing = cart.find((i: any) => i.id === product._id);
    if (existing) { existing.quantity += 1; } else { cart.push({ id: product._id, product, quantity: 1, selected: true }); }
    localStorage.setItem('azmarino_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  return (
    <Link href={`/products/${product._id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-slate-100 flex flex-col">
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        <Image src={product.image || '/placeholder.jpg'} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
        {discount > 0 && <span className="absolute top-2 left-2 bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded-full">-{discount}%</span>}
        {product.newArrival && <span className="absolute top-2 right-2 bg-sky-500 text-white text-xs font-bold px-2 py-1 rounded-full">NEW</span>}
      </div>
      <div className="p-3 flex flex-col flex-1 gap-1">
        <p className="text-xs text-slate-400 capitalize">{product.category?.replace('-', ' ')}</p>
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 flex-1">{product.name}</h3>
        {product.nameTi && <p className="text-xs text-slate-500 line-clamp-1">{product.nameTi}</p>}
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-base font-black text-rose-600">€{product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="ml-1 text-xs text-slate-400 line-through">€{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          {product.rating && <span className="text-xs text-amber-500 font-semibold">★ {product.rating}</span>}
        </div>
        <button onClick={addToCart} className="mt-2 w-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold py-2 rounded-xl transition-colors">
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
