'use client';

import Image from 'next/image';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import ProductCard from '../../../components/ProductCard';
import type { Product } from '../../../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

interface ProductWithMedia extends Product {
  videos?: string[];
}

interface Review {
  _id?: string;
  id?: string;
  name?: string;
  date?: string;
  rating?: number;
  comment?: string;
}

interface ProductResponse {
  data?: ProductWithMedia;
}

interface ProductListResponse {
  products?: Product[];
  data?: Product[];
}

interface ReviewResponse {
  reviews?: Review[];
}

interface StoredCartItem {
  id: string;
  product: ProductWithMedia;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selected?: boolean;
}

const formatPrice = (value: number) => `EUR ${value.toFixed(2)}`;

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<ProductWithMedia | null>(null);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const productResponse = await fetch(`${API_URL}/products/${id}`);
        const productData = (await productResponse.json()) as ProductResponse;
        const nextProduct = (productData.data || productData) as ProductWithMedia;

        if (cancelled) return;
        setProduct(nextProduct);

        const [reviewResponse, relatedResponse] = await Promise.all([
          fetch(`${API_URL}/reviews/${id}`),
          fetch(`${API_URL}/products?category=${nextProduct.category}&limit=6`),
        ]);

        const reviewData = (await reviewResponse.json()) as ReviewResponse;
        const relatedData = (await relatedResponse.json()) as ProductListResponse;

        if (cancelled) return;
        setReviews(reviewData.reviews || []);
        setRecommended((relatedData.products || relatedData.data || []).filter((item: Product) => item._id !== id).slice(0, 4));
      } catch {
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const addToCart = () => {
    if (!product) {
      return;
    }

    if (product?.sizes?.length && !selectedSize) {
      setError('Please choose a size before adding this product.');
      return;
    }
    if (product?.colors?.length && !selectedColor) {
      setError('Please choose a color before adding this product.');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]') as StoredCartItem[];
    const itemId = `${product?._id}|${selectedSize || 'default'}|${selectedColor || 'default'}`;
    const existing = cart.find((item) => item.id === itemId);

    if (existing) existing.quantity += quantity;
    else {
      cart.push({
        id: itemId,
        product,
        quantity,
        selectedSize,
        selectedColor,
        selected: true,
      });
    }

    localStorage.setItem('azmarino_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    setError('');
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="section-shell py-16">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="surface-solid aspect-[4/5] animate-pulse rounded-[2rem]" />
            <div className="surface-solid min-h-[32rem] animate-pulse rounded-[2rem]" />
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="section-shell py-16">
          <div className="surface-solid rounded-[2rem] px-6 py-14 text-center">
            <p className="eyebrow">Unavailable</p>
            <h1 className="display-title mt-4 text-4xl text-[var(--ink-strong)]">This product could not be loaded.</h1>
            <Link href="/products" className="button-primary mt-8">
              Back to catalogue
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const gallery = [product.image, ...(product.images || [])].filter(Boolean) as string[];
  const discount = product.discount || (
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="section-shell pb-16">
        <nav className="flex flex-wrap items-center gap-2 py-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/products">Products</Link>
          <span>/</span>
          <span className="text-[var(--ink-strong)]">{product.category?.replace(/-/g, ' ')}</span>
        </nav>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
          <div className="space-y-4">
            <div className="surface-solid overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#f8f1e8,#ecdfd1)]">
              <div className="relative aspect-[4/5]">
                <Image
                  src={gallery[selectedImage] || '/logo.jpg'}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((image, index) => (
                  <button
                    key={image + index}
                    onClick={() => setSelectedImage(index)}
                    className={`surface-solid relative aspect-square overflow-hidden rounded-[1.4rem] ${
                      selectedImage === index ? 'ring-2 ring-[var(--accent)]' : ''
                    }`}
                  >
                    <Image src={image} alt="" fill className="object-cover" sizes="160px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="surface-panel rounded-[2rem] px-6 py-7 md:px-8 md:py-8">
            <p className="eyebrow">{product.category?.replace(/-/g, ' ')}</p>
            <h1 className="display-title mt-4 text-5xl text-[var(--ink-strong)] md:text-6xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
              {product.rating ? <span>{product.rating.toFixed(1)} rating</span> : null}
              <span>{reviews.length || product.reviews || 0} reviews</span>
              <span>{product.stock && product.stock > 0 ? 'Available now' : 'Limited stock'}</span>
            </div>

            <div className="mt-6 flex items-end gap-3 border-y border-[var(--line)] py-5">
              <span className="text-3xl font-extrabold text-[var(--ink-strong)]">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price ? (
                <span className="text-sm font-medium text-[var(--muted)] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              ) : null}
              {discount > 0 ? (
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[var(--accent)]">
                  Save {discount}%
                </span>
              ) : null}
            </div>

            <p className="soft-copy mt-6 text-base">
              {product.description || 'A carefully selected product from the Azmarino catalogue.'}
            </p>

            {product.sizes?.length ? (
              <div className="mt-8">
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--muted)]">Select size</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-full px-4 py-3 text-xs font-extrabold uppercase tracking-[0.18em] transition ${
                        selectedSize === size
                          ? 'bg-[var(--ink-strong)] text-white'
                          : 'border border-[var(--line)] bg-white/72 text-[var(--ink-strong)]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {product.colors?.length ? (
              <div className="mt-6">
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--muted)]">Select color</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-full px-4 py-3 text-xs font-extrabold uppercase tracking-[0.18em] transition ${
                        selectedColor === color
                          ? 'bg-[var(--accent)] text-white'
                          : 'border border-[var(--line)] bg-white/72 text-[var(--ink-strong)]'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="inline-flex items-center rounded-full border border-[var(--line)] bg-white/72">
                <button onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="px-4 py-3 text-sm font-bold">
                  -
                </button>
                <span className="min-w-10 px-2 text-center text-sm font-extrabold">{quantity}</span>
                <button onClick={() => setQuantity((current) => current + 1)} className="px-4 py-3 text-sm font-bold">
                  +
                </button>
              </div>

              <button
                onClick={addToCart}
                className={`button-primary min-w-[16rem] ${added ? 'opacity-90' : ''}`}
              >
                {added ? 'Added to cart' : 'Add to cart'}
              </button>
            </div>

            {error ? (
              <div className="mt-5 rounded-[1.2rem] border border-[rgba(158,36,52,0.2)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent)]">
                {error}
              </div>
            ) : null}

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.3rem] border border-[var(--line)] bg-white/72 p-4">
                <p className="text-sm font-bold text-[var(--ink-strong)]">Secure checkout</p>
                <p className="mt-2 text-sm text-[var(--muted)]">Stripe-backed payment and transparent order totals.</p>
              </div>
              <div className="rounded-[1.3rem] border border-[var(--line)] bg-white/72 p-4">
                <p className="text-sm font-bold text-[var(--ink-strong)]">Delivery clarity</p>
                <p className="mt-2 text-sm text-[var(--muted)]">Tracked dispatch with practical delivery estimates.</p>
              </div>
              <div className="rounded-[1.3rem] border border-[var(--line)] bg-white/72 p-4">
                <p className="text-sm font-bold text-[var(--ink-strong)]">Customer-first returns</p>
                <p className="mt-2 text-sm text-[var(--muted)]">Straightforward support if the fit is not right.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <p className="eyebrow">Reviews</p>
            <h2 className="display-title mt-3 text-4xl text-[var(--ink-strong)]">What customers are saying</h2>

            <div className="mt-6 space-y-4">
              {reviews.length ? (
                reviews.map((review, index) => (
                  <article key={review._id || review.id || `${review.name || 'review'}-${index}`} className="surface-solid rounded-[1.6rem] p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-[var(--ink-strong)]">{review.name || 'Customer'}</p>
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{review.date || 'Verified review'}</p>
                      </div>
                      <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-extrabold text-[var(--accent)]">
                        {review.rating || 5}/5
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{review.comment || 'No written feedback yet.'}</p>
                  </article>
                ))
              ) : (
                <div className="surface-solid rounded-[1.6rem] p-6 text-sm text-[var(--muted)]">
                  Reviews will appear here as customers purchase and share feedback.
                </div>
              )}
            </div>
          </div>

          <div className="surface-panel rounded-[1.8rem] p-6">
            <p className="eyebrow">Details</p>
            <div className="mt-4 space-y-5">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Category</p>
                <p className="mt-2 text-sm font-semibold text-[var(--ink-strong)]">{product.category?.replace(/-/g, ' ')}</p>
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Availability</p>
                <p className="mt-2 text-sm font-semibold text-[var(--ink-strong)]">
                  {product.stock && product.stock > 0 ? `${product.stock} units available` : 'Check support for availability'}
                </p>
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Delivery promise</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Orders are processed with tracked dispatch and can be followed inside your Azmarino account.
                </p>
              </div>
            </div>
          </div>
        </section>

        {recommended.length ? (
          <section className="mt-16">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Related edit</p>
                <h2 className="display-title mt-3 text-4xl text-[var(--ink-strong)]">You may also like</h2>
              </div>
              <Link href="/products" className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
                Explore more
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {recommended.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
