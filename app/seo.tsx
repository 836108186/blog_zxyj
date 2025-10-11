import { Metadata } from 'next'

import siteMetadata from '@/data/siteMetadata'
import { getSiteMetadata } from '@/lib/site'

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  locale?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export function genPageMetadata({
  title,
  description,
  image,
  locale,
  ...rest
}: PageSEOProps): Metadata {
  const localized = getSiteMetadata(locale)
  return {
    title,
    description: description || localized.description,
    openGraph: {
      title: `${title} | ${localized.title}`,
      description: description || localized.description,
      url: './',
      siteName: localized.title,
      images: image ? [image] : [siteMetadata.socialBanner],
      locale: localized.locale,
      type: 'website',
    },
    twitter: {
      title: `${title} | ${localized.title}`,
      card: 'summary_large_image',
      images: image ? [image] : [siteMetadata.socialBanner],
    },
    ...rest,
  }
}
