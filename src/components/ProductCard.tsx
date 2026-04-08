import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link href={`/products/${product._id}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.image || '/logo.png'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <p className="text-xs text-accent font-semibold uppercase tracking-wider">{product.category}</p>
        <h3 className="mt-1 text-lg font-bold text-foreground truncate">{product.name}</h3>
        <p className="mt-1 text-primary font-bold">€{product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
