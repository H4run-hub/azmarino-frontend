'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Navbar from '../../../components/Navbar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

export default function LoginPage() {
  const router = useRouter();
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
        throw new Error(payload.message || 'Login failed.');
      }

      localStorage.setItem('azmarino_token', payload.token);
      localStorage.setItem('azmarino_user', JSON.stringify(payload.user));
      window.dispatchEvent(new Event('cart-updated'));
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetRequest = async () => {
    if (!email) {
      setError('Enter your email above before requesting a reset link.');
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
    <div className="min-h-screen">
      <Navbar />
      <main className="section-shell pb-16">
        <section className="grid gap-8 xl:grid-cols-[0.95fr_minmax(0,1.05fr)]">
          <div className="surface-panel rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
            <p className="eyebrow">Member sign in</p>
            <h1 className="display-title mt-4 text-5xl text-[var(--ink-strong)] md:text-6xl">Return to a calmer, more premium shopping experience.</h1>
            <p className="soft-copy mt-4 max-w-2xl text-base">
              Sign in to continue checkout, review previous orders, and keep delivery tracking tied to your account.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="metric-card">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Fast checkout</p>
                <p className="mt-3 text-lg font-bold text-[var(--ink-strong)]">Your saved details flow straight into order creation and Stripe checkout.</p>
              </div>
              <div className="metric-card">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Order visibility</p>
                <p className="mt-3 text-lg font-bold text-[var(--ink-strong)]">Track status, payment progress, and delivery information from one account hub.</p>
              </div>
            </div>
          </div>

          <div className="surface-solid rounded-[2rem] p-6 md:p-8">
            <p className="eyebrow">Secure access</p>
            <h2 className="mt-3 text-3xl font-black text-[var(--ink-strong)]">Sign in to Azmarino</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">Use the email address linked to your orders to keep tracking and account settings in sync.</p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
              <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Password</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]"
                />
              </label>

              {error ? (
                <div className="rounded-[1.3rem] border border-[rgba(158,36,52,0.2)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent)]">
                  {error}
                </div>
              ) : null}

              {resetMessage ? (
                <div className="rounded-[1.3rem] border border-[rgba(176,134,74,0.25)] bg-[rgba(176,134,74,0.12)] px-4 py-3 text-sm text-[var(--ink)]">
                  {resetMessage}
                </div>
              ) : null}

              <button type="submit" disabled={loading} className="button-primary mt-2 justify-center">
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <button onClick={handleResetRequest} disabled={resetRequested} className="mt-4 text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]">
              {resetRequested ? 'Requesting reset link...' : 'Forgot your password? Request reset instructions'}
            </button>

            <p className="mt-8 text-sm text-[var(--muted)]">
              New to Azmarino?{' '}
              <Link href="/auth/register" className="font-bold text-[var(--accent)] transition hover:text-[var(--accent-strong)]">
                Create your account
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
