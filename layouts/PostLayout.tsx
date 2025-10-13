import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import TableOfContents from '@/components/TableOfContents'

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  recommendedPosts?: CoreContent<Blog>[]
  children: ReactNode
}

export default function PostLayout({
  content,
  authorDetails,
  next,
  prev,
  recommendedPosts,
  children,
}: LayoutProps) {
  const { path, slug, date, title, tags, lang, toc } = content
  const locale = (lang ?? 'en').toLowerCase().startsWith('zh') ? 'zh' : 'en'
  const pathSegments = path.split('/').filter(Boolean)
  if (locale !== 'zh' && pathSegments[0] === locale) {
    pathSegments.shift()
  }
  const basePath = pathSegments[0] ?? 'blog'
  const recommendations = recommendedPosts ?? []
  const recommendationsHeading = locale === 'zh' ? '推荐阅读' : 'Recommended Reading'

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:grid xl:grid-cols-[220px_minmax(0,1fr)_220px] xl:gap-x-6 xl:divide-y-0 dark:divide-gray-700">
            <dl className="pt-6 pb-10 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-y-8 xl:space-x-0">
                  {authorDetails.map((author) => (
                    <li className="flex items-center space-x-2" key={author.name}>
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={38}
                          height={38}
                          alt="avatar"
                          className="h-10 w-10 rounded-full"
                        />
                      )}
                      <dl className="text-sm leading-5 font-medium whitespace-nowrap">
                        <dt className="sr-only">Name</dt>
                        <dd className="text-gray-900 dark:text-gray-100">{author.name}</dd>
                        <dt className="sr-only">Twitter</dt>
                        <dd>
                          {author.twitter && (
                            <Link
                              href={author.twitter}
                              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              {author.twitter
                                .replace('https://twitter.com/', '@')
                                .replace('https://x.com/', '@')}
                            </Link>
                          )}
                        </dd>
                      </dl>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
            <div className="divide-y divide-gray-200 xl:col-span-1 xl:col-start-2 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
              <div className="prose dark:prose-invert max-w-none pt-10 pb-8">{children}</div>
              {siteMetadata.comments && (
                <div
                  className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300"
                  id="comment"
                >
                  <Comments slug={slug} />
                </div>
              )}
              {recommendations.length > 0 && (
                <div className="space-y-4 pt-6">
                  <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                    {recommendationsHeading}
                  </h2>
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {recommendations.map((post) => (
                      <li
                        key={`footer-${post.path}`}
                        className="hover:border-primary-500 dark:hover:border-primary-400 rounded-lg border border-gray-200 p-4 transition-colors dark:border-gray-700"
                      >
                        <Link
                          href={`/${post.path}`}
                          locale={locale}
                          className="hover:text-primary-600 dark:hover:text-primary-400 text-base font-semibold text-gray-900 dark:text-gray-100"
                        >
                          {post.title}
                        </Link>
                        {post.summary && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            {post.summary}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {(next || prev) && (
                <nav className="flex justify-between py-4 text-sm font-medium text-gray-700 xl:py-8 dark:text-gray-300">
                  {prev && prev.path && (
                    <div>
                      <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                        Previous Article
                      </h2>
                      <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                        <Link href={`/${prev.path}`} locale={locale}>
                          {prev.title}
                        </Link>
                      </div>
                    </div>
                  )}
                  {next && next.path && (
                    <div className="text-right xl:text-left">
                      <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                        Next Article
                      </h2>
                      <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                        <Link href={`/${next.path}`} locale={locale}>
                          {next.title}
                        </Link>
                      </div>
                    </div>
                  )}
                </nav>
              )}
            </div>
            <aside className="pt-6 text-sm leading-5 font-medium xl:col-span-1 xl:col-start-3 xl:row-span-2 xl:pt-11">
              <div className="space-y-8 xl:sticky xl:top-32 xl:h-fit">
                {tags && tags.length > 0 && (
                  <div>
                    <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                      Tags
                    </h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} locale={locale} />
                      ))}
                    </div>
                  </div>
                )}
                <TableOfContents toc={toc} locale={locale} />
                {recommendations.length > 0 && (
                  <div>
                    <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                      {recommendationsHeading}
                    </h2>
                    <ul className="mt-4 space-y-3">
                      {recommendations.map((post) => (
                        <li key={`sidebar-${post.path}`}>
                          <Link
                            href={`/${post.path}`}
                            locale={locale}
                            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            {post.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <Link
                    href={`/${basePath}`}
                    locale={locale}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label="Back to the blog"
                  >
                    &larr; Back to the blog
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
