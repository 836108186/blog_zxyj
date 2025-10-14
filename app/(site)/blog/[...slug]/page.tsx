import 'css/prism.css'
import 'katex/dist/katex.css'

import PageTitle from '@/components/PageTitle'
import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent, allCoreContent, CoreContent } from 'pliny/utils/contentlayer'
import { allBlogs, allAuthors } from 'contentlayer/generated'
import type { Authors, Blog } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { resolveKeywords } from '@/lib/keywords'
import { getSiteMetadata } from '@/lib/site'
import { notFound } from 'next/navigation'
import { getDocumentLocale, normalizeLocale } from '@/lib/i18n'

const RECOMMENDED_POST_LIMIT = 4

const getRecommendedPosts = (
  currentPost: CoreContent<Blog>,
  candidates: CoreContent<Blog>[]
): CoreContent<Blog>[] => {
  const currentTags = new Set(currentPost.tags ?? [])
  const currentLocale = getDocumentLocale(currentPost.lang)
  const uniqueCandidates = candidates.filter((post, index, array) => {
    return array.findIndex((item) => item.slug === post.slug) === index
  })
  const localeCandidates = uniqueCandidates.filter(
    (post) => getDocumentLocale(post.lang) === currentLocale
  )

  const scored = localeCandidates
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      const overlappingTags = (post.tags ?? []).reduce(
        (total, tag) => total + (currentTags.has(tag) ? 1 : 0),
        0
      )
      const score = overlappingTags * 10 + 5
      const publishedAt = post.date ? new Date(post.date).getTime() : 0
      return {
        post,
        score,
        publishedAt,
      }
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score
      }
      return b.publishedAt - a.publishedAt
    })

  const recommendations: CoreContent<Blog>[] = []
  for (const { post } of scored) {
    if (recommendations.length >= RECOMMENDED_POST_LIMIT) {
      break
    }
    recommendations.push(post)
  }

  if (recommendations.length < RECOMMENDED_POST_LIMIT) {
    for (const post of localeCandidates) {
      if (recommendations.length >= RECOMMENDED_POST_LIMIT) {
        break
      }
      if (post.slug === currentPost.slug) {
        continue
      }
      if (!recommendations.some((entry) => entry.slug === post.slug)) {
        recommendations.push(post)
      }
    }
  }

  return recommendations.slice(0, RECOMMENDED_POST_LIMIT)
}

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = allBlogs.find((p) => p.slug === slug)
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  if (!post) {
    return
  }

  const keywords = resolveKeywords(post.keywords, post.tags, post.title)
  const site = getSiteMetadata(post.lang)
  const normalizedSiteUrl = site.siteUrl.replace(/\/+$/, '')
  const postPath = `blog/${post.slug}`
  const postUrl = `${normalizedSiteUrl}/${postPath}`
  const feedUrl = `${normalizedSiteUrl}/feed.xml`

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img && img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })

  return {
    title: post.title,
    description: post.summary,
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: site.title,
      locale: site.locale,
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: postUrl,
      images: ogImages,
      authors: authors.length > 0 ? authors : [site.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
    alternates: {
      canonical: postUrl,
      types: {
        'application/rss+xml': feedUrl,
      },
    },
  }
}

export const getBlogStaticParams = (locale?: string) => {
  const targetLocale = normalizeLocale(locale)
  return allBlogs
    .filter((post) => getDocumentLocale(post.lang) === targetLocale)
    .map((p) => ({ slug: p.slug.split('/').map((name) => decodeURI(name)) }))
}

export const generateStaticParams = async () => {
  return getBlogStaticParams()
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  // Filter out drafts in production
  const sortedCoreContents = allCoreContent(sortPosts(allBlogs))
  const post = allBlogs.find((p) => p.slug === slug) as Blog
  if (!post) {
    return notFound()
  }

  const targetLocale = getDocumentLocale(post.lang)
  const localeCoreContents = sortedCoreContents.filter(
    (entry) => getDocumentLocale(entry.lang) === targetLocale
  )
  const postIndex = localeCoreContents.findIndex((p) => p.slug === slug)
  if (postIndex === -1) {
    return notFound()
  }

  const prev = localeCoreContents[postIndex + 1]
  const next = localeCoreContents[postIndex - 1]
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  const mainContent = coreContent(post)
  const jsonLd = post.structuredData
  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
    }
  })

  const layoutKey = post.layout || defaultLayout
  const Layout = layouts[layoutKey]
  const recommendationCandidates =
    localeCoreContents.length > 1 ? localeCoreContents : sortedCoreContents
  const recommendedPosts =
    layoutKey === 'PostLayout' ? getRecommendedPosts(mainContent, recommendationCandidates) : []

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {layoutKey === 'PostLayout' ? (
        <PostLayout
          content={mainContent}
          authorDetails={authorDetails}
          next={next}
          prev={prev}
          recommendedPosts={recommendedPosts}
        >
          <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
        </PostLayout>
      ) : (
        <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
          <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
        </Layout>
      )}
    </>
  )
}
