import type { PageProps } from 'next'
import { DEFAULT_LOCALE, resolveLocaleParam } from '@/lib/i18n'
import { AboutPageContent } from './AboutPageContent'
import { createAboutMetadata } from './metadata'
export const metadata = createAboutMetadata()

type AboutPageParams = PageProps<{ locale?: string | null }>


export default function Page({ params }: AboutPageParams) {
  const locale = resolveLocaleParam(params, DEFAULT_LOCALE)
  return <AboutPageContent locale={locale} />
}