'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

const INPUT_CLS = "w-full border border-gray-200 rounded-none px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white";
const LABEL_CLS = "block text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      localStorage.setItem('azmarino_token', data.token);
      localStorage.setItem('azmarino_user', JSON.stringify(data.user));
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const fields: Array<[keyof typeof form, string, string, string]> = [
    ['name', 'Name', 'text', 'Your full name'],
    ['email', 'Email', 'email', 'you@example.com'],
    ['phone', 'Phone', 'tel', '+49 123 456 7890'],
    ['password', 'Password', 'password', '••••••••'],
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="bg-white border border-gray-100 p-6">
            <h1 className="text-xs font-black uppercase tracking-[0.3em] text-rose-600">Join Azmarino</h1>
            <h2 className="text-2xl font-black text-black uppercase tracking-tighter mb-1">Create Account</h2>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-5">Premium global shopping</p>
            {error && <div className="border border-rose-600 text-rose-600 text-[10px] font-black uppercase tracking-widest p-2 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-3">
              {fields.map(([key, label, type, ph]) => (
                <div key={key}>
                  <label className={LABEL_CLS}>{label}</label>
                  <input type={type} required={key !== 'phone'} value={form[key]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))}
                    className={INPUT_CLS} placeholder={ph} />
                </div>
              ))}
              <button type="submit" disabled={loading}
                className="w-full bg-black hover:bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-none disabled:opacity-50 transition-colors">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <p className="text-center text-[9px] font-black uppercase tracking-widest text-gray-400 mt-4">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-rose-600 hover:text-black transition-colors">Sign In</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
