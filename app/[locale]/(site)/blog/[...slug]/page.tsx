import { expandStaticParamsForLocales } from '@/lib/i18n'

import { getBlogStaticParams } from '../../../../(site)/blog/[...slug]/page'

export { generateMetadata, default } from '../../../../(site)/blog/[...slug]/page'

export const generateStaticParams = async () => {
  return expandStaticParamsForLocales((locale) => getBlogStaticParams(locale))
}
