import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'

import { SUPPORTED_LOCALES, isLocale } from '@/lib/i18n'

export const dynamicParams = false

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { locale: string }
}) {
  if (!isLocale(params.locale)) {
    notFound()
  }

  return children
}
