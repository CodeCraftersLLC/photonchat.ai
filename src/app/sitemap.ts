import type { MetadataRoute } from 'next';

const publicRoutes = ['/', '/pricing', '/about', '/privacy', '/terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://photonchat.ai').replace(/\/+$/, '');

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.5,
  }));
}
