import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="section-shell py-16">
        <section className="surface-solid rounded-[2rem] px-6 py-14 text-center md:px-10">
          <p className="eyebrow">Page not found</p>
          <h1 className="display-title mt-4 text-5xl text-[var(--ink-strong)] md:text-6xl">
            The page you were looking for has moved or no longer exists.
          </h1>
          <p className="soft-copy mx-auto mt-4 max-w-2xl text-base">
            Continue exploring the Azmarino catalogue, track an order, or return to the homepage to start fresh.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="button-primary">
              Back to homepage
            </Link>
            <Link href="/products" className="button-secondary">
              Browse products
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
