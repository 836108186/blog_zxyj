import { resolveLocaleParam } from '@/lib/i18n'

import { createAboutMetadata } from '../../../(site)/about/page'

export { default } from '../../../(site)/about/page'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params
  const locale = resolveLocaleParam(params)
  return createAboutMetadata(locale)
}
