import { DEFAULT_LOCALE, resolveLocaleParam } from '@/lib/i18n'
import { createAboutMetadata } from './metadata'
import AboutPageContent from './AboutPageContent'

export const metadata = createAboutMetadata()

type AboutPageParams = { params: Promise<{ locale?: string }> }

// 确保只有默认导出和其他 Next.js 允许的导出
export default async function Page({ params }: AboutPageParams) {
  const resolvedParams = await params
  const locale = resolveLocaleParam(resolvedParams, DEFAULT_LOCALE)
  return <AboutPageContent locale={locale} />
}
