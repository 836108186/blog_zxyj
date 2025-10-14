'use client'

import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { formatDate } from 'pliny/utils/formatDate'
import { useI18n } from '@/app/providers/I18nProvider'
import { slug as slugify } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { getTagLabel } from '@/data/tagsI18n'
import { getDocumentLocale } from '@/lib/i18n'
import { getSiteMetadata } from '@/lib/site'
import type { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'

const MAX_DISPLAY = 5

type HomeProps = {
  posts: CoreContent<Blog>[]
}

export default function Home({ posts }: HomeProps) {
  // 计算标签计数与排序
  const { locale, t } = useI18n()
  const localizedSite = getSiteMetadata(locale)
  const localizedTagCounts = (tagData as Record<string, Record<string, number>>)[locale] || {}
  const tagKeys = Object.keys(localizedTagCounts)
  const sortedTags = tagKeys.sort((a, b) => localizedTagCounts[b] - localizedTagCounts[a])

  const filteredPosts = posts.filter((post) => getDocumentLocale(post.lang) === locale)
  const recommendedPosts =
    filteredPosts.length > MAX_DISPLAY
      ? filteredPosts.slice(MAX_DISPLAY, MAX_DISPLAY + 5)
      : filteredPosts.slice(0, Math.min(5, filteredPosts.length))

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-2 sm:px-4 xl:grid xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start xl:gap-12">
      {/* 标题区域 */}
      <div className="mx-auto max-w-4xl space-y-2 pt-6 pb-4 text-center md:space-y-5 xl:col-span-2">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {t('latest')}
          </h1>
        </div>
        <div className="flex items-center justify-center gap-3" aria-hidden="true">
          <span className="h-1 w-12 bg-gray-300 sm:w-16 md:w-20 dark:bg-gray-700"></span>
        </div>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">{t('description')}</p>
      </div>

      {/* 左侧：文章列表 */}
      <div className="flex-1 xl:pr-2">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {!filteredPosts.length && t('noPosts')}
            {filteredPosts.slice(0, MAX_DISPLAY).map((post) => {
              const { slug, date, title, summary, tags } = post
              return (
                <li key={slug} className="py-12">
                  <article>
                    <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                      <dl>
                        <dt className="sr-only">{t('publishedOn')}</dt>
                        <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                          <time dateTime={date}>{formatDate(date, localizedSite.language)}</time>
                        </dd>
                      </dl>
                      <div className="space-y-5 xl:col-span-3">
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-2xl leading-8 font-bold tracking-tight">
                              <Link
                                href={`/blog/${slug}`}
                                locale={locale}
                                className="text-gray-900 dark:text-gray-100"
                              >
                                {title}
                              </Link>
                            </h2>
                            <div className="flex flex-wrap">
                              {tags.map((tag) => (
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
                        <div className="text-base leading-6 font-medium">
                          <Link
                            href={`/blog/${slug}`}
                            locale={locale}
                            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            aria-label={t('readMoreAria', { title })}
                          >
                            {t('readMore')}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
        {filteredPosts.length > MAX_DISPLAY && (
          <div className="flex justify-end text-base leading-6 font-medium">
            <Link
              href="/blog"
              locale={locale}
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label={t('allPostsAria')}
            >
              {t('allPosts')}
            </Link>
          </div>
        )}
      </div>

      {/* 右侧：Tags 侧栏（仅 xl 及以上显示） */}
      <aside className="hidden max-w-[320px] min-w-[280px] self-start rounded-sm bg-gray-50 shadow-md xl:sticky xl:top-28 xl:block dark:bg-gray-900/70 dark:shadow-gray-800/40">
        <div className="flex flex-col gap-6 px-6 py-6">
          <div>
            <h3 className="text-primary-500 font-bold uppercase">{t('tags')}</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {sortedTags.map((tName) => (
                <li key={tName} className="overflow-hidden">
                  <Link
                    href={`/tags/${slugify(tName)}`}
                    locale={locale}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 flex min-w-0 items-center text-sm font-medium uppercase"
                    aria-label={t('viewTagged', { tag: tName })}
                    title={getTagLabel(tName, locale)}
                  >
                    <span className="min-w-0 flex-1 truncate">{getTagLabel(tName, locale)}</span>
                    <span className="ml-1 shrink-0 text-gray-600 dark:text-gray-300">
                      ({localizedTagCounts[tName]})
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {recommendedPosts.length > 0 && (
            <div>
              <h3 className="text-primary-500 font-bold uppercase">{t('recommended')}</h3>
              <ul className="mt-4 space-y-3">
                {recommendedPosts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      locale={locale}
                      className="group hover:text-primary-600 dark:hover:text-primary-400 block text-sm font-medium text-gray-700 transition-colors dark:text-gray-200"
                    >
                      <span className="line-clamp-2 leading-5 group-hover:underline">
                        {post.title}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(post.date, localizedSite.language)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
