import { expandStaticParamsForLocales, resolveLocaleParam } from '@/lib/i18n'
import { normalizeLocale } from '@/lib/i18n'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import { getSiteMetadata } from '@/lib/site'

// 移除导入，在本地重新实现函数
// import { createTagDetailMetadata, getTagStaticParams } from '../../../../(site)/tags/[tag]/page'

const createTagDetailMetadata = (tag: string, locale?: string) => {
  const localizedSite = getSiteMetadata(locale)
  return genPageMetadata({
    title: tag,
    description: `${localizedSite.title} ${tag} tagged content`,
    locale,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${localizedSite.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  })
}

const countsByLocale = tagData as Record<string, Record<string, number>>

const getTagStaticParams = (locale?: string) => {
  const targetLocale = normalizeLocale(locale)
  const tags = countsByLocale[targetLocale] ?? {}
  return Object.keys(tags).map((tag) => ({
    tag: encodeURI(tag),
  }))
}

export const generateStaticParams = async () => {
  return expandStaticParamsForLocales((locale) => getTagStaticParams(locale))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string; locale: string }>
}) {
  const resolvedParams = await params
  return createTagDetailMetadata(resolvedParams.tag, resolvedParams.locale)
}

export { default } from '../../../../(site)/tags/[tag]/page'
