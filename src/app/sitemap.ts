import type { MetadataRoute } from 'next';

const baseUrl = 'https://www.azmarino.online';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/products',
    '/track',
    '/auth/login',
    '/auth/register',
    '/cart',
    '/checkout',
    '/orders',
    '/profile',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route === '/products' ? 0.9 : 0.7,
  }));
}
