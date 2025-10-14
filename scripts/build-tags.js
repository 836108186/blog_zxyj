#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const { slug: slugify } = require('github-slugger')

const ROOT = process.cwd()
const BLOG_DIR = path.join(ROOT, 'data', 'blog')
const TAG_OUTPUT = path.join(ROOT, 'app', 'tag-data.json')
const BLOG_LOCALE_OUTPUT = path.join(ROOT, 'app', 'blog-locale-map.json')
const siteMetadata = require(path.join(ROOT, 'data', 'siteMetadata.js'))

const SUPPORTED_CONTENT_LOCALES = new Set(
  Array.isArray(siteMetadata?.locales)
    ? siteMetadata.locales.map((locale) => String(locale).toLowerCase())
    : ['zh', 'en']
)
const DEFAULT_CONTENT_LOCALE = String(siteMetadata?.defaultLocale || 'zh')
  .toLowerCase()
  .startsWith('zh')
  ? 'zh'
  : 'en'

function ensureDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true })
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries.flatMap((e) => {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) return walk(full)
    return e.isFile() && /\.(md|mdx)$/i.test(e.name) ? [full] : []
  })
}

function main() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`Missing blog dir: ${BLOG_DIR}`)
    process.exit(1)
  }

  const files = walk(BLOG_DIR)
  const tagsMap = new Map()
  const blogLocaleMap = {}

  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8')
    const { data } = matter(src)
    const tags = Array.isArray(data?.tags) ? data.tags.filter(Boolean) : []
    const relativePath = path
      .relative(BLOG_DIR, file)
      .replace(/\\/g, '/')
      .replace(/\.(md|mdx)$/i, '')

    const segments = relativePath.split('/').filter(Boolean)
    const localeSegment =
      segments.length > 0 && SUPPORTED_CONTENT_LOCALES.has(segments[0].toLowerCase())
        ? segments[0].toLowerCase()
        : null

    const slugSegments = localeSegment ? segments.slice(1) : segments
    const postSlug = slugSegments.join('/')

    const title = typeof data.title === 'string' ? data.title : postSlug

    let locale = DEFAULT_CONTENT_LOCALE
    if (typeof data?.lang === 'string') {
      const lowerLang = data.lang.toLowerCase()
      if (lowerLang.startsWith('zh')) {
        locale = 'zh'
      } else if (lowerLang.startsWith('en')) {
        locale = 'en'
      }
    } else if (localeSegment) {
      locale = localeSegment
    } else {
      locale = 'en'
    }

    if (tags.length > 0) {
      for (const tag of tags) {
        const key = slugify(String(tag))
        const recKey = `${locale}::${key}`
        const rec = tagsMap.get(recKey) || { count: 0, posts: [], locale, tag: key }
        rec.count += 1
        rec.posts.push({ slug: postSlug, title })
        tagsMap.set(recKey, rec)
      }
    }

    if (postSlug) {
      const locales = blogLocaleMap[postSlug] || (blogLocaleMap[postSlug] = new Set())
      locales.add(locale)
    }
  }

  const localeMap = {}
  for (const [, rec] of tagsMap) {
    const localeEntries = localeMap[rec.locale] || (localeMap[rec.locale] = {})
    localeEntries[rec.tag] = rec.count
  }

  ensureDir(path.dirname(TAG_OUTPUT))
  fs.writeFileSync(TAG_OUTPUT, `${JSON.stringify(localeMap, null, 2)}\n`, 'utf8')

  const normalizedBlogLocaleMap = Object.keys(blogLocaleMap)
    .sort()
    .reduce((acc, key) => {
      acc[key] = Array.from(blogLocaleMap[key]).sort()
      return acc
    }, {})

  ensureDir(path.dirname(BLOG_LOCALE_OUTPUT))
  fs.writeFileSync(
    BLOG_LOCALE_OUTPUT,
    `${JSON.stringify(normalizedBlogLocaleMap, null, 2)}\n`,
    'utf8'
  )

  console.log(
    `Wrote ${TAG_OUTPUT} with ${Object.values(localeMap).reduce((acc, v) => acc + Object.keys(v).length, 0)} tags from ${files.length} posts`
  )
  console.log(
    `Wrote ${BLOG_LOCALE_OUTPUT} with ${Object.keys(normalizedBlogLocaleMap).length} blog slugs`
  )
}

main()
