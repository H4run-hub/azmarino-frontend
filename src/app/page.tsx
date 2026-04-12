import Navbar from '../components/Navbar';
import HomeClient from './HomeClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://azmarino-backend-production.up.railway.app/api';

async function getProducts(params: string) {
  try {
    const response = await fetch(`${API_URL}/products?${params}&limit=8`, {
      next: { revalidate: 300 },
    });

    const data = await response.json();
    return data.products || data.data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [topRated, newArrivals] = await Promise.all([
    getProducts('sort=-rating'),
    getProducts('newArrival=true&sort=-createdAt'),
  ]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HomeClient topRated={topRated} newArrivals={newArrivals} />
    </div>
  );
}
