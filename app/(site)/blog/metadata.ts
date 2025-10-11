import { genPageMetadata } from 'app/seo'

export function createBlogListingMetadata(locale?: string) {
  return genPageMetadata({ title: 'Blog', locale })
}

export const blogListingMetadata = createBlogListingMetadata()
