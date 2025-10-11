import { resolveLocaleParam } from '@/lib/i18n'

import { createBlogListingMetadata } from '../../../(site)/blog/page'

export { default } from '../../../(site)/blog/page'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params
  const locale = resolveLocaleParam(params)
  return createBlogListingMetadata(locale)
}
