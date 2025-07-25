import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'zh'];

  // Base URLs
  const staticPages = [
    '',
    '/features/custom-links',
    '/features/branded-domains',
    '/features/link-analytics',
    '/features/how-it-works',
    '/link-management',
    '/my-urls',
    '/analytics'
  ];

  const sitemapEntries = locales.flatMap(locale =>
    staticPages.map(page => ({
      url: `https://urlshorter.cc/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 1.0 : 0.8,
    }))
  );

  return sitemapEntries;
} 