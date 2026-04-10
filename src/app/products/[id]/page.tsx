'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
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
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('azmarino_token'));
    fetch(`${API_URL}/products/${id}`)
      .then(r => r.json())
      .then(d => {
        // Handle both wrapped and unwrapped responses
        const p = d.data || d;
        setProduct(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    fetch(`${API_URL}/reviews/product/${id}`)
      .then(r => r.json())
      .then(d => setReviews(Array.isArray(d) ? d : d.reviews || []))
      .catch(() => {});
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid md:grid-cols-2 gap-10 animate-pulse">
            <div className="space-y-3">
              <div className="aspect-square bg-gray-100 rounded-2xl" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => <div key={i} className="w-16 h-16 bg-gray-100 rounded-xl" />)}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-100 rounded w-1/4" />
              <div className="h-8 bg-gray-100 rounded w-3/4" />
              <div className="h-10 bg-gray-100 rounded w-1/3" />
              <div className="h-24 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <p className="text-gray-500 text-lg">Product not found.</p>
          <Link href="/products" className="bg-rose-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-rose-700 transition-colors">
            Back to Shop
          </Link>
        </div>
      </>
    );
  }

  const allImages = [product.image, ...(product.images || [])].filter(Boolean) as string[];
  const allVideos = product.videos || [];

  // Combined media: images first, then videos
  type MediaItem = { type: 'image'; src: string } | { type: 'video'; src: string };
  const allMedia: MediaItem[] = [
    ...allImages.map(src => ({ type: 'image' as const, src })),
    ...allVideos.map(src => ({ type: 'video' as const, src })),
  ];

  const currentMedia = allMedia[selectedMedia] || { type: 'image' as const, src: '/placeholder.jpg' };

  const discount = product.discount || (product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating;

  const addToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]');
    const key = `${product._id}|size:${selectedSize}|color:${selectedColor}`;
    const existing = cart.find((i: any) => i.id === key);
    if (existing) { existing.quantity += quantity; }
    else { cart.push({ id: key, product, quantity, selectedSize, selectedColor, selected: true }); }
    localStorage.setItem('azmarino_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('azmarino_token');
    if (!token) return router.push('/auth/login');
    setSubmittingReview(true);
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ product: id, rating: reviewRating, comment: reviewText }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews(prev => [newReview, ...prev]);
        setReviewText('');
        setReviewRating(5);
      }
    } finally { setSubmittingReview(false); }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-rose-600 transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-xs capitalize">{product.category?.replace(/-/g, ' ')}</span>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-14 mb-16">
          {/* Media Gallery */}
          <div className="space-y-3">
            {/* Main media */}
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
              {currentMedia.type === 'video' ? (
                <video
                  src={currentMedia.src}
                  controls
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={currentMedia.src}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              )}
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-rose-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {allMedia.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {allMedia.map((media, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedMedia(i); setMediaType(media.type); }}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedMedia === i ? 'border-rose-600 ring-1 ring-rose-600' : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    {media.type === 'video' ? (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    ) : (
                      <Image src={media.src} alt="" fill className="object-cover" sizes="64px" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm text-rose-600 font-bold uppercase tracking-wider mb-1">{product.category?.replace(/-/g, ' ')}</p>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">{product.name}</h1>
              {product.nameTi && <p className="text-gray-500 mt-1">{product.nameTi}</p>}
            </div>

            {/* Rating */}
            {(avgRating || product.rating) && (
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={s <= Math.round(Number(avgRating || product.rating)) ? 'text-amber-400' : 'text-gray-200'}>★</span>
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">{avgRating || product.rating}</span>
                {reviews.length > 0 && <span className="text-sm text-gray-400">({reviews.length} reviews)</span>}
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 py-2 border-y border-gray-100">
              <span className="text-3xl font-black text-gray-900">€{product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">€{product.originalPrice.toFixed(2)}</span>
                  <span className="bg-rose-50 text-rose-600 text-sm font-bold px-2 py-0.5 rounded-lg">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Description */}
            {(product.description || product.descriptionTi) && (
              <div className="text-sm text-gray-600 leading-relaxed space-y-1">
                {product.description && <p>{product.description}</p>}
                {product.descriptionTi && <p className="text-gray-500 italic">{product.descriptionTi}</p>}
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-gray-800">Size</p>
                  {selectedSize && <p className="text-sm text-rose-600 font-medium">{selectedSize} selected</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                        selectedSize === size
                          ? 'border-rose-600 bg-rose-600 text-white'
                          : 'border-gray-200 text-gray-700 hover:border-gray-900'
                      }`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-gray-800">Color</p>
                  {selectedColor && <p className="text-sm text-rose-600 font-medium">{selectedColor}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button key={color} onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                        selectedColor === color
                          ? 'border-rose-600 bg-rose-600 text-white'
                          : 'border-gray-200 text-gray-700 hover:border-gray-900'
                      }`}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Stock */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-11 h-11 text-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center">−</button>
                <span className="w-12 text-center font-bold text-gray-900 text-base">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}
                  className="w-11 h-11 text-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center">+</button>
              </div>
              {product.stock !== undefined && product.stock <= 10 && product.stock > 0 && (
                <p className="text-sm text-amber-600 font-semibold">Only {product.stock} left!</p>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <button onClick={addToCart}
                className={`flex-1 py-3.5 rounded-xl font-bold text-base transition-all ${
                  added ? 'bg-green-500 text-white' : 'bg-gray-900 hover:bg-black text-white'
                }`}>
                {added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
              <Link href="/cart" onClick={addToCart}
                className="flex-1 py-3.5 rounded-xl font-bold text-base border-2 border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white transition-all text-center">
                Buy Now
              </Link>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100 text-center">
              {[['🚚', 'Free EU Delivery'], ['🔒', 'Secure Payment'], ['↩️', '30-Day Returns']].map(([icon, text]) => (
                <div key={text} className="flex flex-col items-center gap-1">
                  <span className="text-xl">{icon}</span>
                  <span className="text-xs text-gray-500 font-medium leading-tight">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="max-w-2xl border-t border-gray-100 pt-10">
          <h2 className="text-xl font-black text-gray-900 mb-6">
            Customer Reviews
            {reviews.length > 0 && <span className="ml-2 text-base font-medium text-gray-400">({reviews.length})</span>}
          </h2>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-gray-800 mb-4">Write a Review</h3>
            {!isLoggedIn ? (
              <p className="text-sm text-gray-500">
                <Link href="/auth/login" className="text-rose-600 font-semibold hover:underline">Sign in</Link> to leave a review.
              </p>
            ) : (
              <form onSubmit={submitReview} className="space-y-4">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} type="button" onClick={() => setReviewRating(star)}
                      className={`text-2xl transition-colors hover:scale-110 ${star <= reviewRating ? 'text-amber-400' : 'text-gray-300'}`}>★</button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">{reviewRating} / 5</span>
                </div>
                <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                  placeholder="Share your experience..." rows={3} maxLength={1000} required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-500" />
                <button type="submit" disabled={submittingReview}
                  className="bg-rose-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-rose-700 disabled:opacity-50 transition-colors">
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>

          {reviews.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, i) => (
                <div key={review._id || i} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm">
                        {(review.user?.name || 'C')[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800 text-sm">{review.user?.name || 'Customer'}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                    </span>
                  </div>
                  <div className="flex text-amber-400 text-sm mb-2">
                    {[1,2,3,4,5].map(s => <span key={s} className={s <= review.rating ? 'text-amber-400' : 'text-gray-200'}>★</span>)}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
