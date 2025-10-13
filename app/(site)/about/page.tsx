import { DEFAULT_LOCALE, resolveLocaleParam } from '@/lib/i18n'
import { AboutPageContent } from './AboutPageContent'
import { createAboutMetadata } from './metadata'
export const metadata = createAboutMetadata()

type AboutPageParams = { params?: { locale?: string } }


export default function Page({ params }: AboutPageParams = {}) {
  const locale = resolveLocaleParam(params, DEFAULT_LOCALE)
  return <AboutPageContent locale={locale} />
}