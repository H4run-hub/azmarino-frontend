'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLang } from '../context/LanguageContext';

export default function NotFound() {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="section-container py-24 md:py-40">
        <section className="bg-gray-50 border border-gray-100 rounded-3xl px-6 py-20 text-center md:px-10 shadow-sm">
          <p className="label-caps mb-6 text-gray-400">{t('notFoundEyebrow')}</p>
          <h1 className="heading-lg text-black mb-8 max-w-3xl mx-auto">
            {t('notFoundTitle')}
          </h1>
          <p className="text-sm text-gray-500 font-medium mx-auto mt-4 max-w-2xl leading-relaxed mb-12">
            {t('notFoundSubtitle')}
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/" className="btn-black h-14 px-10 text-xs">
              {t('backHome')}
            </Link>
            <Link href="/products" className="btn-outline h-14 px-10 text-xs border-gray-200">
              {t('browseProducts')}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
