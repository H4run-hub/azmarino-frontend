'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useLang } from '../../context/LanguageContext';
import { CloseIcon } from '../../components/Icons';
import type { Product } from '../../lib/api';

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selected?: boolean;
  selectedSize?: string;
  selectedColor?: string;
}

export default function CartPage() {
  const { t } = useLang();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = () => {
      const stored = JSON.parse(localStorage.getItem('azmarino_cart') || '[]') as CartItem[];
      setCart(stored);
    };
    loadCart();
    window.addEventListener('cart-updated', loadCart);
    return () => window.removeEventListener('cart-updated', loadCart);
  }, []);

  const saveCart = (nextCart: CartItem[]) => {
    localStorage.setItem('azmarino_cart', JSON.stringify(nextCart));
    window.dispatchEvent(new Event('cart-updated'));
    setCart(nextCart);
  };

  const updateQuantity = (id: string, delta: number) => {
    saveCart(
      cart.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)
    );
  };

  const removeItem = (id: string) => {
    saveCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="section-container py-12">
        <header className="mb-12 border-b border-gray-100 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="label-caps mb-2 text-gray-400">{t('cart')}</p>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">Your Selection</h1>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
          </p>
        </header>

        {cart.length === 0 ? (
          <div className="py-24 text-center">
            <h2 className="heading-lg text-gray-200 mb-8 italic">Your cart is currently empty</h2>
            <Link href="/products" className="btn-black inline-flex">{t('exploreBtn')}</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">
            
            {/* Items List */}
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-6 p-4 border border-gray-100 rounded-2xl bg-white hover:border-gray-200 transition-all group">
                  <div className="relative aspect-[3/4] w-24 sm:w-32 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                    <Image src={item.product?.image || '/logo.jpg'} alt={item.product?.name || 'Product'} fill className="object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="label-caps mb-1 text-gray-400">{(item.product?.category || 'Collection').replace(/-/g, ' ')}</p>
                        <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-black leading-tight mb-2">{item.product?.name}</h2>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          {item.selectedSize && <p className="text-[10px] font-bold text-gray-400 uppercase">Size: <span className="text-black">{item.selectedSize}</span></p>}
                          {item.selectedColor && <p className="text-[10px] font-bold text-gray-400 uppercase">Color: <span className="text-black">{item.selectedColor}</span></p>}
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="p-1 hover:text-rose-600 transition-colors">
                        <CloseIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex justify-between items-center">
                      <div className="flex items-center border border-gray-200 h-10 bg-gray-50 rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-full hover:bg-white transition-colors font-bold">−</button>
                        <span className="w-8 text-center text-[10px] font-black">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-full hover:bg-white transition-colors font-bold">+</button>
                      </div>
                      <p className="font-black text-black">€{(item.product?.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Aside */}
            <aside className="border border-gray-100 rounded-2xl bg-gray-50/50 p-8 sticky top-32">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-black mb-8 border-b border-gray-200 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-black">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  <span>Shipping</span>
                  <span className="text-black">{shipping === 0 ? 'Complimentary' : `€${shipping.toFixed(2)}`}</span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between items-baseline">
                  <span className="text-xs font-black uppercase tracking-widest text-black">Total</span>
                  <span className="text-2xl font-black text-black tracking-tighter">€{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/checkout" className="btn-black w-full h-14 text-xs">
                  Proceed to Checkout
                </Link>
                <Link href="/products" className="btn-outline w-full h-14 text-xs border-transparent bg-transparent hover:bg-gray-100">
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 grid grid-cols-3 gap-4 grayscale opacity-40">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 mx-auto" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 mx-auto" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4 mx-auto" />
              </div>
            </aside>

          </div>
        )}
      </main>
    </div>
  );
}
