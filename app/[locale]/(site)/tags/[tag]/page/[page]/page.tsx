import { expandStaticParamsForLocales } from '@/lib/i18n'

import { getTagPageStaticParams } from '../../../../../../(site)/tags/[tag]/page/[page]/page'

export { default } from '../../../../../../(site)/tags/[tag]/page/[page]/page'

export const generateStaticParams = async () => {
  return expandStaticParamsForLocales((locale) => getTagPageStaticParams(locale))
}
