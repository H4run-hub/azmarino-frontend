'use client';

import Navbar from '../components/Navbar';
import { useLang } from '../context/LanguageContext';

export default function Loading() {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="section-container py-12">
        <section className="bg-gray-50 border border-gray-100 rounded-3xl px-6 py-12 md:px-10">
          <p className="label-caps mb-4 text-gray-400 animate-pulse">{t('loadingEyebrow')}</p>
          <div className="h-12 max-w-3xl bg-white/70 rounded-2xl animate-pulse mb-4" />
          <div className="h-5 max-w-2xl bg-white/60 rounded-xl animate-pulse" />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-64 bg-gray-50 border border-gray-100 rounded-3xl animate-pulse" />
          ))}
        </section>
      </main>
    </div>
  );
}
