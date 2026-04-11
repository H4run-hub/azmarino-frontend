'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import type { User } from '../../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

const INPUT_CLS = "w-full px-3 py-2.5 rounded-none border border-gray-200 text-xs font-bold focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white";
const LABEL_CLS = "block text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    country: '',
    postalCode: '',
  });
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [changingPassword, setChangingPassword] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('azmarino_token');
    if (!token) { router.replace('/auth/login'); return; }

    fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => {
        if (r.status === 401) { router.replace('/auth/login'); return null; }
        return r.json();
      })
      .then(d => {
        if (!d) return;
        setUser(d);
        setForm({
          name: d.name || '',
          phone: d.phone || '',
          street: d.address?.street || '',
          city: d.address?.city || '',
          country: d.address?.country || '',
          postalCode: d.address?.postalCode || '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    const token = localStorage.getItem('azmarino_token');
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: { street: form.street, city: form.city, country: form.country, postalCode: form.postalCode },
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || 'Update failed');
      }
      const updated = await res.json();
      setUser(updated);
      localStorage.setItem('azmarino_user', JSON.stringify(updated));
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (passwordForm.next !== passwordForm.confirm) {
      setPwError('New passwords do not match.');
      return;
    }
    if (passwordForm.next.length < 6) {
      setPwError('Password must be at least 6 characters.');
      return;
    }
    setChangingPassword(true);
    const token = localStorage.getItem('azmarino_token');
    try {
      const res = await fetch(`${API_URL}/users/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passwordForm.current, newPassword: passwordForm.next }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || 'Password change failed');
      }
      setPwSuccess('Password changed successfully');
      setPasswordForm({ current: '', next: '', confirm: '' });
      setTimeout(() => setPwSuccess(''), 3000);
    } catch (err: any) {
      setPwError(err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('azmarino_token');
    localStorage.removeItem('azmarino_user');
    window.dispatchEvent(new Event('cart-updated'));
    router.push('/');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-6 h-6 border-2 border-black border-t-transparent rounded-none" />
        </div>
      </>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-2 sm:px-4 lg:px-6 py-6 w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xs font-black uppercase tracking-[0.3em] text-rose-600">Account</h1>
          <h2 className="text-2xl font-black text-black uppercase tracking-tighter">My Profile</h2>
          <div className="h-px flex-1 bg-gray-100" />
        </div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{user.email}</p>
          <div className="flex items-center gap-4">
            <Link href="/orders" className="text-[10px] font-black uppercase tracking-widest text-black hover:text-rose-600 transition-colors">
              My Orders
            </Link>
            <button
              onClick={handleLogout}
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-rose-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Verification Banner */}
        {!user.emailVerified && (
          <div className="border border-rose-600 text-rose-600 px-3 py-2 text-[10px] font-black uppercase tracking-widest mb-4">
            Please verify your email address. Check your inbox for a verification link.
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-1.5">
          <div className="bg-white border border-gray-100 p-4 space-y-3">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600">Personal Information</h2>

            <div>
              <label className={LABEL_CLS}>Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                className={INPUT_CLS}
              />
            </div>

            <div>
              <label className={LABEL_CLS}>Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className={`${INPUT_CLS} bg-gray-50 text-gray-400`}
              />
            </div>

            <div>
              <label className={LABEL_CLS}>Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+49 123 456789"
                className={INPUT_CLS}
              />
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-4 space-y-3">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600">Shipping Address</h2>

            <div>
              <label className={LABEL_CLS}>Street Address</label>
              <input
                type="text"
                value={form.street}
                onChange={e => setForm(f => ({ ...f, street: e.target.value }))}
                placeholder="123 Main Street"
                className={INPUT_CLS}
              />
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className={LABEL_CLS}>City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  placeholder="Berlin"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Postal Code</label>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))}
                  placeholder="10115"
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div>
              <label className={LABEL_CLS}>Country</label>
              <input
                type="text"
                value={form.country}
                onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                placeholder="Germany"
                className={INPUT_CLS}
              />
            </div>
          </div>

          {error && <div className="border border-rose-600 text-rose-600 px-3 py-2 text-[10px] font-black uppercase tracking-widest">{error}</div>}
          {success && <div className="border border-black text-black px-3 py-2 text-[10px] font-black uppercase tracking-widest">{success}</div>}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-black hover:bg-rose-600 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-none transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {/* Change Password */}
        <form onSubmit={handleChangePassword} className="mt-6 bg-white border border-gray-100 p-4 space-y-3">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600">Change Password</h2>
          <div>
            <label className={LABEL_CLS}>Current Password</label>
            <input
              type="password"
              value={passwordForm.current}
              onChange={e => setPasswordForm(f => ({ ...f, current: e.target.value }))}
              required
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>New Password</label>
            <input
              type="password"
              value={passwordForm.next}
              onChange={e => setPasswordForm(f => ({ ...f, next: e.target.value }))}
              required
              minLength={6}
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirm}
              onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))}
              required
              minLength={6}
              className={INPUT_CLS}
            />
          </div>
          {pwError && <div className="border border-rose-600 text-rose-600 px-3 py-2 text-[10px] font-black uppercase tracking-widest">{pwError}</div>}
          {pwSuccess && <div className="border border-black text-black px-3 py-2 text-[10px] font-black uppercase tracking-widest">{pwSuccess}</div>}
          <button
            type="submit"
            disabled={changingPassword}
            className="bg-black hover:bg-rose-600 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-none transition-colors"
          >
            {changingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </main>
    </div>
  );
}
