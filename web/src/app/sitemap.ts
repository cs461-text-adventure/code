import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'http://localhost/dashboard',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
        url: 'http://localhost/forgot-password',
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
    },
    {
        url: 'http://localhost/login',
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
    },
    {
        url: 'http://localhost/play',
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
    },
    {
        url: 'http://localhost/privacy',
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
    },
    {
        url: 'http://localhost/terms',
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
    },
    {
        url: 'http://localhost/support',
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
    },
    {
        url: 'http://localhost/reset-password',
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
    },
    {
        url: 'http://localhost/verify-email',
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
    },
  ]
}