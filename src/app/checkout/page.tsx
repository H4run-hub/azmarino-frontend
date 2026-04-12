'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useLang } from '../../context/LanguageContext';
import type { CartItem } from '../../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

interface AddressForm {
  fullName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
}

interface CheckoutCartItem extends CartItem {
  selected?: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { t, lang } = useLang();
  const [items, setItems] = useState<CheckoutCartItem[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [address, setAddress] = useState<AddressForm>({
    fullName: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    phone: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('azmarino_token');
    const userRaw = localStorage.getItem('azmarino_user');
    const cart = JSON.parse(localStorage.getItem('azmarino_cart') || '[]') as CheckoutCartItem[];

    if (!token || !userRaw) {
      router.replace('/auth/login');
      return;
    }

    const selectedItems = cart.filter((item) => item.selected !== false);
    if (!selectedItems.length) {
      router.replace('/cart');
      return;
    }

    try {
      const user = JSON.parse(userRaw);
      setUserEmail(user.email || '');
      setUserId(user._id || user.id || null);
      setAddress({
        fullName: user.name || '',
        address: user.address?.street || '',
        city: user.address?.city || '',
        country: user.address?.country || '',
        postalCode: user.address?.postalCode || user.address?.zip || '',
        phone: user.phone || '',
      });
    } catch {
      router.replace('/auth/login');
      return;
    }

    setItems(selectedItems);
  }, [router]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );
  const shippingCost = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + shippingCost;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!address.fullName || !address.address || !address.city || !address.country) {
      setError(lang === 'en' ? 'Please complete the shipping form before continuing.' : 'በጃኹም ቅድሚ ምቕጻልኩም ናይ መብጻሕቲ ቅጥዒ ምልኡ።');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('azmarino_token');
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: userEmail,
          userId,
          items: items.map((item) => ({
            productId: item.product._id,
            name: item.product.name,
            nameTi: item.product.nameTi,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
            variantName: item.variantName,
            selectedVariantId: item.selectedVariantId,
          })),
          shippingAddress: address,
          subtotal,
          shippingCost,
          total,
          notes,
          paymentMethod: 'stripe',
          paymentStatus: 'pending',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || (lang === 'en' ? 'Could not create your order.' : 'ትእዛዝካ ክመሓላለፍ ኣይከኣለን።'));
      }

      const order = data.order || data.data;
      router.push(`/checkout/payment?order=${order._id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : (lang === 'en' ? 'Something went wrong while preparing payment.' : 'ክፍሊት ክዳሎ ከሎ ጸገም ተፈጢሩ።'));
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="py-40 flex justify-center">
           <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      
      <main className="section-container py-12">
        <header className="mb-12 border-b border-gray-100 pb-8">
          <p className="label-caps mb-2 text-gray-400">{t('trustPayment')}</p>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">{t('checkoutTitle')}</h1>
        </header>

        <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-8">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-black flex items-center gap-4">
                <span>01 {t('shippingDetails')}</span>
                <div className="h-px flex-1 bg-gray-100" />
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('fullName')}</label>
                  <input value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} className="input-base" required />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('streetAddress')}</label>
                  <input value={address.address} onChange={e => setAddress({...address, address: e.target.value})} className="input-base" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('city')}</label>
                  <input value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="input-base" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('postalCode')}</label>
                  <input value={address.postalCode} onChange={e => setAddress({...address, postalCode: e.target.value})} className="input-base" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('country')}</label>
                  <input value={address.country} onChange={e => setAddress({...address, country: e.target.value})} className="input-base" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('phone')}</label>
                  <input value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="input-base" required />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('orderNotes')}</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="input-base py-4 resize-none" placeholder={lang === 'en' ? 'e.g. Leave with neighbor...' : 'ንኣብነት፡ ምስ ጎረቤት ግደፎ...'} />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-black flex items-center gap-4">
                <span>02 {t('paymentMethod')}</span>
                <div className="h-px flex-1 bg-gray-100" />
              </h2>
              <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="w-full h-full object-contain" />
                   </div>
                   <div>
                      <p className="text-xs font-black uppercase tracking-widest">{t('securePayment')}</p>
                      <p className="text-[10px] font-medium text-gray-400 uppercase">{t('redirectStripe')}</p>
                   </div>
                </div>
                <div className="w-4 h-4 rounded-full border-4 border-black bg-white" />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold uppercase tracking-widest rounded-xl text-center">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-black w-full h-16 text-xs">
              {loading ? t('processing') : `${t('payNow')} — €${total.toFixed(2)}`}
            </button>
          </form>

          {/* Sidebar Summary */}
          <aside className="border border-gray-100 rounded-2xl bg-gray-50/50 p-8 sticky top-32">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-black mb-8 border-b border-gray-200 pb-4">{t('selections')}</h2>
            <div className="space-y-6 mb-8">
              {items.map(item => {
                const baseName = lang === 'ti' && item.product.nameTi ? item.product.nameTi : item.product.name;
                const displayName = item.variantName ? `${baseName} - ${item.variantName}` : baseName;
                
                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-12 h-16 overflow-hidden rounded-lg border border-gray-200 bg-white">
                      <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-[10px] font-black uppercase tracking-tight text-black line-clamp-1">{displayName}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Qty {item.quantity} · {item.selectedSize || 'OS'}</p>
                    </div>
                    <p className="text-[10px] font-black self-center">€{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-400">
                <span>{t('subtotal')}</span>
                <span className="text-black">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-400">
                <span>{t('shipping')}</span>
                <span className="text-black">{shippingCost === 0 ? t('complimentary') : `€${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between items-baseline">
                <span className="text-xs font-black uppercase tracking-widest text-black">{t('total')}</span>
                <span className="text-2xl font-black text-black tracking-tighter">€{total.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/cart" className="btn-outline w-full h-12 text-[9px] border-transparent bg-transparent hover:bg-gray-100 mt-6">
              {t('returnToCart')}
            </Link>
          </aside>

        </div>
      </main>
    </div>
  );
}
