'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/Navbar';
import type { User } from '../../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azmarino.online/api';

interface ProfileForm {
  name: string;
  phone: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const emptyProfileForm: ProfileForm = {
  name: '',
  phone: '',
  street: '',
  city: '',
  country: '',
  postalCode: '',
};

const emptyPasswordForm: PasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileForm>(emptyProfileForm);
  const [passwords, setPasswords] = useState<PasswordForm>(emptyPasswordForm);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [verificationError, setVerificationError] = useState('');

  const hydrateUser = (nextUser: User | null) => {
    if (!nextUser) {
      return;
    }

    setUser(nextUser);
    setProfile({
      name: nextUser.name || '',
      phone: nextUser.phone || '',
      street: nextUser.address?.street || '',
      city: nextUser.address?.city || '',
      country: nextUser.address?.country || '',
      postalCode: nextUser.address?.postalCode || nextUser.address?.zip || '',
    });
    localStorage.setItem('azmarino_user', JSON.stringify(nextUser));
  };

  useEffect(() => {
    const token = localStorage.getItem('azmarino_token');
    if (!token) {
      router.replace('/auth/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          localStorage.removeItem('azmarino_token');
          localStorage.removeItem('azmarino_user');
          router.replace('/auth/login');
          return;
        }

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.message || 'Could not load your profile.');
        }

        hydrateUser(payload.user || payload);
      } catch (err: unknown) {
        setProfileError(err instanceof Error ? err.message : 'Could not load your profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const accountCompletion = useMemo(() => {
    const fields = [profile.name, user?.email || '', profile.phone, profile.street, profile.city, profile.country];
    const completed = fields.filter((value) => value && value.trim()).length;
    return Math.round((completed / fields.length) * 100);
  }, [profile, user]);

  const handleProfileSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingProfile(true);
    setProfileError('');
    setProfileMessage('');

    try {
      const token = localStorage.getItem('azmarino_token');
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          address: {
            street: profile.street,
            city: profile.city,
            country: profile.country,
            postalCode: profile.postalCode,
          },
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Could not update your profile.');
      }

