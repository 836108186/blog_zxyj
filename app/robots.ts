import { MetadataRoute } from 'next'
import { getSiteBaseUrl } from '@/lib/sitemap'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteBaseUrl()
  const sitemapUrl = baseUrl ? `${baseUrl}/sitemap.xml` : undefined

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: sitemapUrl ? [sitemapUrl] : undefined,
    host: baseUrl || undefined,
  }
}
