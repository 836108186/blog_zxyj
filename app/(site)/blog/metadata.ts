import { genPageMetadata } from 'app/seo'

export function createBlogListingMetadata(locale?: string) {
  return genPageMetadata({ title: 'Blog', locale, path: 'blog', rssPath: 'feed.xml' })
}

export const blogListingMetadata = createBlogListingMetadata()
