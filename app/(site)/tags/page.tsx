import { genPageMetadata } from 'app/seo'

import TagListing from './TagListing'

// 移除 export 关键字，将其改为内部函数
const createTagListingMetadata = (locale?: string) => {
  return genPageMetadata({
    title: 'Tags',
    description: 'Things I blog about',
    locale,
  })
}

// 如果有 generateMetadata 函数，在其中调用 createTagListingMetadata
export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }) {
  const resolvedParams = await params
  return createTagListingMetadata(resolvedParams.locale)
}

export default async function TagsPage() {
  return <TagListing />
}
