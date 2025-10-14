import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'
import { getDocumentLocale, normalizeLocale, resolveLocaleParam } from '@/lib/i18n'
import { getSiteMetadata } from '@/lib/site'

const POSTS_PER_PAGE = 5

const createTagDetailMetadata = (tag: string, locale?: string) => {
  const localizedSite = getSiteMetadata(locale)
  const decodedTag = decodeURIComponent(tag)
  const tagSegment = encodeURIComponent(decodedTag)
  return genPageMetadata({
    title: decodedTag,
    description: `${localizedSite.title} ${decodedTag} tagged content`,
    locale,
    path: `tags/${tagSegment}`,
    rssPath: `tags/${tagSegment}/feed.xml`,
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string; locale?: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  return createTagDetailMetadata(resolvedParams.tag, resolvedParams.locale)
}

const countsByLocale = tagData as Record<string, Record<string, number>>

// 移除 export 关键字，将其改为内部函数
const getTagStaticParams = (locale?: string) => {
  const targetLocale = normalizeLocale(locale)
  const tags = countsByLocale[targetLocale] ?? {}
  return Object.keys(tags).map((tag) => ({
    tag: encodeURI(tag),
  }))
}

export const generateStaticParams = async () => {
  return getTagStaticParams()
}

export default async function TagPage(props: {
  params: Promise<{ tag: string; locale?: string }>
}) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const locale = resolveLocaleParam(params)
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const filteredPosts = allCoreContent(
    sortPosts(allBlogs.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)))
  ).filter((post) => getDocumentLocale(post.lang) === locale)
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE))
  const initialDisplayPosts = filteredPosts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
    />
  )
}
