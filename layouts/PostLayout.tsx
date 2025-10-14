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
  const backToBlogLabel = locale === 'zh' ? '返回博客' : 'Back to the blog'

  return (
    <SectionContainer>
      <ScrollTopAndComment />
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
      <div className="space-y-10 xl:grid xl:grid-cols-[260px_minmax(0,1fr)_320px] xl:items-start xl:gap-12 xl:space-y-0">
        <aside className="pt-6 pb-10 text-sm leading-5 xl:sticky xl:top-32 xl:h-fit xl:border-r xl:border-gray-200 xl:pt-0 xl:pr-8 xl:pb-0 xl:dark:border-gray-700">
          <div className="space-y-10">
            <dl>
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
            <div>
              <Link
                href={`/${basePath}`}
                locale={locale}
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                aria-label={backToBlogLabel}
              >
                &larr; {backToBlogLabel}
              </Link>
            </div>
          </div>
        </aside>
        <article className="xl:col-start-2 xl:max-w-none">
          <div className="divide-y divide-gray-200 pb-8 dark:divide-gray-700">
            <div className="prose dark:prose-invert max-w-none pb-8">{children}</div>
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
            {siteMetadata.comments && (
              <div className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300" id="comment">
                <Comments slug={slug} />
              </div>
            )}
          </div>
          {recommendations.length > 0 && (
            <div className="space-y-4 pt-6 xl:hidden">
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
        </article>
        {recommendations.length > 0 && (
          <aside className="hidden text-sm leading-5 xl:sticky xl:top-32 xl:col-start-3 xl:block xl:h-fit xl:w-full xl:max-w-xs">
            <div className="space-y-6 xl:flex xl:h-fit xl:flex-col">
              <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-6 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/70">
                <h2 className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-400">
                  {recommendationsHeading}
                </h2>
                <ul className="mt-4 space-y-4">
                  {recommendations.map((post) => (
                    <li key={`sidebar-${post.path}`} className="group">
                      <Link
                        href={`/${post.path}`}
                        locale={locale}
                        className="group-hover:text-primary-600 dark:group-hover:text-primary-400 text-base font-semibold text-gray-900 transition-colors dark:text-gray-100"
                      >
                        {post.title}
                      </Link>
                      {post.summary && (
                        <p className="mt-1 text-sm leading-6 text-gray-600 transition-colors group-hover:text-gray-700 dark:text-gray-300 dark:group-hover:text-gray-200">
                          {post.summary}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        )}
      </div>
    </SectionContainer>
  )
}
