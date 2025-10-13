import { resolveLocaleParam } from '@/lib/i18n'

import { createBlogListingMetadata } from '../../../(site)/blog/metadata'

// 更新参数类型为 Promise
type BlogPageParams = { params: Promise<{ locale?: string }> }

// 更新为异步组件以处理 Promise 类型的 params
export default async function BlogPage({ params }: BlogPageParams) {
  const resolvedParams = await params
  // ...existing code...
}

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params
  const locale = resolveLocaleParam(params)
  return createBlogListingMetadata(locale)
}
