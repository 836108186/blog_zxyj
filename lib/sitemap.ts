import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

const sharedRoutes = ['', 'blog', 'tags', 'about'] as const

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '')
const stripLeadingAndTrailingSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '')

const normalizeSegments = (segments: Array<string | undefined>) =>
  segments
    .filter((segment): segment is string => typeof segment === 'string' && segment.length > 0)
    .map(stripLeadingAndTrailingSlashes)
    .filter((segment) => segment.length > 0)

export const getSiteBaseUrl = () => stripTrailingSlash(siteMetadata.siteUrl || '')

const toAbsoluteUrl = (baseUrl: string, ...segments: Array<string | undefined>) => {
  const filteredSegments = normalizeSegments(segments)

  if (!baseUrl) {
    return filteredSegments.join('/')
  }

  if (filteredSegments.length === 0) {
    return baseUrl
  }

  return `${baseUrl}/${filteredSegments.join('/')}`
}

export const getSitemapEntries = (): MetadataRoute.Sitemap => {
  const baseUrl = getSiteBaseUrl()
  const defaultLocale = siteMetadata.defaultLocale || 'en'
  const supportedLocales = Array.isArray(siteMetadata.locales)
    ? siteMetadata.locales.filter(Boolean)
    : []

  const today = new Date().toISOString().split('T')[0]

  const defaultLocaleRoutes = sharedRoutes.map((route) => ({
    url: toAbsoluteUrl(baseUrl, route),
    lastModified: today,
  }))

  const alternateLocaleRoutes = supportedLocales
    .filter((locale) => locale && locale !== defaultLocale)
    .flatMap((locale) =>
      sharedRoutes.map((route) => ({
        url: toAbsoluteUrl(baseUrl, locale, route),
        lastModified: today,
      }))
    )

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: toAbsoluteUrl(baseUrl, post.path),
      lastModified: post.lastmod || post.date,
    }))

  return [...defaultLocaleRoutes, ...alternateLocaleRoutes, ...blogRoutes]
}
