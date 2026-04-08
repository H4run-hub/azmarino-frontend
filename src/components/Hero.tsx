import Link from 'next/link';

const Hero = () => {
  return (
    <div className="relative bg-white pt-16 pb-32 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div className="relative">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
              Elevate Your Style with <span className="text-primary">Azmarino</span>
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              Discover a curated collection of premium products, from fashion to accessories. Handpicked quality delivered right to your door.
            </p>
            <div className="mt-10 flex gap-4">
              <Link href="/products" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-primary hover:bg-primary-dark transition">
                Shop Now
              </Link>
              <Link href="/about" className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition">
                Learn More
              </Link>
            </div>
          </div>
          <div className="mt-12 relative lg:mt-0" aria-hidden="true">
            <div className="bg-gradient-to-tr from-primary/10 to-accent/10 rounded-3xl aspect-[4/3] flex items-center justify-center border border-gray-100">
              <span className="text-primary font-bold text-lg">Featured Collection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
