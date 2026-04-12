const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://azmarino-backend-production.up.railway.app/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('azmarino_token') : null;
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export interface Product {
  _id: string;
  name: string;
  nameTi?: string;
  description?: string;
  descriptionTi?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  category: string;
  rating?: number;
  reviews?: number;
  sizes?: string[];
  colors?: string[];
  stock?: number;
  featured?: boolean;
  newArrival?: boolean;
  bestseller?: boolean;
  brand?: string;
  cjVariants?: {
    vid: string;
    name: string;
    price: number;
    image?: string;
    sku?: string;
    stock?: number;
  }[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  variantName?: string;
  selectedVariantId?: string;
}

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
    postalCode?: string;
  };
  role: string;
  emailVerified: boolean;
}
