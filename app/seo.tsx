import { Metadata } from 'next'

import siteMetadata from '@/data/siteMetadata'
import { normalizeLocale } from '@/lib/i18n'
import { getSiteMetadata } from '@/lib/site'

const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*:/

const stripTrailingSlash = (value?: string) => value?.replace(/\/+$/, '') ?? undefined

const toPathSegment = (value?: string) => value?.replace(/^\/+|\/+$/g, '') ?? ''

const buildLocalizedPath = (path?: string, locale?: string) => {
  if (!path) return undefined
  const normalizedLocale = locale ? normalizeLocale(locale) : undefined
  const defaultLocale = normalizeLocale(siteMetadata.defaultLocale)
  const localeSegment =
    normalizedLocale && normalizedLocale !== defaultLocale ? toPathSegment(normalizedLocale) : ''
  const normalizedPath = toPathSegment(path)
  const combined = [localeSegment, normalizedPath].filter(Boolean).join('/')
  return combined ? `/${combined}` : '/'
}

const ensureAbsoluteUrl = (input?: string | URL, base?: string) => {
  const normalizedBase = stripTrailingSlash(base)
  if (!input || `${input}`.trim() === '') {
    return normalizedBase
  }

  const value = input instanceof URL ? input.toString() : input
  if (ABSOLUTE_URL_REGEX.test(value)) {
    return value
  }

  const sanitized = value.replace(/^\.\//, '').replace(/^\/+/, '')
  if (!normalizedBase) {
    return sanitized ? `/${sanitized}` : undefined
  }

  if (!sanitized) {
    return normalizedBase
  }

  return `${normalizedBase}/${sanitized}`
}

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  locale?: string
  path?: string
  canonicalUrl?: string
  rssPath?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export function genPageMetadata({
  title,
  description,
  image,
  locale,
  path,
  canonicalUrl,
  rssPath,
  ...rest
}: PageSEOProps): Metadata {
  const localized = getSiteMetadata(locale)
  const baseSiteUrl = stripTrailingSlash(localized.siteUrl)
  const canonicalFromPath = buildLocalizedPath(path, locale)

  const {
    alternates,
    openGraph: openGraphOverrides,
    twitter: twitterOverrides,
    ...metadataRest
  } = rest ?? {}

  const canonicalInput =
    canonicalUrl ||
    (alternates?.canonical instanceof URL
      ? alternates.canonical
      : (alternates?.canonical as string | undefined)) ||
    canonicalFromPath

  const canonical = ensureAbsoluteUrl(canonicalInput, baseSiteUrl)
  const rssInput =
    rssPath || (alternates?.types?.['application/rss+xml'] as string | URL | undefined)
  const rssUrl = ensureAbsoluteUrl(rssInput, baseSiteUrl)

  const openGraphUrl = ensureAbsoluteUrl(openGraphOverrides?.url ?? canonical, baseSiteUrl)

  const openGraph: Metadata['openGraph'] = {
    ...openGraphOverrides,
    title: openGraphOverrides?.title ?? `${title} | ${localized.title}`,
    description: openGraphOverrides?.description ?? (description || localized.description),
    siteName: openGraphOverrides?.siteName ?? localized.title,
    images: openGraphOverrides?.images ?? (image ? [image] : [siteMetadata.socialBanner]),
    locale: openGraphOverrides?.locale ?? localized.locale,
    type: openGraphOverrides?.type ?? 'website',
    url: openGraphUrl,
  }

  const twitter: Metadata['twitter'] = {
    ...twitterOverrides,
    title: twitterOverrides?.title ?? `${title} | ${localized.title}`,
    description: twitterOverrides?.description ?? (description || localized.description),
    card: twitterOverrides?.card ?? 'summary_large_image',
    images: twitterOverrides?.images ?? (image ? [image] : [siteMetadata.socialBanner]),
  }

  const types = {
    ...(alternates?.types ?? {}),
    ...(rssUrl ? { 'application/rss+xml': rssUrl } : {}),
  }

  const metadata: Metadata = {
    ...metadataRest,
    title,
    description: description || localized.description,
    openGraph,
    twitter,
  }

  if (canonical || rssUrl || alternates) {
    metadata.alternates = {
      ...alternates,
      canonical: canonical ?? alternates?.canonical,
      types,
    }
  }

  return metadata
}
