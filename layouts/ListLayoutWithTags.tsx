'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import tagData from 'app/tag-data.json'

import { useI18n } from '@/app/providers/I18nProvider'
import { getTagLabel } from '@/data/tagsI18n'
import { getDocumentLocale, localizePath, stripLocaleFromPath } from '@/lib/i18n'
import { getSiteMetadata } from '@/lib/site'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const { locale, t } = useI18n()
  const pathname = usePathname()
  const basePath = stripLocaleFromPath(pathname)
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            {t('previous')}
          </button>
        )}
        {prevPage && (
          <Link
            href={
              currentPage - 1 === 1
                ? localizePath(basePath || '/', locale)
                : localizePath(`${basePath}/page/${currentPage - 1}`, locale)
            }
            rel="prev"
            locale={locale}
          >
            {t('previous')}
          </Link>
        )}
        <span>
          {t('paginationStatus', { current: currentPage.toString(), total: totalPages.toString() })}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            {t('next')}
          </button>
        )}
        {nextPage && (
          <Link
            href={localizePath(`${basePath}/page/${currentPage + 1}`, locale)}
            rel="next"
            locale={locale}
          >
            {t('next')}
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const { locale, t } = useI18n()
  const localizedSite = getSiteMetadata(locale)
  const localizedTagCounts = (tagData as Record<string, Record<string, number>>)[locale] || {}
  const tagKeys = Object.keys(localizedTagCounts)
  const sortedTags = tagKeys.sort((a, b) => localizedTagCounts[b] - localizedTagCounts[a])

  const filteredPosts = useMemo(
    () => posts.filter((post) => getDocumentLocale(post.lang) === locale),
    [locale, posts]
  )
  const filteredInitialPosts = useMemo(
    () => initialDisplayPosts.filter((post) => getDocumentLocale(post.lang) === locale),
    [initialDisplayPosts, locale]
  )

  const displayPosts = filteredInitialPosts.length > 0 ? filteredInitialPosts : filteredPosts

  return (
    <>
      <div>
        <div className="pt-6 pb-6">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:hidden sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {title === 'All Posts' ? t('allPostsLabel') : title}
          </h1>
        </div>
        <div className="flex sm:space-x-24">
          <div className="hidden h-full max-h-screen max-w-[280px] min-w-[280px] flex-wrap overflow-auto rounded-sm bg-gray-50 pt-5 shadow-md sm:flex dark:bg-gray-900/70 dark:shadow-gray-800/40">
            <div className="px-6 py-4">
              {stripLocaleFromPath(pathname).startsWith('/blog') ? (
                <h3 className="text-primary-500 font-bold uppercase">{t('allPostsLabel')}</h3>
              ) : (
                <Link
                  href={`/blog`}
                  locale={locale}
                  className="hover:text-primary-500 dark:hover:text-primary-500 font-bold text-gray-700 uppercase dark:text-gray-300"
                >
                  {t('allPostsLabel')}
                </Link>
              )}
              <ul>
                {sortedTags.length === 0 && (
                  <p className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    {t('noTags')}
                  </p>
                )}
                {sortedTags.map((tagName) => {
                  const isActive =
                    decodeURI(stripLocaleFromPath(pathname).split('/tags/')[1] ?? '') ===
                    slug(tagName)
                  const label = getTagLabel(tagName, locale)
                  const count = localizedTagCounts[tagName]
                  return (
                    <li key={tagName} className="my-3">
                      {isActive ? (
                        <h3 className="text-primary-500 inline px-3 py-2 text-sm font-bold uppercase">
                          {`${label} (${count})`}
                        </h3>
                      ) : (
                        <Link
                          href={`/tags/${slug(tagName)}`}
                          locale={locale}
                          className="hover:text-primary-500 dark:hover:text-primary-500 px-3 py-2 text-sm font-medium text-gray-500 uppercase dark:text-gray-300"
                          aria-label={t('viewTagged', { tag: label })}
                        >
                          {`${label} (${count})`}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div>
            <ul>
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags } = post
                return (
                  <li key={path} className="py-5">
                    <article className="flex flex-col space-y-2 xl:space-y-0">
                      <dl>
                        <dt className="sr-only">{t('publishedOn')}</dt>
                        <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                          <time dateTime={date} suppressHydrationWarning>
                            {formatDate(date, localizedSite.language)}
                          </time>
                        </dd>
                      </dl>
                      <div className="space-y-3">
                        <div>
                          <h2 className="text-2xl leading-8 font-bold tracking-tight">
                            <Link
                              href={`/${path}`}
                              locale={locale}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags?.map((tag) => (
                              <Tag
                                key={tag}
                                text={getTagLabel(tag, locale)}
                                slugText={tag}
                                locale={locale}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
