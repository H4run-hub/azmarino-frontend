'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Navbar from '../../../components/Navbar';
import { useLang } from '../../../context/LanguageContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetRequested, setResetRequested] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || t('loginError') || 'Login failed.');
      }

      localStorage.setItem('azmarino_token', payload.token);
      localStorage.setItem('azmarino_user', JSON.stringify(payload.user));
      window.dispatchEvent(new Event('cart-updated'));
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : (t('loginError') || 'Login failed.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetRequest = async () => {
    if (!email) {
      setError(t('enterEmailReset'));
      return;
    }

    setResetRequested(true);
    setError('');
    setResetMessage('');

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Could not request a reset link.');
      }

      setResetMessage(payload.message || 'If your account exists, reset instructions have been sent.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not request a reset link.');
    } finally {
      setResetRequested(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="section-container py-12">
        <section className="grid gap-8 lg:grid-cols-[1fr_450px]">
          <div className="bg-gray-50 border border-gray-100 rounded-3xl px-6 py-8 md:px-10 md:py-10 flex flex-col justify-center">
            <p className="label-caps mb-4 text-gray-400">{t('memberSignIn')}</p>
            <h1 className="heading-lg text-black mb-6">{t('loginTitle')}</h1>
            <p className="text-sm text-gray-500 font-medium max-w-2xl leading-relaxed mb-12">
              {t('loginSubtitle')}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-black mb-3">{t('fastCheckout')}</p>
                <p className="text-[11px] font-medium text-gray-500 leading-relaxed">{t('fastCheckoutDesc')}</p>
              </div>
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-black mb-3">{t('orderVisibility')}</p>
                <p className="text-[11px] font-medium text-gray-500 leading-relaxed">{t('orderVisibilityDesc')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-sm flex flex-col justify-center">
            <p className="label-caps mb-2 text-gray-400">{t('secureAccess')}</p>
            <h2 className="text-3xl font-black text-black uppercase tracking-tighter mb-4">{t('signInToAzmarino')}</h2>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-tight mb-10 leading-relaxed">{t('loginEmailDesc')}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('email')}</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="input-base"
                />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('password')}</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="input-base"
                />
              </div>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold uppercase tracking-widest rounded-xl text-center">
                  {error}
                </div>
              )}

              {resetMessage && (
                <div className="p-4 bg-green-50 border border-green-100 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-xl text-center">
                  {resetMessage}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-black w-full h-14 text-xs">
                {loading ? t('signingIn') : t('signIn')}
              </button>
            </form>

            <button onClick={handleResetRequest} disabled={resetRequested} className="mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors text-center">
              {resetRequested ? t('requestingReset') : t('forgotPassword')}
            </button>

            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {t('newToAzmarino')} <Link href="/auth/register" className="text-black hover:underline ml-2">{t('createAccount')}</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
