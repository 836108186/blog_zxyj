import { writeFileSync, mkdirSync, existsSync } from 'fs'
import path from 'path'
import { slug } from 'github-slugger'
import { escape } from 'pliny/utils/htmlEscaper.js'
import siteMetadata from '../data/siteMetadata.js'
import tagData from '../app/tag-data.json' with { type: 'json' }
import { allBlogs } from '../.contentlayer/generated/index.mjs'
import { sortPosts } from 'pliny/utils/contentlayer.js'

const outputFolder = process.env.EXPORT ? 'out' : 'public'

const safeDate = (d) => {
  const dt = new Date(d)
  return isNaN(dt?.getTime?.() ?? NaN) ? null : dt
}

const pickLatestDate = (posts) => {
  const dates = (posts ?? []).map((p) => safeDate(p?.date)).filter(Boolean)
  if (dates.length === 0) return null
  return new Date(Math.max(...dates.map((d) => d.getTime())))
}

const generateRssItem = (config, post) => {
  const pub = safeDate(post?.date) ?? new Date()
  const postSlug = post?.slug ?? ''
  const url = `${config.siteUrl}/blog/${postSlug}`

  return `
  <item>
    <guid>${url}</guid>
    <title>${escape(post?.title ?? '')}</title>
    <link>${url}</link>
    ${post?.summary ? `<description>${escape(post.summary)}</description>` : ''}
    <pubDate>${pub.toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${(post?.tags ?? []).map((t) => `<category>${t}</category>`).join('')}
  </item>`
}

const generateRss = (config, posts, page = 'feed.xml') => {
  const list = Array.isArray(posts) ? posts : []
  const latest = pickLatestDate(list) ?? new Date()

  const sorted = list.slice().sort((a, b) => {
    const da = safeDate(a?.date)?.getTime() ?? 0
    const db = safeDate(b?.date)?.getTime() ?? 0
    return db - da
  })

  return `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/blog</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${latest.toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${sorted.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>`
}

async function generateRSS(config, allBlogsInput, page = 'feed.xml') {
  const publishPosts = (allBlogsInput ?? []).filter((post) => post?.draft !== true)

  if (!existsSync(outputFolder)) {
    mkdirSync(outputFolder, { recursive: true })
  }

  // main feed
  const mainList = sortPosts ? sortPosts(publishPosts) : publishPosts
  const mainRss = generateRss(config, mainList, page)
  writeFileSync(path.join(outputFolder, page), mainRss)

  // tag feeds
  const tags = Object.keys(tagData ?? {})
  for (const tag of tags) {
    const filtered = (publishPosts ?? []).filter((post) =>
      (post?.tags ?? []).map((t) => slug(t)).includes(tag)
    )
    if (filtered.length === 0) continue

    const rss = generateRss(
      config,
      sortPosts ? sortPosts(filtered) : filtered,
      `tags/${tag}/${page}`
    )
    const rssPath = path.join(outputFolder, 'tags', tag)
    mkdirSync(rssPath, { recursive: true })
    writeFileSync(path.join(rssPath, page), rss)
  }
}

const rss = () => {
  return generateRSS(siteMetadata, allBlogs)
    .then(() => {
      console.log('RSS feed generated...')
    })
    .catch((err) => {
      console.error('RSS generation failed:', err)
      process.exitCode = 1
    })
}

export default rss
