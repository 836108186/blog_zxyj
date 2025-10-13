import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { blogListingMetadata, createBlogListingMetadata } from './metadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { getDocumentLocale, resolveLocaleParam } from '@/lib/i18n'

const POSTS_PER_PAGE = 5

type BlogPageParams = { params: Promise<{ locale?: string }> }

export default async function BlogPage({ params }: BlogPageParams) {
  const resolvedParams = await params
  const locale = resolveLocaleParam(resolvedParams)
  const allPosts = allCoreContent(sortPosts(allBlogs))
  const localizedPosts = allPosts.filter((post) => getDocumentLocale(post.lang) === locale)
  const pageNumber = 1
  const initialDisplayPosts = localizedPosts.slice(0, POSTS_PER_PAGE * pageNumber)
  const totalPages = Math.max(1, Math.ceil(localizedPosts.length / POSTS_PER_PAGE))
  const pagination = {
    currentPage: pageNumber,
    totalPages,
  }

  return (
    <ListLayout
      posts={localizedPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }) {
  const resolvedParams = await params
  const locale = resolveLocaleParam(resolvedParams)
  return createBlogListingMetadata(locale)
}
