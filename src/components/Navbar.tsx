import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Azmarino Logo" width={40} height={40} className="rounded-md" />
              <span className="text-2xl font-bold text-primary">Azmarino</span>
            </Link>
          </div>
          <div className="hidden sm:flex sm:space-x-8">
            <Link href="/products" className="text-foreground hover:text-primary px-1 pt-1 text-sm font-medium transition">Products</Link>
            <Link href="/cart" className="text-foreground hover:text-primary px-1 pt-1 text-sm font-medium transition">Cart</Link>
            <Link href="/dashboard" className="text-foreground hover:text-primary px-1 pt-1 text-sm font-medium transition">My Account</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
