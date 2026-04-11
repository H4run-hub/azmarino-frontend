'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Navbar from '../../../components/Navbar';

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
    <div className="min-h-screen">
      <Navbar />
      <main className="section-shell pb-16">
        <section className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="surface-panel rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
            <p className="eyebrow">Create membership</p>
            <h1 className="display-title mt-4 text-5xl text-[var(--ink-strong)] md:text-6xl">Start with an account that feels as considered as the storefront itself.</h1>
            <p className="soft-copy mt-4 max-w-2xl text-base">
              Create your Azmarino profile to save delivery details, verify your email, and keep your order history beautifully organized from the first purchase onward.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="metric-card">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Verification ready</p>
                <p className="mt-3 text-lg font-bold text-[var(--ink-strong)]">New accounts receive an email verification code so order updates stay secure and reliable.</p>
              </div>
              <div className="metric-card">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Checkout ready</p>
                <p className="mt-3 text-lg font-bold text-[var(--ink-strong)]">Once registered, your profile can flow straight into checkout and delivery tracking.</p>
              </div>
            </div>
          </div>

          <div className="surface-solid rounded-[2rem] p-6 md:p-8">
            <p className="eyebrow">Registration</p>
            <h2 className="mt-3 text-3xl font-black text-[var(--ink-strong)]">Create your account</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">A few essentials are all we need to prepare your profile and send your verification code.</p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
              <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Full name</span>
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Your full name"
                  className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="you@example.com"
                  className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Phone</span>
                <input
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  placeholder="+352 000 000 000"
                  className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Password</span>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Choose a secure password"
                  className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]"
                />
              </label>

              {error ? (
                <div className="rounded-[1.3rem] border border-[rgba(158,36,52,0.2)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent)]">
                  {error}
                </div>
              ) : null}

              <button type="submit" disabled={loading} className="button-primary mt-2 justify-center">
                {loading ? 'Creating your account...' : 'Create account'}
              </button>
            </form>

            <p className="mt-8 text-sm text-[var(--muted)]">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-bold text-[var(--accent)] transition hover:text-[var(--accent-strong)]">
                Sign in instead
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