      hydrateUser(payload.user || payload);
      setProfileMessage('Profile details updated successfully.');
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : 'Could not update your profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('The new password confirmation does not match.');
      return;
    }

    if (passwords.newPassword.length < 6) {
      setPasswordError('Your new password must be at least 6 characters.');
      return;
    }

    setSavingPassword(true);

    try {
      const token = localStorage.getItem('azmarino_token');
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Could not change your password.');
      }

      setPasswordMessage(payload.message || 'Password updated successfully.');
      setPasswords(emptyPasswordForm);
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : 'Could not change your password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleResendVerification = async () => {
    setSendingVerification(true);
    setVerificationError('');
    setVerificationMessage('');

    try {
      const token = localStorage.getItem('azmarino_token');
      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Could not resend the verification code.');
      }

      setVerificationMessage(payload.message || 'A new verification code has been sent.');
    } catch (err: unknown) {
      setVerificationError(err instanceof Error ? err.message : 'Could not resend the verification code.');
    } finally {
      setSendingVerification(false);
    }
  };

  const handleVerifyEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    setVerifyingEmail(true);
    setVerificationError('');
    setVerificationMessage('');

    try {
      const token = localStorage.getItem('azmarino_token');
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: verificationCode }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Verification failed.');
      }

      hydrateUser(payload.user || payload);
      setVerificationCode('');
      setVerificationMessage(payload.message || 'Email verified successfully.');
    } catch (err: unknown) {
      setVerificationError(err instanceof Error ? err.message : 'Verification failed.');
    } finally {
      setVerifyingEmail(false);
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
      <div className="min-h-screen">
        <Navbar />
        <main className="section-shell py-16">
          <div className="surface-solid rounded-[2rem] px-6 py-16 text-center">
            <div className="mx-auto h-10 w-10 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="section-shell pb-16">
        <section className="surface-panel rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow">Profile studio</p>
              <h1 className="display-title mt-4 text-5xl text-[var(--ink-strong)] md:text-6xl">Keep your account, delivery details, and security settings impeccably current.</h1>
              <p className="soft-copy mt-4 max-w-2xl text-base">
                Manage the essentials that make checkout faster, order updates clearer, and account recovery safer.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="metric-card min-w-40">
                <p className="metric-value">{accountCompletion}%</p>
                <p className="metric-label">Profile complete</p>
              </div>
              <div className="metric-card min-w-40">
                <p className="metric-value">{user.emailVerified ? 'Yes' : 'No'}</p>
                <p className="metric-label">Email verified</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_21rem]">
          <div className="space-y-8">
            <form onSubmit={handleProfileSave} className="surface-solid rounded-[2rem] p-6 md:p-8">
              <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="eyebrow">Account details</p>
                  <h2 className="mt-3 text-3xl font-black text-[var(--ink-strong)]">Personal information</h2>
                </div>
                <Link href="/orders" className="button-secondary">
                  View orders
                </Link>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Full name</span>
                  <input
                    value={profile.name}
                    onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
                    required
                    className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Email</span>
                  <input
                    value={user.email}
                    disabled
                    className="w-full rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,255,255,0.6)] px-4 py-4 text-sm text-[var(--muted)]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Phone</span>
                  <input
                    value={profile.phone}
                    onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))}
                    className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]"
                    placeholder="+352 000 000 000"
                  />
                </label>
              </div>

              <div className="mt-6 border-t border-[var(--line)] pt-6">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--muted)]">Delivery address</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Street address</span>
                    <input
                      value={profile.street}
                      onChange={(event) => setProfile((current) => ({ ...current, street: event.target.value }))}
                      className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">City</span>
                    <input
                      value={profile.city}
                      onChange={(event) => setProfile((current) => ({ ...current, city: event.target.value }))}
                      className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Postal code</span>
                    <input
                      value={profile.postalCode}
                      onChange={(event) => setProfile((current) => ({ ...current, postalCode: event.target.value }))}
                      className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Country</span>
                    <input
                      value={profile.country}
                      onChange={(event) => setProfile((current) => ({ ...current, country: event.target.value }))}
                      className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]"
                    />
                  </label>
                </div>
              </div>

              {profileError ? (
                <div className="mt-6 rounded-[1.3rem] border border-[rgba(158,36,52,0.2)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent)]">
                  {profileError}
                </div>
              ) : null}

              {profileMessage ? (
                <div className="mt-6 rounded-[1.3rem] border border-[rgba(176,134,74,0.25)] bg-[rgba(176,134,74,0.12)] px-4 py-3 text-sm text-[var(--ink)]">
                  {profileMessage}
                </div>
              ) : null}

              <button type="submit" disabled={savingProfile} className="button-primary mt-6">
                {savingProfile ? 'Saving changes...' : 'Save profile'}
              </button>
            </form>

            <form onSubmit={handlePasswordSave} className="surface-solid rounded-[2rem] p-6 md:p-8">
              <p className="eyebrow">Security</p>
              <h2 className="mt-3 text-3xl font-black text-[var(--ink-strong)]">Change password</h2>
              <div className="mt-6 grid gap-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Current password</span>
                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(event) => setPasswords((current) => ({ ...current, currentPassword: event.target.value }))}
                    required
                    className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">New password</span>
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(event) => setPasswords((current) => ({ ...current, newPassword: event.target.value }))}
                    required
                    minLength={6}
                    className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Confirm new password</span>
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(event) => setPasswords((current) => ({ ...current, confirmPassword: event.target.value }))}
                    required
                    minLength={6}
                    className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]"
                  />
                </label>
              </div>

              {passwordError ? (
                <div className="mt-6 rounded-[1.3rem] border border-[rgba(158,36,52,0.2)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent)]">
                  {passwordError}
                </div>
              ) : null}

              {passwordMessage ? (
                <div className="mt-6 rounded-[1.3rem] border border-[rgba(176,134,74,0.25)] bg-[rgba(176,134,74,0.12)] px-4 py-3 text-sm text-[var(--ink)]">
                  {passwordMessage}
                </div>
              ) : null}

              <button type="submit" disabled={savingPassword} className="button-primary mt-6">
                {savingPassword ? 'Updating password...' : 'Update password'}
              </button>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="surface-panel rounded-[2rem] p-6">
              <p className="eyebrow">Account status</p>
              <div className="mt-5 grid gap-4">
                <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-5">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Member role</p>
                  <p className="mt-3 text-xl font-black capitalize text-[var(--ink-strong)]">{user.role}</p>
                </div>
                <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/70 p-5">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Email verification</p>
                  <p className="mt-3 text-xl font-black text-[var(--ink-strong)]">
                    {user.emailVerified ? 'Verified' : 'Action needed'}
                  </p>
                </div>
              </div>

              {!user.emailVerified ? (
                <form onSubmit={handleVerifyEmail} className="mt-6 border-t border-[var(--line)] pt-6">
                  <p className="text-sm font-semibold text-[var(--ink-strong)]">Enter your verification code</p>
                  <input
                    value={verificationCode}
                    onChange={(event) => setVerificationCode(event.target.value)}
                    required
                    placeholder="6-digit code"
                    className="mt-4 w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4 text-sm outline-none transition focus:border-[var(--accent)]"
                  />

                  {verificationError ? (
                    <div className="mt-4 rounded-[1.3rem] border border-[rgba(158,36,52,0.2)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent)]">
                      {verificationError}
                    </div>
                  ) : null}

                  {verificationMessage ? (
                    <div className="mt-4 rounded-[1.3rem] border border-[rgba(176,134,74,0.25)] bg-[rgba(176,134,74,0.12)] px-4 py-3 text-sm text-[var(--ink)]">
                      {verificationMessage}
                    </div>
                  ) : null}

                  <div className="mt-5 grid gap-3">
                    <button type="submit" disabled={verifyingEmail} className="button-primary w-full justify-center">
                      {verifyingEmail ? 'Verifying...' : 'Verify email'}
                    </button>
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={sendingVerification}
                      className="button-secondary w-full justify-center"
                    >
                      {sendingVerification ? 'Sending code...' : 'Resend code'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6 rounded-[1.6rem] border border-[rgba(176,134,74,0.24)] bg-[rgba(176,134,74,0.12)] p-5">
                  <p className="text-sm font-semibold text-[var(--ink-strong)]">Your email is verified and ready for order updates.</p>
                </div>
              )}
            </div>

            <div className="surface-solid rounded-[2rem] p-6">
              <p className="eyebrow">Quick actions</p>
              <div className="mt-5 grid gap-3">
                <Link href="/orders" className="button-secondary w-full justify-center">
                  Review orders
                </Link>
                <Link href="/track" className="button-secondary w-full justify-center">
                  Track a package
                </Link>
                <button onClick={handleLogout} className="button-primary w-full justify-center">
                  Sign out
                </button>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
