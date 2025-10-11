import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { getDocumentLocale, normalizeLocale, resolveLocaleParam } from '@/lib/i18n'

const POSTS_PER_PAGE = 5

const getLocalizedPosts = (locale?: string) => {
  const targetLocale = normalizeLocale(locale)
  return allCoreContent(sortPosts(allBlogs)).filter(
    (post) => getDocumentLocale(post.lang) === targetLocale
  )
}

export const getBlogPageStaticParams = (locale?: string) => {
  const posts = getLocalizedPosts(locale)
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE))
  return Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))
}

export const generateStaticParams = async () => {
  return getBlogPageStaticParams()
}

export default async function Page(props: { params: Promise<{ page: string; locale?: string }> }) {
  const params = await props.params
  const locale = resolveLocaleParam(params)
  const posts = getLocalizedPosts(locale)
  const pageNumber = parseInt(params.page as string)
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE))

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}
