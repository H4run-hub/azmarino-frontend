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
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="section-container py-12">
        <section className="bg-gray-50 border border-gray-100 rounded-3xl px-6 py-8 md:px-10 md:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="label-caps mb-4 text-gray-400">{t('profileStudio')}</p>
              <h1 className="heading-lg text-black">{t('profileTitle')}</h1>
              <p className="text-sm text-gray-500 font-medium mt-4 max-w-2xl leading-relaxed">
                {t('profileSubtitle')}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="bg-white border border-gray-100 p-6 rounded-2xl min-w-40 shadow-sm text-center">
                <p className="text-3xl font-black text-black">{accountCompletion}%</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{t('profileComplete')}</p>
              </div>
              <div className="bg-white border border-gray-100 p-6 rounded-2xl min-w-40 shadow-sm text-center">
                <p className="text-xl font-black text-black">{user.emailVerified ? t('verified') : t('actionNeeded')}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">{t('emailVerified')}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <form onSubmit={handleProfileSave} className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="label-caps mb-1 text-gray-400">{t('accountDetails')}</p>
                  <h2 className="text-2xl font-black text-black uppercase tracking-tight">{t('personalInfo')}</h2>
                </div>
                <Link href="/orders" className="btn-outline h-10 px-6 text-[10px]">
                  {t('viewOrders')}
                </Link>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">{t('fullNameLabel')}</span>
                  <input
                    value={profile.name}
                    onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
                    required
                    className="input-base"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">{t('email')}</span>
                  <input
                    value={user.email}
                    disabled
                    className="input-base bg-gray-50 text-gray-400"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">{t('phoneLabel')}</span>
                  <input
                    value={profile.phone}
                    onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))}
                    className="input-base"
                    placeholder="+352 000 000 000"
                  />
                </label>
              </div>

              <div className="mt-8 border-t border-gray-100 pt-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-black mb-6">{t('deliveryAddress')}</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">{t('streetAddress')}</span>
                    <input
                      value={profile.street}
                      onChange={(event) => setProfile((current) => ({ ...current, street: event.target.value }))}
                      className="input-base"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">{t('city')}</span>
                    <input
                      value={profile.city}
                      onChange={(event) => setProfile((current) => ({ ...current, city: event.target.value }))}
                      className="input-base"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">{t('postalCode')}</span>
                    <input
                      value={profile.postalCode}
                      onChange={(event) => setProfile((current) => ({ ...current, postalCode: event.target.value }))}
                      className="input-base"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">{t('country')}</span>
                    <input
                      value={profile.country}
                      onChange={(event) => setProfile((current) => ({ ...current, country: event.target.value }))}
                      className="input-base"
                    />
                  </label>
                </div>
              </div>

              {profileError ? (
                <div className="mt-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold uppercase tracking-widest rounded-xl text-center">
                  {profileError}
                </div>
              ) : null}

              {profileMessage ? (
                <div className="mt-6 p-4 bg-green-50 border border-green-100 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-xl text-center">
                  {profileMessage}
                </div>
              ) : null}

              <button type="submit" disabled={savingProfile} className="btn-black mt-8 w-full md:w-auto px-12">
                {savingProfile ? t('savingChanges') : t('saveProfile')}
              </button>
            </form>

            <form onSubmit={handlePasswordSave} className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
              <p className="label-caps mb-1 text-gray-400">{t('security')}</p>
              <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-6">{t('changePassword')}</h2>
              <div className="grid gap-4">
                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">{t('currentPassword')}</span>
                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(event) => setPasswords((current) => ({ ...current, currentPassword: event.target.value }))}
                    required
                    className="input-base"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">{t('newPasswordLabel')}</span>
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(event) => setPasswords((current) => ({ ...current, newPassword: event.target.value }))}
                    required
                    minLength={6}
                    className="input-base"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">{t('confirmPasswordLabel')}</span>
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(event) => setPasswords((current) => ({ ...current, confirmPassword: event.target.value }))}
                    required
                    minLength={6}
                    className="input-base"
                  />
                </label>
              </div>

              {passwordError ? (
                <div className="mt-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold uppercase tracking-widest rounded-xl text-center">
                  {passwordError}
                </div>
              ) : null}

              {passwordMessage ? (
                <div className="mt-6 p-4 bg-green-50 border border-green-100 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-xl text-center">
                  {passwordMessage}
                </div>
              ) : null}

              <button type="submit" disabled={savingPassword} className="btn-black mt-8 w-full md:w-auto px-12">
                {savingPassword ? t('updatingPassword') : t('updatePassword')}
              </button>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 shadow-sm">
              <p className="label-caps mb-4 text-gray-400">{t('accountStatus')}</p>
              <div className="space-y-4">
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{t('memberRole')}</p>
                  <p className="mt-2 text-lg font-black capitalize text-black">{user.role}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{t('emailVerified')}</p>
                  <p className={`mt-2 text-lg font-black ${user.emailVerified ? 'text-green-600' : 'text-rose-600'}`}>
                    {user.emailVerified ? t('verified') : t('actionNeeded')}
                  </p>
                </div>
              </div>

              {!user.emailVerified ? (
                <form onSubmit={handleVerifyEmail} className="mt-6 border-t border-gray-200 pt-6">
                  <p className="text-xs font-black uppercase tracking-widest text-black mb-4">{t('enterCode')}</p>
                  <input
                    value={verificationCode}
                    onChange={(event) => setVerificationCode(event.target.value)}
                    required
                    placeholder={t('digitCode')}
                    className="input-base"
                  />

                  {verificationError ? (
                    <div className="mt-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 text-[9px] font-bold uppercase tracking-widest rounded-xl text-center">
                      {verificationError}
                    </div>
                  ) : null}

                  {verificationMessage ? (
                    <div className="mt-4 p-3 bg-green-50 border border-green-100 text-green-600 text-[9px] font-bold uppercase tracking-widest rounded-xl text-center">
                      {verificationMessage}
                    </div>
                  ) : null}

                  <div className="mt-6 grid gap-3">
                    <button type="submit" disabled={verifyingEmail} className="btn-black w-full h-12 text-[10px]">
                      {verifyingEmail ? t('verifying') : t('verifyEmail')}
                    </button>
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={sendingVerification}
                      className="btn-outline w-full h-12 text-[10px] border-gray-200"
                    >
                      {sendingVerification ? t('sendingCode') : t('resendCode')}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6 p-5 bg-green-50/50 border border-green-100 rounded-2xl">
                  <p className="text-[10px] font-medium text-green-800 leading-relaxed italic">{t('emailVerifiedMsg')}</p>
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <p className="label-caps mb-4 text-gray-400">{t('quickActions')}</p>
              <div className="grid gap-3">
                <Link href="/orders" className="btn-outline w-full h-12 text-[10px] border-gray-200">
                  {t('reviewOrders')}
                </Link>
                <Link href="/track" className="btn-outline w-full h-12 text-[10px] border-gray-200">
                  {t('trackPackage')}
                </Link>
                <button onClick={handleLogout} className="btn-black w-full h-12 text-[10px]">
                  {t('signOut')}
                </button>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
