import { resolveLocaleParam } from '@/lib/i18n'

// 改为默认导入，避免组件为 undefined
import AboutPageContent from '../../../(site)/about/AboutPageContent'
import { createAboutMetadata } from '../../../(site)/about/metadata'

export default async function Page({ params }: { params: { locale: string } }) {
  const locale = resolveLocaleParam(params)
  return <AboutPageContent locale={locale} />
}

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const locale = resolveLocaleParam(params)
  return createAboutMetadata(locale)
}