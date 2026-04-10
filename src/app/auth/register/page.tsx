'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <h1 className="text-2xl font-black text-slate-800 mb-2">Create Account</h1>
            <p className="text-slate-500 text-sm mb-6">Join the Azmarino community</p>
            {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              {[['name','Name','text','Your full name'],['email','Email','email','you@example.com'],['phone','Phone','tel','+49 123 456 7890'],['password','Password','password','••••••••']].map(([key,label,type,ph]) => (
                <div key={key}>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">{label}</label>
                  <input type={type} required={key !== 'phone'} value={(form as any)[key]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder={ph} />
                </div>
              ))}
              <button type="submit" disabled={loading}
                className="w-full bg-rose-600 text-white font-bold py-3 rounded-xl hover:bg-rose-700 disabled:opacity-50 transition-colors">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <p className="text-center text-sm text-slate-500 mt-4">
              Already have an account? <Link href="/auth/login" className="text-rose-600 font-semibold hover:text-rose-700">Sign In</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
