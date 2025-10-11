import { resolveLocaleParam } from '@/lib/i18n'

import { createTagListingMetadata } from '../../../(site)/tags/page'

export { default } from '../../../(site)/tags/page'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params
  const locale = resolveLocaleParam(params)
  return createTagListingMetadata(locale)
}
