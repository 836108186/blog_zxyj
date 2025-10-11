'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'

import { DEFAULT_LOCALE, Locale, getLocaleFromPath, normalizeLocale } from '@/lib/i18n'

type Messages = {
  latest: string
  noPosts: string
  publishedOn: string
  readMore: string
  readMoreAria: string // e.g. Read more: "{title}"
  allPosts: string
  allPostsAria: string
  tags: string
  viewTagged: string // e.g. View posts tagged {tag},
  description: string
  searchLabel: string
  searchPlaceholder: string
  previous: string
  next: string
  paginationStatus: string // e.g. {current} of {total}
  allPostsLabel: string
  noTags: string
}

const messages: Record<Locale, Messages> = {
  en: {
    latest: 'XiaoYan Notes',
    noPosts: 'No posts found.',
    publishedOn: 'Published on',
    readMore: 'Read more →',
    readMoreAria: 'Read more: "{title}"',
    allPosts: 'All Posts →',
    allPostsAria: 'All posts',
    tags: 'Tags',
    viewTagged: 'View posts tagged {tag}',
    description: 'Walking and writing, writing and reflecting.',
    searchLabel: 'Search articles',
    searchPlaceholder: 'Search articles',
    previous: 'Previous',
    next: 'Next',
    paginationStatus: '{current} of {total}',
    allPostsLabel: 'All Posts',
    noTags: 'No tags found.',
  },
  zh: {
    latest: '子小言记的的博客',
    noPosts: '暂无文章。',
    publishedOn: '发布于',
    readMore: '阅读全文 →',
    readMoreAria: '阅读全文：《{title}》',
    allPosts: '所有文章 →',
    allPostsAria: '所有文章',
    tags: '标签',
    viewTagged: '查看标签为 {tag} 的文章',
    description: '边走边写，边写边想',
    searchLabel: '搜索文章',
    searchPlaceholder: '搜索文章',
    previous: '上一页',
    next: '下一页',
    paginationStatus: '{current} / {total}',
    allPostsLabel: '全部文章',
    noTags: '暂无标签。',
  },
}

type I18nCtx = {
  locale: Locale
  t: (key: keyof Messages, vars?: Record<string, string | number>) => string
  setLocale: (l: Locale) => void
  toggleLocale: () => void
}

const Ctx = createContext<I18nCtx | null>(null)

type I18nProviderProps = {
  children: React.ReactNode
  initialLocale?: string | null
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const pathname = usePathname()
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (initialLocale) {
      return normalizeLocale(initialLocale)
    }
    return getLocaleFromPath(pathname)
  })

  const updateLocale = useCallback((next: Locale) => {
    setLocaleState((prev) => {
      const normalized = normalizeLocale(next)
      return prev === normalized ? prev : normalized
    })
  }, [])

  const updateLocaleFromPath = useCallback(
    (path?: string | null) => {
      if (!path) return
      const nextLocale = getLocaleFromPath(path)
      updateLocale(nextLocale)
    },
    [updateLocale]
  )

  useEffect(() => {
    updateLocaleFromPath(pathname)
  }, [pathname, updateLocaleFromPath])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement
      html.lang = locale === 'zh' ? 'zh-CN' : 'en-US'
    }
  }, [locale])

  const t = React.useCallback<I18nCtx['t']>(
    (key, vars) => {
      const msg = messages[locale][key] as string
      if (!vars) return msg
      return msg.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''))
    },
    [locale]
  )

  const value = useMemo<I18nCtx>(
    () => ({
      locale,
      t,
      setLocale: updateLocale,
      toggleLocale: () => updateLocale(locale === 'en' ? 'zh' : 'en'),
    }),
    [locale, t, updateLocale]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

// 新增：默认导出，避免导入方式不一致
export default I18nProvider
