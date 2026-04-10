'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import type { Product } from '../../../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
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
      .then(d => { setProduct(d); setLoading(false); })
      .catch(() => setLoading(false));
    fetch(`${API_URL}/reviews/product/${id}`)
      .then(r => r.json())
      .then(d => setReviews(Array.isArray(d) ? d : d.reviews || []))
      .catch(() => {});
  }, [id]);

  const allImages = product ? [product.image, ...(product.images || [])].filter(Boolean) : [];

  const addToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]');
    const key = `${product._id}|size:${selectedSize}|color:${selectedColor}`;
    const existing = cart.find((i: any) => i.id === key);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ id: key, product, quantity, selectedSize, selectedColor, selected: true });
    }
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
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-10 animate-pulse">
            <div className="aspect-square bg-slate-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-8 bg-slate-200 rounded w-3/4" />
              <div className="h-6 bg-slate-200 rounded w-1/3" />
              <div className="h-24 bg-slate-200 rounded" />
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
          <p className="text-slate-500">Product not found.</p>
          <Link href="/products" className="text-rose-600 font-semibold hover:underline">Back to Shop</Link>
        </div>
      </>
    );
  }

  const discount = product.discount || (product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-rose-600 transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-slate-600 truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <div className="space-y-3">
            <div className="relative aspect-square bg-slate-100 rounded-2xl overflow-hidden">
              <Image
                src={allImages[selectedImage] || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-rose-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-rose-600' : 'border-transparent'
                    }`}
                  >
                    <Image src={img || '/placeholder.jpg'} alt="" fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-400 capitalize">{product.category?.replace('-', ' ')}</p>
            <div>
              <h1 className="text-2xl font-black text-slate-900">{product.name}</h1>
              {product.nameTi && <p className="text-slate-500 mt-1">{product.nameTi}</p>}
            </div>

            {(avgRating || product.rating) && (
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-lg">{'★'.repeat(Math.round(Number(avgRating || product.rating)))}</span>
                <span className="text-sm font-semibold text-slate-700">{avgRating || product.rating}</span>
                {reviews.length > 0 && <span className="text-sm text-slate-400">({reviews.length} reviews)</span>}
              </div>
            )}

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-rose-600">€{product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-slate-400 line-through">€{product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            {(product.description || product.descriptionTi) && (
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 leading-relaxed space-y-2">
                {product.description && <p>{product.description}</p>}
                {product.descriptionTi && <p className="text-slate-500">{product.descriptionTi}</p>}
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${
                        selectedSize === size
                          ? 'border-rose-600 bg-rose-50 text-rose-700'
                          : 'border-slate-200 text-slate-700 hover:border-rose-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Color</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${
                        selectedColor === color
                          ? 'border-rose-600 bg-rose-50 text-rose-700'
                          : 'border-slate-200 text-slate-700 hover:border-rose-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-slate-700">Qty</p>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 text-lg font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >-</button>
                <span className="w-10 text-center font-semibold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 text-lg font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >+</button>
              </div>
              {product.stock !== undefined && (
                <span className="text-sm text-slate-400">{product.stock} in stock</span>
              )}
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={addToCart}
                className={`flex-1 py-3 rounded-xl font-bold text-base transition-all ${
                  added ? 'bg-green-500 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                {added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
              <Link
                href="/cart"
                onClick={addToCart}
                className="px-6 py-3 rounded-xl font-bold text-base border-2 border-rose-600 text-rose-600 hover:bg-rose-50 transition-colors"
              >
                Buy Now
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-2 pt-4 border-t border-slate-100">
              <span>🚚 Free EU Delivery</span>
              <span>🔒 Secure Payment</span>
              <span>↩️ Easy Returns</span>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="max-w-2xl">
          <h2 className="text-xl font-black text-slate-900 mb-6">Customer Reviews</h2>
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-8">
            <h3 className="font-semibold text-slate-800 mb-4">Write a Review</h3>
            {!isLoggedIn ? (
              <p className="text-sm text-slate-500">
                <Link href="/auth/login" className="text-rose-600 font-semibold hover:underline">Sign in</Link> to leave a review.
              </p>
            ) : (
              <form onSubmit={submitReview} className="space-y-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" onClick={() => setReviewRating(star)}
                      className={`text-2xl transition-colors ${star <= reviewRating ? 'text-amber-400' : 'text-slate-300'}`}>
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows={3}
                  maxLength={1000}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button type="submit" disabled={submittingReview}
                  className="bg-rose-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-rose-700 disabled:opacity-50 transition-colors">
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
          {reviews.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, i) => (
                <div key={review._id || i} className="bg-white rounded-2xl border border-slate-100 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-800">{review.user?.name || 'Customer'}</span>
                    <span className="text-xs text-slate-400">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <div className="text-amber-400 text-sm mb-2">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                  <p className="text-sm text-slate-600">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
