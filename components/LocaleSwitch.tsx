'use client'

import { useI18n } from '@/app/providers/I18nProvider'
import blogLocaleAvailability from '@/app/blog-locale-map.json'
import { useRouter, usePathname } from 'next/navigation'

import { Locale, localizePath, normalizeLocale, stripLocaleFromPath } from '@/lib/i18n'

const BLOG_LOCALE_MAP = blogLocaleAvailability as Record<string, Locale[]>
const HOME_PATHS: Record<Locale, string> = {
  zh: '/',
  en: '/en',
}

function getBlogSlugFromPath(path: string): string | null {
  if (!path.startsWith('/blog')) {
    return null
  }
  const remainder = path.slice('/blog'.length)
  if (!remainder || remainder === '/') {
    return ''
  }
  return remainder.replace(/^\//, '')
}

export default function LocaleSwitch() {
  const { locale, setLocale } = useI18n()
  const router = useRouter()
  const pathname = usePathname()
  const normalized = normalizeLocale(locale)
  const isZh = normalized === 'zh'
  const toggleLocale = () => {
    const basePath = stripLocaleFromPath(pathname || '/')
    const nextLocale = isZh ? 'en' : 'zh'
    setLocale(nextLocale)
    const slug = getBlogSlugFromPath(basePath)
    if (slug) {
      const availableLocales = BLOG_LOCALE_MAP[slug]
      if (!availableLocales || !availableLocales.includes(nextLocale)) {
        router.push(HOME_PATHS[nextLocale])
        return
      }
    }
    router.push(localizePath(basePath, nextLocale))
  }
  return (
    <button
      onClick={toggleLocale}
      className="rounded border px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      aria-label={locale === 'en' ? '切换到中文' : 'Switch to English'}
      title={locale === 'en' ? '切换到中文' : 'Switch to English'}
      type="button"
    >
      {locale === 'en' ? '中文' : 'EN'}
    </button>
  )
}
