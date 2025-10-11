import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'

import { SUPPORTED_LOCALES, isLocale } from '@/lib/i18n'

export const dynamicParams = false

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string } | undefined>
}) {
  const { locale } = (await params) ?? {}

  if (!locale || !isLocale(locale)) {
    notFound()
  }

  return children
}
