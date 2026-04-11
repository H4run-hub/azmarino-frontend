import Navbar from '../components/Navbar';

export default function Loading() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="section-shell py-16">
        <section className="surface-panel rounded-[2rem] px-6 py-12 md:px-10">
          <div className="h-4 w-28 animate-pulse rounded-full bg-[rgba(158,36,52,0.16)]" />
          <div className="mt-6 h-12 max-w-3xl animate-pulse rounded-full bg-white/70" />
          <div className="mt-4 h-5 max-w-2xl animate-pulse rounded-full bg-white/60" />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="surface-solid h-56 animate-pulse rounded-[1.8rem]" />
          ))}
        </section>
      </main>
    </div>
  );
}
