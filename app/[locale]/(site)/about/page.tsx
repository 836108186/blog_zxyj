import { resolveLocaleParam } from '@/lib/i18n'

import { AboutPageContent } from '../../../(site)/about/AboutPageContent'
import { createAboutMetadata } from '../../../(site)/about/metadata'

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params
  const locale = resolveLocaleParam(params)
  return <AboutPageContent locale={locale} />
}

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params
  const locale = resolveLocaleParam(params)
  return createAboutMetadata(locale)
}
