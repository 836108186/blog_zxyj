// app/[locale]/(site)/about/page.tsx
import { resolveLocaleParam } from '@/lib/i18n'
import AboutPageContent from '../../../(site)/about/AboutPageContent'
import { createAboutMetadata } from '../../../(site)/about/metadata'

type RouteParams = { locale: string }
type Props = { params: Promise<RouteParams> }

export default async function Page({ params }: Props) {
  const { locale } = await params
  // 如果 resolveLocaleParam 接受 { locale } 对象：
  const normalizedLocale = resolveLocaleParam({ locale })
  // 如果它只接受字符串，改成：const normalizedLocale = resolveLocaleParam(locale)

  return <AboutPageContent locale={normalizedLocale} />
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const normalizedLocale = resolveLocaleParam({ locale })
  return createAboutMetadata(normalizedLocale)
}
