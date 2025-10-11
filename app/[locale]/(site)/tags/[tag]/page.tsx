import { expandStaticParamsForLocales, resolveLocaleParam } from '@/lib/i18n'

import { createTagDetailMetadata, getTagStaticParams } from '../../../../(site)/tags/[tag]/page'

export { default } from '../../../../(site)/tags/[tag]/page'

export async function generateMetadata(props: {
  params: Promise<{ locale: string; tag: string }>
}) {
  const params = await props.params
  const locale = resolveLocaleParam(params)
  const tag = decodeURI(params.tag)
  return createTagDetailMetadata(tag, locale)
}

export const generateStaticParams = async () => {
  return expandStaticParamsForLocales((locale) => getTagStaticParams(locale))
}
