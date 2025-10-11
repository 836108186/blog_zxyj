import type { ReactNode } from 'react'

import siteMetadata from '@/data/siteMetadata'
import { Locale, normalizeLocale } from './i18n'

type LocalizedSiteMetadata = typeof siteMetadata & {
  language: string
  locale: string
  title: string
  headerTitle: string | ReactNode
  description: string
}

export function getSiteMetadata(inputLocale?: string | null): LocalizedSiteMetadata {
  const locale = normalizeLocale(inputLocale) as Locale
  const localized = siteMetadata.i18n?.[locale]
  return {
    ...siteMetadata,
    title: localized?.title ?? siteMetadata.title,
    headerTitle: localized?.headerTitle ?? siteMetadata.headerTitle,
    description: localized?.description ?? siteMetadata.description,
    language: localized?.languageTag ?? siteMetadata.language,
    locale: localized?.locale ?? siteMetadata.locale,
  }
}

export function getCommentsLocale(locale?: string | null) {
  const normalized = normalizeLocale(locale)
  if (normalized === 'zh') {
    return 'zh-CN'
  }
  return 'en'
}
