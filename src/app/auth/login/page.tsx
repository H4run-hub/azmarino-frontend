'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

const INPUT_CLS = "w-full border border-gray-200 rounded-none px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white";
const LABEL_CLS = "block text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('azmarino_token', data.token);
      localStorage.setItem('azmarino_user', JSON.stringify(data.user));
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="bg-white border border-gray-100 p-6">
            <h1 className="text-xs font-black uppercase tracking-[0.3em] text-rose-600">Welcome Back</h1>
            <h2 className="text-2xl font-black text-black uppercase tracking-tighter mb-1">Sign In</h2>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-5">Access your account</p>
            {error && <div className="border border-rose-600 text-rose-600 text-[10px] font-black uppercase tracking-widest p-2 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={LABEL_CLS}>Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className={INPUT_CLS} placeholder="you@example.com" />
              </div>
              <div>
                <label className={LABEL_CLS}>Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className={INPUT_CLS} placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-black hover:bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-none disabled:opacity-50 transition-colors">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <p className="text-center text-[9px] font-black uppercase tracking-widest text-gray-400 mt-4">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-rose-600 hover:text-black transition-colors">Sign Up</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
