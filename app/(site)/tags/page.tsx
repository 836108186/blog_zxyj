import { genPageMetadata } from 'app/seo'

import TagListing from './TagListing'

export function createTagListingMetadata(locale?: string) {
  return genPageMetadata({
    title: 'Tags',
    description: 'Things I blog about',
    locale,
  })
}

export const metadata = createTagListingMetadata()

export default function TagsPage() {
  return <TagListing />
}
