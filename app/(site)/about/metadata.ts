import { genPageMetadata } from 'app/seo'

import { Locale, normalizeLocale } from '@/lib/i18n'

export const ABOUT_TITLES: Record<Locale, string> = {
  en: 'About',
  zh: '关于',
}

export function createAboutMetadata(locale?: string | null) {
  const normalized = normalizeLocale(locale)
  return genPageMetadata({ title: ABOUT_TITLES[normalized], locale: normalized })
}
