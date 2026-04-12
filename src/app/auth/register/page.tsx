'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Navbar from '../../../components/Navbar';
import { useLang } from '../../../context/LanguageContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const initialForm: RegisterForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
};

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLang();
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Registration failed.');
      }

      localStorage.setItem('azmarino_token', payload.token);
      localStorage.setItem('azmarino_user', JSON.stringify(payload.user));
      window.dispatchEvent(new Event('cart-updated'));
      router.push('/profile');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="section-container py-12">
        <section className="grid gap-8 lg:grid-cols-[1fr_450px]">
          <div className="bg-gray-50 border border-gray-100 rounded-3xl px-6 py-8 md:px-10 md:py-10 flex flex-col justify-center">
            <p className="label-caps mb-4 text-gray-400">{t('createMembership')}</p>
            <h1 className="heading-lg text-black mb-6">{t('registerTitle')}</h1>
            <p className="text-sm text-gray-500 font-medium max-w-2xl leading-relaxed mb-12">
              {t('registerSubtitle')}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-black mb-3">{t('verificationReady')}</p>
                <p className="text-[11px] font-medium text-gray-500 leading-relaxed">{t('verificationReadyDesc')}</p>
              </div>
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-black mb-3">{t('checkoutReady')}</p>
                <p className="text-[11px] font-medium text-gray-500 leading-relaxed">{t('checkoutReadyDesc')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-sm flex flex-col justify-center">
            <p className="label-caps mb-2 text-gray-400">{t('registration')}</p>
            <h2 className="text-3xl font-black text-black uppercase tracking-tighter mb-4">{t('createAccount')}</h2>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-tight mb-10 leading-relaxed">{t('registerEmailDesc')}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('fullNameLabel')}</span>
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Your full name"
                  className="input-base"
                />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('email')}</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="you@example.com"
                  className="input-base"
                />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('phoneLabel')}</span>
                <input
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  placeholder="+352 000 000 000"
                  className="input-base"
                />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('password')}</span>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="••••••••"
                  className="input-base"
                />
              </div>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold uppercase tracking-widest rounded-xl text-center">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-black w-full h-14 text-xs">
                {loading ? t('creatingAccount') : t('createAccount')}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {t('alreadyHaveAccount')} <Link href="/auth/login" className="text-black hover:underline ml-2">{t('signInInstead')}</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
