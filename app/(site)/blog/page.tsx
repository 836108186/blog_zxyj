import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { getDocumentLocale, resolveLocaleParam } from '@/lib/i18n'

const POSTS_PER_PAGE = 5

export function createBlogListingMetadata(locale?: string) {
  return genPageMetadata({ title: 'Blog', locale })
}

export const metadata = createBlogListingMetadata()

export default async function BlogPage({ params }: { params?: { locale?: string } }) {
  const locale = resolveLocaleParam(params)
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
