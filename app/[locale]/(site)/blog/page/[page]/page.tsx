import { expandStaticParamsForLocales } from '@/lib/i18n'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { getDocumentLocale, normalizeLocale } from '@/lib/i18n'

const POSTS_PER_PAGE = 5

const getLocalizedPosts = (locale?: string) => {
  const targetLocale = normalizeLocale(locale)
  return allCoreContent(sortPosts(allBlogs)).filter(
    (post) => getDocumentLocale(post.lang) === targetLocale
  )
}

const getBlogPageStaticParams = (locale?: string) => {
  const posts = getLocalizedPosts(locale)
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE))
  return Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))
}

export const generateStaticParams = async () => {
  return expandStaticParamsForLocales((locale) => getBlogPageStaticParams(locale))
}

export { default } from '../../../../../(site)/blog/page/[page]/page'
