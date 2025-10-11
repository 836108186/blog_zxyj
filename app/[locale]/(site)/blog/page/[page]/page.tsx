import { expandStaticParamsForLocales } from '@/lib/i18n'

import { getBlogPageStaticParams } from '../../../../../(site)/blog/page/[page]/page'

export { default } from '../../../../../(site)/blog/page/[page]/page'

export const generateStaticParams = async () => {
  return expandStaticParamsForLocales((locale) => getBlogPageStaticParams(locale))
}
