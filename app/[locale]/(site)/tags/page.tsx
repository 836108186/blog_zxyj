import { resolveLocaleParam } from '@/lib/i18n'
import { genPageMetadata } from 'app/seo'

// 移除导入，在本地重新实现函数
// import { createTagListingMetadata } from '../../../(site)/tags/page'

const createTagListingMetadata = (locale?: string) => {
  return genPageMetadata({
    title: 'Tags',
    description: 'Things I blog about',
    locale,
    path: 'tags',
  })
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params
  const locale = resolveLocaleParam(resolvedParams)
  return createTagListingMetadata(locale)
}

export { default } from '../../../(site)/tags/page'
